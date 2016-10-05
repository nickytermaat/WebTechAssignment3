/**
 * Created by Kris on 9/28/2016.
 */
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(3001, function(){
    console.log("Example app on port 3000");
});
app.get('/', function (req, res) {
    res.send("Hello, Api/World!");
});