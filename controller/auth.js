const users = require('../model/users');
const jwt = require('jsonwebtoken');
const jwtSKey = process.env.JWT_S_KEY;
// bcrypt = encryption npm package
const bcrypt = require('bcrypt');

exports.registerPost = async (req, res) => {

    let {email, pass} = req.body;

    // hashing of the password
    // This is async!
    // First aargument is plain password, the second one amound of salt rounds
    pass = await bcrypt.hash(pass, 10);

    const newUser = new users({email, pass});

    await users.findOne({email: req.body.email}, (err, doc) => {
        console.log(pass)
        if (err) {
            console.log(err);
            res.send({status: "failed", message:"Something went wrong."})
        // This is if the record already exists
        } else if (doc !== null) {
            res.status(406).send({status: "failed", message:"Email already in use."})
        } else {
            newUser.save((err, doc) => {
                if (err) {
                    res.send({status: "failed", message:"Something went wrong."})
                } else {
                    res.send({status: "success", message:"The account created successfully."})
                }
            })
        }
    });
}

exports.loginPost = (req, res) => {

    let {email, pass} = req.body;

    users.findOne({email}, async (err, doc) => {
        if (err) {
            res.send({status: "failed", message: err})
        // This is if the record already exists
        } else if (doc == null) {
            res.status(406).send({status: "failed", message: "Wrong credentials."})
        } else {
            // Since bcrypt uses different salt for hashing we have to use the compare method
            const match = await bcrypt.compare(pass, doc.pass)
            if (match) {
                const token = jwt.sign({id:doc._id}, jwtSKey, {expiresIn: '1d'})
                res.send({status: "success", message:"User logged in successfully.", token})
            } else {
                res.send({status: "failed", message:"There was an error. Please try again later."})
            }
        }
    });
}