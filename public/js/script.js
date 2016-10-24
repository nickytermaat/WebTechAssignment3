/**
 * Created by Kris on 10/24/2016.
 */
function includeHeader(){
    $(".navbar").load("../elements/menu.html");
    $("#login").load("../elements/login.html");
}
function includeBody() {
    $("#body").load("../elements/body.html");
}
$(document).ready(function(){
    includeHeader();
    includeBody();
});

function getMovies(){
    $.ajax({
        url: "/api/getMovies",
        type: "GET",
        success: function(data){
            $.each(data, function(index){
                console.log($(this)[0].title);
                var toAppend = "";
                toAppend += "<div>";
                toAppend += $(this)[0].title;
                toAppend += "</div>";
                $("#body").append(toAppend);

            });
        }
    });
}