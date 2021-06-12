const jwt = require('jsonwebtoken');
const jwtSKey = process.env.JWT_S_KEY;

exports.checkAuth = (req, res, next) => {
    // Token is sent in the header
    const token = req.header('x-auth-token');

    // If you don't have express router, it won't be able to 
    // handle the extra OPTIONS http request that automatically comes from
    // the browser
    // That's why you need to specify to 200 response for the options request

    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        if (!token) {
            res.status(401).send({status: "failed", message: "Absent token."})
        } else {
            try {
            jwt.verify(token, jwtSKey, (fail, decodedPayLoad) => {
                if (fail) {
                    res.status(401).send({status: "failed", message: "Invalid token."})
                } else if (decodedPayLoad) {
                    // this will attach the id to the reqest, which we can use for mongoose queries
                    req.userId = decodedPayLoad.id;
                    // and only in case of success can we move onto controller with next
                    next();
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    }
}
