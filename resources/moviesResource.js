/**
 * Created by Kris on 10/7/2016.
 */
/*
 var user1 = new User({name: 'Kris', password: 'Hoi'});
 user1.save(function(err, result){
 if(err){
 return console.error(err);
 }
 });
 */
var Movie = require('movieSchema.js');
var jwt = require("jsonwebtoken");

module.exports.addMovie = function(req, res){
    Movie.findOne({'ttNumber': req.body.ttNumber}, {"title":1, 'duration':1}).exec(function (error, result) {
        if(error){
            res.status(400);
            res.send("Invalid request");
        } else {
            if(result == null){
                var token = req.headers["authentication"];
                jwt.verify(token, "Thisismysecretkey", function (error, result) {
                    if(error){
                        res.status(401);
                        res.send(error);
                    } else {
                        //Token verified successfully
                        var movie = new Movie({
                            ttNumber: req.body.ttNumber,
                            title: req.body.title,
                            pubDate: req.body.pubDate,
                            duration: req.body.duration,
                            director: req.body.director,
                            description: req.body.description
                        });
                        movie.save(function(error, result){
                            if(error) {
                                res.status(400);
                                res.send("Couldn't save movie");
                            } else {
                                // console.log(error);
                                res.status(200);
                                res.send("Movie was added successfully");
                            }
                        });
                    }
                });
            } else {
                res.status(400);
                res.send("That ttNumber is taken!");
            }
        }
    });
};

module.exports.getMovie = function(req, res){
    Movie.findOne({'ttNumber': req.params.ttNumber}, {"title":1, 'duration':1}).exec(function (error, result) {
        if(error){
            res.status(400);
            res.send("Invalid request");
        } else {
            console.log(result);
            if(result == null){
                res.status(404);
                res.send("movie not found");
            } else {
                res.status(200);
                res.send(result);
            }
        }
    });
};

module.exports.getAllMovies = function (req, res) {
    Movie.find().exec(function(error, result){
        if(error){
            res.status(400);
            res.send("Bad request");
        } else {
            if(result == null){
                res.status(200);
                res.send("No movies in database");
            } else {
                res.status(200);
                res.send(result);
            }
        }
    });
}