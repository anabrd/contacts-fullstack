const contacts = require('../model/contacts')
const nodemailer = require("nodemailer")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'attachments')
    },
    filename: function(req, file, callback) {
        // The timestamps will give a unique filename on the server
        // Path.extname provides the extension of the original file
        console.log(file)
        callback(null, 'f' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage}).array("attachs");

exports.about = (req, res) => {

    contacts.find({}, (err, docs) => {
        if (err) {
            res.render('about', {testData: "There's a problem. Please try again."})
        } else {
            res.render('about', {testData: docs})
        }
    })
}

exports.contact = (req, res) => {
    console.log(req.body);
    console.log("in contact");

    // in order to catch the error if something is wrong, we need to do try and catch

    // This has to be async because the sendMail function needs to be await
    upload(req, res, async (err) => {
        console.log(req.body, req.files)

        if (err) {
            console.log(err);
        }

        try {
            // This creates a fake test account on Ethereal
            //let testAccount = await nodemailer.createTestAccount();
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                /* port: 587,
                secure: false,  */// true for 465, false for other ports
                auth: {
                    user: 'anaforcs50x@gmail.com', // generated ethereal user
                    pass: process.env.GMAIL, // generated ethereal password
                },
            });

            const attachs = () => {
                if (req.files) {
                    return req.files.map(file => {return {path: file.path}})
                } else {
                    return []
                }
            }
            console.log("attachment", req.files)
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Visitor" <visitor@example.com>', // sender address
                to: "ana.d.brdar@gmail.com", // list of receivers
                subject: "Ticket from " + req.body.fullName, // Subject line
                text: req.body.message, // plain text body
                html: `<b>${req.body.message}</b>`, // html body
                // attachments needs to take in an array (even if you only have one file)
                attachments: attachs()
            });

            console.log("Message sent: %s", info.messageId);
            res.json({status:'success', message: 'Congratulations!'});
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            } catch (err) {
                console.log(err);
                res.status(401).json({status: 'failed', message: err})
            }
    })
}