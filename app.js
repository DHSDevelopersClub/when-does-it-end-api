// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
let http = require('http');

// require config files and data
let schools = require('./schools.json');

// initiate the date object
let date = new Date();
let dayi = date.getDay();

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
    console.log('Recived a ' + req.method + ' request from ' + req.ip + ' on ' + req.hostname + ' to ' + req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/schools', (req,res) => {
    res.json(schools);
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/:school', function (req, res) {
    if(!schools.includes(req.params.school)){
        res.json({
            error: "Unknown school",
            school: req.params.school
        })
    } else {
        let schedule = require('./' + req.params.school);
        let day = schedule[dayi-1];
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