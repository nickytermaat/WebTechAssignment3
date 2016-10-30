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
        success: function (data) {
            $.each(data, function (index) {
                console.log($(this)[0].title);
                var toAppend = "";
                toAppend += "<div class='col-sm-2 movie'>";
                toAppend += "<a href='/movie?"+$(this)[0].ttNumber+"' class='title'>"+$(this)[0].title+"</a>";
                toAppend += "<span id='rating"+$(this)[0].ttNumber+"' class='rating'></span>";
                //Add poster. Get the ttNumber from the databas1e.
                getPoster($(this)[0].ttNumber, toAppend);
                // getRating(("#rating"+$(this)[0].ttNumber));
                getAvgRating($(this)[0].ttNumber);
            });
        }
    });
}
function getAvgRating(ttNumber){
    $.ajax({
        url:"api/getAvgForMovie/"+ttNumber,
        type:"GET",
        success:function(data){
            alert();
            $("#id"+ttNumber).html(determineStars(data.Average));
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
        success: function (data) {
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
            $("#avgrating").html(determineStars(data.Average));
        }
    });
}

function addMovie(ttNumber, title, pubDate, duration, director, description) {
   var newMovie = {
       ttNumber : $('#ttNumber').val(),
       title : $('#title').val(),
       pubDate : $('#pubDate').val(),
       duration : $('#duration').val(),
       director : $('#director').val(),
       description : $('#description').val()
   };

    $.ajax({
        type: "POST",
        url: "api/addMovie",
        data: newMovie,
        beforeSend: function(xhr){xhr.setRequestHeader('authentication', localStorage.getItem("Token"))},
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
            reloadBody();
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
    reloadBody();
}

function checkLogin() {
    if (localStorage.getItem("Token") != "") {
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


function reloadBody(){
    console.log("Not being overwritten");
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
        success: function (data) {
            console.log(data);
            $("#_id").text(data._id);
            $("#username").text(data.name);
            $("#body").append(toAppend);
        },
        error: function(err){
            $("#body").load("../elements/401.html");
        }
    });
}

function getAllUsers(){
    $.ajax({
        url:"/api/getUser",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('authentication', localStorage.getItem("Token"))
        },
        success: function (data) {
            $.each(data, function (index) {
                console.log($(this)[0].name)
                var toAppend = "";
                toAppend += "<div class='col-sm-2 user'>";
                toAppend += "<a href='/user?"+$(this)[0].name+"' class='username'>"+$(this)[0].name+"</a>";
                toAppend += "<div>"
                getUser($(this)[0].name, toAppend);
            });
        },
        error: function(err){
            $("#body").load("../elements/401.html");
        }
    });
}

// Rating ---------------------------------------------------------
function getMyRatings() {
    $.ajax({
        url: "/api/getMyRatings",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('authentication', localStorage.getItem("Token"))
        },
        success: function (data) {
            console.log($(this)[0])
            var toAppend = "";
            toAppend += "<div class='col-sm-2 rating'>";
            toAppend += "<p> My Ratings: "
            $.each(data, function (index) {
                console.log($(this)[0])
                toAppend += "<p> ttNumber: \t " + $(this)[0].ttNumber + "</p>"
                toAppend += "<p> Your rating \t <a href='/rating?" + $(this)[0].stars + "' class='stars'>" + $(this)[0].stars + "</a>";
                toAppend += "</div>"
                $("#body").append(toAppend);
            })

        }
    });
}

function getAverageForMovie() {
    var ttNumber = window.location.search.replace('?', '');
    $.ajax({
        url: "api/getAvgForMovie/" + ttNumber,
        type: "GET",
        success: function (data) {
            console.log(data);
            $("#avgrating").text(data.ttNumber);
        }
    });
}

function addRating(username, ttNumber, stars) {

    var newRating = {
        username: $("#username").val(),
        ttNumber: $('#ttNumber').val(),
        stars: $('#stars').val(),
    }

    $.ajax({
        type: "POST",
        url: "/api/addUser",
        data: newRating,
        dataType: "JSON",
        success: function (data) {
            alert("Rating was added succesfully")
        }, error: function (err) {
            alert(err.responseJSON.Error)
        }
    });
}

function getMyRatingForMovie(ttNumber){
    $.ajax({
        url:"/api/getMyRatingForMovie/"+ttNumber,
        beforeSend: function(xhr){xhr.setRequestHeader('authentication', localStorage.getItem("Token"))},
        success: function(data){
            if(typeof data.Result[0] != 'undefined'){
                $("#yourrating").html(determineStars(data.Result[0].stars));
            }
        }
    })
}

function determineStars(value){
    if(value > 0 && value <=.5){
        return '<i class="fa fa-star-half fa-lg"></i>';
    } else if(value > .5 && value <= 1){
        return '<i class="fa fa-star fa-lg"></i>';
    } else if(value > 1.0 && value <= 1.5){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star-half fa-lg"></i>';
    } else if(value > 1.5 && value <= 2.0){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i>';
    } else if(value > 2.0 && value <= 2.5){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star-half fa-lg"></i>';
    } else if(value > 2.5 && value <= 3.0){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i>';
    } else if(value > 3.0 && value <= 3.5){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star-half fa-lg"></i>';
    }else if(value > 3.5 && value <= 4.0){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i>';
    } else if(value > 4.0 && value <= 4.5){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star-half fa-lg"></i>';
    }else if(value > 4.5 && value <= 5){
        return '<i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i><i class="fa fa-star fa-lg"></i>';
    } else {
        return "<i>No ratings yet</i>";
    }
}