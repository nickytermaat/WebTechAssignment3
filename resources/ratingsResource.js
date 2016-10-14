/**
 * Created by Kris on 10/12/2016.
 */
var Rating = require('ratingSchema.js');
var jwt = require("jsonwebtoken");

module.exports.addRating = function (req, res) {
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.json({"Error" : error});
        } else {
            var rating = new Rating({"userName": result.username, "ttNumber" : req.body.ttNumber, "stars" : req.body.stars});
            rating.save(function(error, result){
                if(error){
                    res.status(400);
                    res.json({"Error" : "Bad request"});
                } else {
                    res.status(200);
                    res.json({"Success" : "Rating was added successfully"});
                }
            });
        }
    });
};

module.exports.updateRating = function(req, res){
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.json({"Error" : error});
        } else {
            var conditions = {
                "ttNumber" : req.body.ttNumber,
                "userName" : result.username
            };
            var update = {
                "stars" : req.body.stars
            }
            Rating.update(conditions, update).exec(function(error, result){
                if(error){
                    res.status(400);
                    res.json({"Error" : "bad request."});
                } else {
                    res.json({"Success" : "Rating updated"});
                }
            });
        }
    });
};

module.exports.deleteRating = function(req, res){
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.json({"Error" :error});
        } else {
            var conditions = {
                "ttNumber" : req.body.ttNumber,
                "userName" : result.username
            };
            Rating.remove(conditions).exec(function(error, result){
                if(error){
                    res.status(400);
                    res.json({"Error" : "bad request."});
                } else {
                    res.json({"Success" : "Rating deleted"});
                }
            });
        }
    });
};

module.exports.getAvgForMovie = function(req, res){
    Rating.find({"ttNumber" : req.params.ttNumber}, "stars").exec(function(error, result){
        if(error) {
            res.status(400);
            res.json({"Error" : "Bad request"});
        } else {
            if(result.length >0){
                // res.send(result);
                var total = 0;
                for(var i = 0; i < result.length; i++){
                    total += result[i]['stars'];
                }

                res.json({"Average" : (total / result.length)});
            } else {
                res.status(400);
                res.json({"Error" : "That movie was not found"});
            }
        }
    });
};

module.exports.getRatingsForUser = function(req, res){
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.json({"Error" : error});
        } else {
            Rating.find({userName : result.username}, {'ttNumber': 1, 'stars' : 1}).exec(function(error, result){
                if(errors){
                    res.status(400);
                    res.json({"Error" : "Bad request!"});
                } else {
                    res.json({"Result" : result});
                }
            });
        }
    });
};

module.exports.drop = function () {
    Rating.remove({}, function (err) {
        console.log("Ratings Dropped");
    })
};