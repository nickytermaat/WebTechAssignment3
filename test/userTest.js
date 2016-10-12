/**
 * Created by Kris on 10/12/2016.
 */
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var supertest = require("supertest");
var should = require("should");
app.use(bodyParser);

var server = supertest.agent("http://localhost:3000")
/* TODO: First fill database with dummy data to test with */
describe("Get a specific user with name Nicky", function(){
    it("Should get a user", function(done){
        server
            .get('/api/getUser/Nicky')
            .set({'authentication' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktyaXMiLCJmaWVsZCI6ImRhdGEiLCJpYXQiOjE0NzYyNzYwODJ9.nY9I0QtPh-CIicq8tlsWfpG0w-fkXQOzZCmYU_1XEQI'})
            .set('Content-Type','application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, result){
                console.log(err);
                console.log(result);
                return done(err);
            });
    });
});



//TC1(200): Add user
//TC2(400): Add user without password
//TC3(400): Add user without username
//TC4(400): Add same user as in testcase 1 (Should throw duplicate name error)
//TC5(200): Get token with existing credentials
//TC6(400): Login without username
//TC7(400): Login without password
//TC8(401): Get user without token supplied
//TC9(200): Get user with proper token supplied

