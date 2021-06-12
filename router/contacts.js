const contacts = require('express').Router();
const contactsController = require('../controller/contacts');
const auth = require('../middleware/auth');
const logMid = require('../middleware/log');
// Where is the right place to upload multer?

contacts.get('/all', logMid.logger, contactsController.getAll);
contacts.delete('/:id', logMid.logger, contactsController.deleteContact);
contacts.post('/update', logMid.logger, contactsController.updateContact);
contacts.post('/add', logMid.logger, contactsController.addContact);


module.exports = contacts;