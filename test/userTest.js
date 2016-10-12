/**
 * Created by Kris on 10/12/2016.
 */
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000")

describe("/api/getUser", function(){
    it("Should get a user", function(done){
        server.get('api/user/Nicky')
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res){
                res.status.should.equal(401);
                // res.body.error.should.equal(false);
                done;
            });
    });
});