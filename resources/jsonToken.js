/**
 * Created by Kris on 10/5/2016.
 */
var jwt = require('jsonwebtoken');
var express = require('express');
var User = require('userSchema.js');

module.exports = authenticate = function(req, res){

    console.log("Working..");
    //Check if username and password are correct.
    console.log(req.body.name + " " + req.body.password);
    User.findOne({'name': req.body.name, 'password' : req.body.password}, 'name').exec(function (err, user){
        if(err){
            res.send(err);
        } else{
            if(user != null){
                var token = jwt.sign({username: user.name, field:'data'}, "Thisismysecretkey");
                res.send(token);
            } else {
                res.send("Wrong username or password");
                res.status = 505;
            }
        }
    });


    //Use database to see if user is logged in

};

