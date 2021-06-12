const logModel = require('../model/logs')

exports.logger = (req, res, next) => {
    // req.originalUrl gives us the relative path of the HTTP request

    console.log("inside logger")
    const log = new logModel({
        dateTime: Date.now(),
        path: req.originalUrl
    });
    
    log.save((err, doc) => {
            if (err) {
                console.log(err)
                res.status(500).send({status: "failed", message: "Please try again.", data: err});
            } else {
                req.logId = doc._id;
                console.log("test id from the logger", req.logId);
                next();
            }
        })
}
