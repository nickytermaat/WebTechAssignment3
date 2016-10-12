/**
 * Created by Kris on 10/12/2016.
 */
var jwt = require('jsonwebtoken');
var express = require('express');
var User = require('userSchema.js');

module.exports.authenticate = function(req, res){
    //Check if username and password are correct.
    User.findOne({'name': req.body.name, 'password' : req.body.password}, 'name').exec(function (err, user){
        if(err){
            res.send(err);
        } else{
            if(user != null){
                var token = jwt.sign({username: user.name, field:'data'}, "Thisismysecretkey");
                res.send(token);
            } else {
                res.send("Wrong username or password");
            }
        }
    });
};

module.exports.addUser = function(req, res){
    var newUser = new User({"name" : req.body.name, "password": req.body.password});
    newUser.save(function(error, result){
        if(error){
            res.status(400);
            res.send("Bad request");
        } else {
            res.status(200);
            res.send("user registered!");
        }
    })
};

module.exports.getAllUsers = function (req, res) {
    //Authenticate
    var token = req.headers["authentication"];
    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.send(error);
        } else {
            //Is authorized
            User.find({}, "name").exec(function(error, result){
                if(error){
                    res.status(400);
                    res.send("Bad request");
                } else {
                    if(result == null){
                        res.status(404);
                        res.send("That user was not found");
                    } else {
                        res.status(200);
                        res.send(result);
                    }
                }
            })
        }
    });
}

module.exports.getUser = function (req, res) {
    //Authenticate
    var token = req.headers["authentication"];
    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.send(error);
        } else {
            //Is authorized
            User.findOne({"name" : req.params.name}, "name").exec(function(error, result){
                if(error){
                    res.status(400);
                    res.send("Bad request");
                } else {
                    if(result == null){
                        res.status(404);
                        res.send("That user was not found");
                    } else {
                        res.status(200);
                        res.send(result);
                    }
                }
            })
        }
    });
};