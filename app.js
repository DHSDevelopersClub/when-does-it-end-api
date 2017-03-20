// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

// require config files and data
let schools = require('./schools.json');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/:school/:dayi', function (req, res) {
    if (req.params.dayi < 0 || req.params.dayi > 6) {
        res.json({
            error: 'Invalid day'
        });
    } else if(!schools.includes(req.params.school)){
        res.json({
            error: "Unknown school",
            school: req.params.school
        })
    } else {
        let schedule = require('./' + req.params.school);
        let day = schedule[req.params.dayi];
        res.json({
            data: day
        });
    }
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

setInterval(function() {
    http.get("http://when-does-it-end-api.herokuapp.com");
}, 300000); // every 5 minutes (300000)