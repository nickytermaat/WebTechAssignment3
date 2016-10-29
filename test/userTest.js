/**
 * Created by Kris on 10/12/2016.
 */
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var supertest = require("supertest");
var should = require("should");
app.use(bodyParser);

var server = supertest.agent("http://localhost:3000");
var token1, token2;

describe("Dropping the database", function(){
    it("Should drop all data", function(done){
        server.get('/dropDB').end(done());
    })
});

/* ************************ ADDING USERS  ***********************/

describe("Add a user", function(){
    it("Should fill the database with data for testing", function (done) {
        server.post('/api/addUser')
            .set('Content-Type','application/json')
            .send({"name" : "Kris", "password": "Test"})
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    });
});
describe("Add another user", function(){
    it("Should fill the database with data for testing", function (done) {
        server.post('/api/addUser')
            .set('Content-Type','application/json')
            .send({"name" : "Nicky", "password": "termaat"})
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    });
});
describe("Add a user without password ", function(){
    it("Should give error 400", function (done) {
        server.post('/api/addUser')
            .set('Content-Type','application/json')
            .send({"name" : "Nicky"})
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    });
});

describe("Add a user without username ", function(){
    it("Should give error 400", function (done) {
        server.post('/api/addUser')
            .set('Content-Type','application/json')
            .send({"password" : "Nicky"})
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    });
});
describe("Add a duplicate user", function(){
    it("Should give error 400, usernames cant be duplicate", function (done) {
        server.post('/api/addUser')
            .set('Content-Type','application/json')
            .send({"name" : "Kris", "password": "Test"})
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    });
});
/* ************************ Log in ***********************/

describe("Get token using proper credentials", function(){
    it("Should give a valid token", function(done){
        server.post("/api/login")
            .set('Content-Type','application/json')
            .send({"name" : "Kris", "password": "Test"})
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(error, result){
                token1 = result.res.body.Token;
                done();
            });
    })
});
describe("Get token using proper credentials", function(){
    it("Should give a valid token", function(done){
        server.post("/api/login")
            .set('Content-Type','application/json')
            .send({"name" : "Nicky", "password": "termaat"})
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(error, result){
                token2 = result.res.body.Token;
                done();
            });
    })
});
describe("Try to get token without username", function(){
    it("Should give error 400", function(done){
        server.post("/api/login")
            .set('Content-Type','application/json')
            .send({"password": "termaat"})
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    })
});
describe("Try to get token without password", function(){
    it("Should give error 400", function(done){
        server.post("/api/login")
            .set('Content-Type','application/json')
            .send({"username": "Nicky"})
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    })
});
/* ************************ get specific user ***********************/

describe("Get a user without token", function(){
    it("Should give code 401", function(done){
        server
            .get('/api/getUser/Nicky')
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err){
                return done(err);
            });
    });
});

describe("Get a specific user with name Nicky", function(){
    it("Should get a user", function(done){
        server
            .get('/api/getUser/Nicky')
            .set({'authentication' : token1})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err){
                return done(err);
            });
    });
});
/* ************************ get all users ***********************/
describe("Get all users correct", function(){
    it("Should give a list of all users", function(done){
        server
            .get('/api/getUser')
            .set({'authentication' : token1})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err){
                return done(err);
            });
    })
});
describe("Get all users incorrect", function(){
    it("Should give error 401", function(done){
        server
            .get('/api/getUser')
            .set({'authentication' : token1+"23"})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err){
                return done(err);
            });
    })
});

/* *************** MOVIES ************ */
describe("Get all movies incorrect", function(){
    it("Should give error 401", function(done){
        server
            .get('/api/getUser')
            .set({'authentication' : token1+"23"})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err){
                return done(err);
            });
    })
});
describe("Get all movies correct", function(){
    it("Should give a list of movies", function(done){
        server
            .get('/api/getUser')
            .set({'authentication' : token1})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err){
                return done(err);
            });
    })
});

/* ************* ADD MOVIES ************/
describe("Add movie to the database", function(){
    it("Should give code 200 ", function(done){
        server.post("/api/addMovie")
            .set('authentication', token1)
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : 3062096,
                "title": "up",
                "pubDate" : "12-05-2013",
                "director" : "Someone",
                "description" : "A movie about a boy and some balloons",
                "duration" : "130"
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    })
});
describe("Add movie to the database", function(){
    it("Should give code 200 ", function(done){
        server.post("/api/addMovie")
            .set('authentication', token1)
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : 4559006,
                "title": "Down",
                "pubDate" : "12-05-2012",
                "director" : "Someone Else",
                "description" : "Another movie about a boy and some rocks",
                "duration" : "90"
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    })
});
describe("Add incomplete data to the database", function(){
    it("Should give code 400 ", function(done){
        server.post("/api/addMovie")
            .set('authentication', token1)
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : 121212,
                "pubDate" : "12-05-2013",
                "director" : "Someone",
                "description" : "A movie about a boy and some balloons",
                "duration" : "130"
            })
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    })
});
describe("Add movie to the database unauthorized", function(){
    it("Should give code 401", function(done){
        server.post("/api/addMovie")
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : 123563,
                "title": "Down",
                "pubDate" : "12-05-2012",
                "director" : "Someone Else",
                "description" : "Another movie about a boy and some rocks",
                "duration" : "90"
            })
            .expect("Content-type", /json/)
            .expect(401)
            .end(done);
    })
});

/* ************ RATINGS *************/
describe("Add rating to the database", function(){
    it("Should give code 200 ", function(done){
        server.post("/api/addRating")
            .set('authentication', token1)
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : '0438097',
                "stars" : "2.5"
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    })
});
describe("Add another rating to the database", function(){
    it("Should give code 200 ", function(done){
        server.post("/api/addRating")
            .set('authentication', token2)
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : '0438097',
                "stars" : "4.5"
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(done);
    })
});
describe("Add incomplete rating to the database", function(){
    it("Should give code 400 ", function(done){
        server.post("/api/addRating")
            .set('authentication', token2)
            .set('Content-Type','application/json')
            .send({
                "stars" : "4.5"
            })
            .expect("Content-type", /json/)
            .expect(400)
            .end(done);
    })
});

describe("Add rating to the database with invalid auth", function(){
    it("Should give code 401", function(done){
        server.post("/api/addRating")
            .set('authentication', token2+"@#")
            .set('Content-Type','application/json')
            .send({
                "ttNumber" : 123456,
                "stars" : "4.5"
            })
            .expect("Content-type", /json/)
            .expect(401)
            .end(done);
    })
});
describe("Get average rating for movie", function(){
    it("Should give code 200", function(done){
        server.get("/api/getAvgForMovie/123456")
            .set('Content-Type','application/json')
            .expect(200)
            .end(done);
    })
});

describe("Get average rating for wrong movie", function(){
    it("Should give code 400", function(done){
        server.get("/api/getAvgForMovie/3332323")
            .set('Content-Type','application/json')
            .expect(400)
            .end(done);
    })
});

/* ********* UPDATE RATING *********/

describe("Update rating for with wrong auth", function(){
    it("Should give code 401", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 123456)
            .set('authentication', token1+"!@#")
            .expect(401)
            .end(done);
    })
});
describe("Update rating for  movie", function(){
    it("Should give code 200", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 123456)
            .set('authentication', token1)
            .expect(200)
            .end(done);
    })
});

describe("Update rating for wrong movie", function(){
    it("Should give code 400", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 120000)
            .set('authentication', token1)
            .expect(400)
            .end(done);
    })
});


/* ********** DELETE RATING ********** */

describe("Delete rating for movie", function(){
    it("Should give code 200", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 123456)
            .set('authentication', token1)
            .expect(200)
            .end(done);
    })
});

describe("Delete rating for wrong movie", function(){
    it("Should give code 400", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 12336)
            .set('authentication', token1)
            .expect(400)
            .end(done);
    })
});

describe("Delete rating for wrong movie", function(){
    it("Should give code 401", function(done){
        server.delete("/api/deleteRating")
            .set('Content-Type','application/json')
            .set('ttNumber', 12346)
            .set('authentication', token1+"!@#")
            .expect(401)
            .end(done);
    })
});
