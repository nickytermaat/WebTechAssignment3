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
// var Movie = require('movieSchema');

module.exports = addMovie = function(req, res){
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
            console.log(error);
        } else {
            res.send("Movie was added successfully");
            res.status = 200;
        }
    });
};