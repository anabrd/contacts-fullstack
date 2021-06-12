const mongoose = require('mongoose');

// Schema for contact
const contacts = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    phone: {
        type: String,
        minLength: [5, 'my custom error message'],
        maxLength: 15
    },
    address: {
        type: String
    },
    contactPic: {
        type: String
    },
    userId: String
});

// First contacts is the collection name, the second one is our constant
module.exports = mongoose.model('contacts', contacts);