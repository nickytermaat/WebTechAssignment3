/**
 * Created by Kris on 9/28/2016.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;


var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Hello, World!");
});
app.listen(3000, function(){
    console.log("Example app on port 3000");
});
app.get('/test', function(req, res){
   res.send("Hoi test werkt");
});

app.get('/movies', function(req, res) {
    res.send("Displaylist of movies");

});
app.get('/movies/*', function(req, res) {
    res.send("Display movie with id: " +req.params[0]);
});

