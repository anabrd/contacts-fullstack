const router = require('express').Router();
const controller = require('../controller/public')

router.get('/test', (req, res) => res.sendFile(path.join(__dirname, '../view/test.html')));
router.get('/about', controller.about);

module.exports = router;