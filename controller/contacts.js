const contacts = require('../model/contacts');
const logModel = require('../model/logs');
require('mongoose').Promise = global.Promise;
const multer = require('multer');
// Path is a native node.js import
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/static/media')
    },
    filename: function(req, file, callback) {
        // The timestamps will give a unique filename on the server
        // Path.extname provides the extension of the original file
        callback(null, 'a' + Date.now() + path.extname(file.originalname))
    }
});

// Connecting stirage settings to multer
const upload = multer({storage: storage}).single('contactPic');

exports.getAll = (req, res) => {
    // if you want the entrire collection you need to put in an empty query
    contacts.find({userId: req.userId}, (err, docs) => 
        {
            if (err) {
                // 500 is the internal server error status code
                res.status(500).send({status: "failed", message: err});
            } else {
                res.send({status: "success", message: "Success", data: docs});
            }
        });
}

exports.deleteContact = (req, res) => {
    // you can also use find by id (only works with id and returns only the collection deleted)
    const id = req.params.id;
    const logId = req.logId;
    contacts.findByIdAndDelete(id, (err, doc) => {
    // contacts.deleteOne({_id: req.params.id}, (err, docs) => {
        if (err) {
            res.send({status: "failed", message: err});
        } else if (doc === null) {
            res.send({status: "failed", message: "There was no contact."})
        } else {
            // You have to use the callback function in this method, it doesn't work otherwise
            logModel.findByIdAndUpdate(logId, {preData: JSON.stringify(doc)}, {new: true}, (docErr, docLog) => {
                if (err) {
                    console.log(docErr);
                } else {
                    console.log(docLog);
                    
                }
            })

            try {
                fs.unlinkSync('/static/media/' + doc.contactPic);
                console.log("deleted")
            } catch (err) {
                // handle the error
                console.log(err);
            }

            res.send({
                status: "success", 
                message: `${doc.fullName} deleted.`,
                data: doc._id
            })
        }})
}

exports.updateContact = (req,res) => {

    upload(req, res, async (err) => {
        if (err) {
            console.log({err})
        }

        const contact = {...req.body};
        if (req.file) {
            contact.contactPic = req.file.filename;
        }

    // You have to add a runValidators object because otherwise the validation won't happen
    contacts.findByIdAndUpdate(contact._id, contact, {upsert: true, runValidators: true}, (err,doc)=>{
        if (err) {
            console.log(err);
            res.send({status:'failed', message: "Could not update."});
        } else {
            if (contact.contactPic) {
                try {
                    fs.unlinkSync('/static/media/' + doc.contactPic);
                    console.log("deleted")
                } catch (err) {
                    // handle the error
                }
            }
            console.log(doc);
            logModel.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc), postData: JSON.stringify(contact)}, (err) => {})
            res.send(({status:'success', message: 'Contact updated successfully', data: doc}));
        }
    });

    // You can also update with save, if you want to update the object based on only some keys (then you don't update the whole object)
    /* const updatedContact = await contacts.findById(contact._id);

    Object.keys(contact).forEach(key => updatedContact[key] = contact[key]);

    updatedContact.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({status: "failed", message: err});
        } else { */
            // UPDATE ONLY PRE AND POST DATA
            // logModel.findByIdAndUpdate(logId, log, {upsert: true, new: true}, (err, docLog)=> {
            //     if (err) {
            //         console.log(err);
            //         res.send({status:'failed', message: err});
            //     } else {
            //         console.log(docLog);
            //         res.send(({status:'success', message: 'Contact updated successfully'}));
            //     }
            // });

            // console.log(doc);
            // res.send({status: "success", message: "Contact updated successfully!"})
    //     }
    // })
        })
};

exports.addContact = (req, res) => {
    // Have to make it async/await because it takes time to download/parse file
    upload(req, res, async (err) => {
        if (err) {
            console.log({err})
        } 
        
        const {fullName, email, phone, address} = req.body;

        let newContact = new contacts({fullName, email, phone, address, userId: req.userId});

        if (req.file) {
            newContact.contactPic = req.file.filename
        }

        await newContact.save((err, doc) => {
            console.log("new contact in save", newContact)
            if (err) {
                res.send({status:"failed", message:"Something went wrong."})
            } else {
                res.send({status:"success", message:"New contact added.", data: doc})
            }
        })
    }
    )

    console.log("controller after multer", req.body, req.file)
}