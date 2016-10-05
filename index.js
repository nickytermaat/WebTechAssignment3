/**
 * Created by Kris on 9/28/2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;
var Movie = require('MovieSchema.js');
var User = require('userSchema.js');
var router = require('jsonToken.js');

//Register bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set and start the server
var Server =
    app.listen(3000, function(){
    console.log("Example app on port" + Server.address().port);
    var user1 = new User({name: 'Kris'});
    user1.save(function(err, result){
        if(err){
            return console.error(err);
        }
    });

    console.log("test");
});

app.get('list', function(req, res){
   var token = req.headers['authorization'];

    jwt.verify(token, app.get('private-key'), function(error, decoded){
        if(err){
            //Something went wrong
        } else {
            //Do something with the decoded parameter
        }
    })
});
