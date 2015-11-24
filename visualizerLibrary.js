//*******BEGIN VISUALIZER FUNCTIONS********//

function invertImageColors(){
    current_webkit_filter_value = $("#image").css("-webkit-filter");
    if(current_webkit_filter_value == "invert(0)"){
        $("#image").css("-webkit-filter", "invert(100%)")
    }
    else{
        $("#image").css("-webkit-filter", "invert(0%)")
    }
}

function changeRectangleColor(rectangle_number){
    var rectangle_display_property = $("#rectangle"+rectangle_number).css('visibility');
    //console.log(rectangle_display_property);
    if(rectangle_display_property == "hidden"){
        $("#rectangle"+rectangle_number).css('visibility', 'visible');
    }
    else{
        $("#rectangle"+rectangle_number).css('visibility', 'hidden');
    }
}

function rectangleAnimationChange(){
    randomnumber = Math.floor(Math.random()*10)+1;
    switch(randomnumber) {
        case 1:
            changeRectangleColor(1);
            changeRectangleColor(2);
            changeRectangleColor(3);
            changeRectangleColor(4);
            break;
        case 2:
            changeRectangleColor(1);
            changeRectangleColor(2);
            break;
        case 3:
            changeRectangleColor(1);
            break;
        case 4:
            changeRectangleColor(3);
            changeRectangleColor(4);
            break;
        case 5:
            changeRectangleColor(3);
            break;
        case 6:
            changeRectangleColor(5);
            changeRectangleColor(6);
            changeRectangleColor(7);
            changeRectangleColor(8);
            break;
        case 7:
            changeRectangleColor(5);
            changeRectangleColor(6);
            break;
        case 8:
            changeRectangleColor(5);
            break;
        case 9:
            changeRectangleColor(7);
            changeRectangleColor(8);
            break;
        case 10:
            changeRectangleColor(7);
            break;
    }
}
function rectangleAnimationChange2(){
    changeRectangleColor(9);
}
function clearRectangles(){
    $(".rectangle").css('visibility', 'hidden');
}

/*********Image Manipulation*******/

function changeImage(image_url){
  $("#image").attr("src", image_url);
}

var image_url1 = "https://danthemantrivia.files.wordpress.com/2010/09/rubiks-cube.jpg";
var image_url2 = "https://c2.staticflickr.com/8/7410/11983237056_36250c52d3_z.jpg";
var image_url3 = "http://cdn.shopify.com/s/files/1/0395/6813/products/nu-disco-funk_studiopistol_1024x1024.jpg?v=1434905657";
var image_url4 = "http://media.giphy.com/media/lRDc8y67mapVu/giphy.gif";
var image_url5 = "http://40.media.tumblr.com/15b5f64882b81695d2baaa186cc0f965/tumblr_nn94zjBggC1soumhdo1_500.jpg";
var image_counter = 1;

function runThroughImages(){
    image_counter++;
    var url_to_use;
    switch(image_counter) {
        case 2:
            url_to_use = image_url2;
            break;
        case 3:
            url_to_use = image_url3;
            break;
        case 4:
            url_to_use = image_url4;
            break;
        case 5:
            url_to_use = image_url5;
            break;
        default:
            url_to_use = image_url1;
            image_counter = 1;
            break;
    }
    $("#image").attr("src", url_to_use);
}

/*******End Image Manipulation*******/