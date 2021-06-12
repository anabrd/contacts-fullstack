// function that runs between the req and res
// next is crucial - without it, the function won't move to the response
exports.test = (req, res, next) => {
    console.log("Middleware started", req, "Middleware finished!");
    // we can update the object in the middleware before sending it to response
    req.body.isValid = true;

    if (req.body.isValid) {
        next();
    } else {
        // if the condition isn't met, the req will not move onto the contorller
        // it will instead send the response directly from here
        // middleware is also a good place to send status codes
        // e.g. 401 for unauthorized
        res.status(401).send({status: "failed", message:"Request is not valid."});
    }
}