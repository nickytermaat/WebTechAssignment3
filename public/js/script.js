/**
 * Created by Kris on 10/24/2016.
 */
function includeHeader(){
    $(".navbar").load("../elements/menu.html");
    $("#login").load("../elements/login.html");
    $("#logout").load("../elements/logout.html");
    $("#register").load("../elements/registerbtn.html");
}
function includeBody() {
    $("#body").load("../elements/body.html");
}
$(document).ready(function(){
    includeHeader();
});


// Movies
function getMovies(){
    $.ajax({
        url: "/api/getMovies",
        type: "GET",
        success: function(data){
            $.each(data, function(index){
                console.log($(this)[0].title);
                var toAppend = "";
                toAppend += "<div class='col-sm-2 movie'>";
                toAppend += "<a href='/movie?"+$(this)[0].ttNumber+"' class='title'>"+$(this)[0].title+"</a>";
                toAppend += "<span id='rating"+$(this)[0].ttNumber+"' class='rating'>"+$(this)[0].rating+"</span>";
                //Add poster. Get the ttNumber from the database.
                getPoster($(this)[0].ttNumber, toAppend);
                // getRating(("#rating"+$(this)[0].ttNumber));
            });
        }
    });
}
function getPoster(ttNumber, toAppend){
    //Create Ajax call that calls OMDB API
    //Return <img> tag with proper SRC
        $.ajax({
            url: "http://omdbapi.com/?i=tt"+ttNumber,
            type: "GET",
            success: function(data){
                toAppend += "<img src='"+data.Poster+"'>";
                toAppend += "</div>";
                $("#body").append(toAppend);
            }
        });
}

function getMovieData(ttNumber){
    var ttNumber = window.location.search.replace('?', '');

    $.ajax({
        url: "/api/getMovies/" + ttNumber,
        type: "GET",
        success: function(data){
            console.log(data);
            $("#title").text(data.title);
            $("#duration").text(data.duration);
            $("#director").text(data.director);
            $("#plot").text(data.description);
        }
    });

    $.ajax({
        url:"http://omdbapi.com?i=tt" + ttNumber,
        type:"GET",
        success:function(data){
            $(".poster").append("<img src='"+data.Poster+"'>");
        }
    });

    $.ajax({
        url:"api/getAvgForMovie/"+ttNumber,
        type:"GET",
        success:function(data){
            console.log(data);
            $("#avgrating").text(data.Average);
        }
    });
}

function addMovie(ttNumber, title, pubDate, duration, director, description) {
   var newMovie = {
       'ttNumber' : $('#inputTtNumber').val(),
       'title' : $('#inputTitle').val(),
       'pubDate' : $('#inputPubDate').val(),
       'duration' : $('#inputDuration').val(),
       'director' : $('#inputDirector').val(),
       'description' : $('#inputDescription').val()
   }

    $.ajax({
        type: "POST",
        url: "api/addMovie",
        data: newMovie,
        dataType: "JSON",
        success: function (data) {
            alert("Movie was added succesfully")
        }, error: function (err) {
            alert(err.responseJSON.Error)
        }
    });
}


// Login - log out
function login(username, password){
    $.ajax({
        url: "/api/login",
        data: {name: username, password: password},
        type: "POST",
        success: function(data){
            localStorage.setItem("Token", data.Token);
            alert("Login successful");
            checkLogin();
        }, error: function(err){
            alert(err.responseJSON.Error);
            $(".navbar-form").addClass("has-error");
            $(".error-label").show();
        }
    });
}
function logout(){
    localStorage.setItem("Token", "");
    checkLogin();
}


//Users
function addUser(username, password) {
    var newUser = {
        'username' : $('#inputUsername').val(),
        'password' : $('#inputPassword').val()
    };

    $.ajax({
        type: "POST",
        url: "/api/addUser",
        data: newUser,
        dataType: "JSON",
        success: function (data) {
            alert("User was added succesfully")
        }, error: function (err) {
            alert(err.responseJSON.Error)
        }
    });
}

function getUser(name, toAppend) {
    var name = window.location.search.replace('?', '');

    $.ajax({
        url: "/api/getUser/" + name,
        beforeSend: function(xhr){xhr.setRequestHeader('authentication', localStorage.getItem("Token"))},
        type: "GET",
        success: function(data){
            console.log(data);
            $("#_id").text(data._id);
            $("#username").text(data.name);
            $("#body").append(toAppend);
        }
    });
}

function getAllUsers(){
    $.ajax({
        url:"/api/getUser",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('authentication', localStorage.getItem("Token"))},
        success: function(data){
            $.each(data, function(index){
                console.log($(this)[0].name)
                var toAppend = "";
                toAppend += "<div class='col-sm-2 user'>";
                toAppend += "<a href='/user?"+$(this)[0].name+"' class='username'>"+$(this)[0].name+"</a>";
                toAppend += "<div>"
                getUser($(this)[0].name, toAppend);
            });
        }
    });
}


function checkLogin(){
    if(localStorage.getItem("Token") != ""){
        //User is logged in
        $(".loginForm").hide();
        $("#registerbtn").hide();//load("../elements/registerbtn.html");
        $("#logout").show();
    } else {
        //User is logged out
        $("#logout").hide();
        $(".loginForm").show();
        $("#registerbtn").show();
    }
}