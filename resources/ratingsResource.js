/**
 * Created by Kris on 10/12/2016.
 */
var Rating = require('ratingSchema.js');
var jwt = require("jsonwebtoken");

//Add rating
//Update rating
//Delete rating
module.exports.addRating = function (req, res) {
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.send(error);
        } else {
            var rating = new Rating({"userName": result.username, "ttNumber" : req.body.ttNumber, "stars" : req.body.stars});
            rating.save(function(error, result){
                if(error){
                    res.status(400);
                    res.send("Bad request");
                } else {
                    res.status(200);
                    res.send("Rating was added successfully");
                }
            });
        }
    });
};

module.exports.updateRating = function(req, res){

};

module.exports.deleteRating = function(req, res){

};

module.exports.getAvgForMovie = function(req, res){
    Rating.find({"ttNumber" : req.params.ttNumber}, "stars").exec(function(error, result){
        if(error) {
            res.status(400);
            res.send("Bad request");
        } else {
            // res.send(result);
            var total = 0;
            for(var i = 0; i < result.length; i++){
                total += result[i]['stars'];
            }

            res.send((total / result.length)+"");
        }
    });
};

module.exports.getRatingsForUser = function(req, res){
    var token = req.headers["authentication"];

    jwt.verify(token, "Thisismysecretkey", function (error, result) {
        if (error) {
            res.status(401);
            res.send(error);
        } else {
            Rating.find({userName : result.username}, {'ttNumber': 1, 'stars' : 1}).exec(function(error, result){
                if(errors){
                    res.status(400);
                    res.send("Bad request!");
                } else {
                    res.send(result);
                }
            });
        }
    });
};