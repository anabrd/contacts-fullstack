const express = require('express');
require('dotenv').config();
const contacts = require('./router/contacts');
const connectDB = require('./config/db');
const app = express();
const port = process.env.PORT || 8080;
const auth = require('./router/auth');
const authMid = require('./middleware/auth');
const publicViews = require('./router/publicViews');
const publicRoutes = require('./router/public')
const hbs = require('hbs');
const path = require('path')

connectDB();

app.use(express.json());

app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(path.resolve(__dirname, "../frontend/build")));

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE");
    next();
}

app.use(allowCrossDomain);

// This provides public access to the folfer specified in the static
app.use(express.static(path.resolve(__dirname, "../frontend/build")));



app.listen(port, () => (console.log(`Server started to run on port ${port}.`)));

// Routes
app.use('/auth', auth);
app.use('/contacts', authMid.checkAuth, contacts)
app.use('/pages', publicViews)
app.use('/', publicRoutes)
// If it doesn't file any route, it will go into build folder
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});