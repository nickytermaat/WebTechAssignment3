/**
 * Created by Kris on 10/24/2016.
 */
function includeHeader(){
    $(".navbar").load("../elements/menu.html");
}
function includeBody() {
    $("#body").load("../elements/body.html");
}
$(document).ready(function(){
    includeHeader();
    includeBody();
});