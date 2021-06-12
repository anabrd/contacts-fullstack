const router = require('express').Router();
const controller = require('../controller/public')

router.post('/get-contact', controller.contact)

module.exports = router;