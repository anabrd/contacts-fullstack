const mongoose = require('mongoose');

// Schema for contact
const users = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    pass: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least eight characters.']
    }
});

// First users is the collection name, the second one is our constant
module.exports = mongoose.model('users', users);