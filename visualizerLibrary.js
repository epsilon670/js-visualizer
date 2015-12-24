//*******BEGIN VISUALIZER FUNCTIONS********//

function invertImageColors(number_of_image_to_invert){
    if (typeof number_of_image_to_invert === 'undefined') {number_of_image_to_invert = current_visible_image_number;} //default
    console.log(number_of_image_to_invert);
    current_webkit_filter_value = $("#image"+number_of_image_to_invert).css("-webkit-filter");
    if(current_webkit_filter_value == "invert(0)"){
        $("#image"+number_of_image_to_invert).css("-webkit-filter", "invert(100%)")
    }
    else{
        $("#image"+number_of_image_to_invert).css("-webkit-filter", "invert(0%)")
    }
}

/**********Begin Rectangle Manipulation***********/

/*createEqualVerticalRectangles function
**creates narrow vertical rectangles evenly spaced across the visualizer space
**accepts the number of rectangles to be created and an optional color argument
**color can either be a single color for all rectangles or can be an array of multiple colors
**if color arg is an array of colors, each created rectangle will get a color from the array
**DEFAULT color is black when no color is specified for a given rectangle
**also optionally accepts a space_between parameter which is the % space that can be specified to be between each rectangle
**if space_between is passed, the rectangles' widths will be auto-fitted 
**if space_between is set to "random", rectangle widths will by randomly generated
    **once randomly generated rec widths are calculated, the spacing between them is set to be equal based on how much space remains out of 100%
*/
function createVerticalRectangles(num_recs_to_create, color, z_index, visibility, space_between){
    var num_of_existing_recs = $(".rectangle").length;
    var rectangle_width;
    var left_spacing = 0; //only used for random rectangle widths
    if (typeof space_between === 'undefined') { //if no spacing parameter passed:
        rectangle_width = 100/((num_recs_to_create*2)+1);
    }
    else if(space_between == 'random'){ //if rectangle widths should be random:
        var rectangle_width_array = new Array(num_recs_to_create);
        var min_total_space = num_recs_to_create+1; //assumption is that each space must be at least 1% wide
        //generate random widths for each rectangle:
        for (var i = 1; i < num_recs_to_create+1; i++) {
            total_rec_widths = 0;
            $.each(rectangle_width_array, function( i, val ) {
                if (typeof val !== 'undefined') {total_rec_widths += val;}
            });
            available_space = 100-total_rec_widths-(min_total_space-i+1);
            //use the min function below to ensure that no rectangle gets too big (i.e., bigger than 100/total # of rectangles).  This is so that the spacing looks nice
            max_rec_width = Math.min(available_space/(num_recs_to_create-i+1), 100/num_recs_to_create);
            random_width = Math.floor(Math.random()*max_rec_width)+1;
            rectangle_width_array[i-1] = random_width;
        }
        //get the % of available width remaining after rectangles:
        total_rec_widths = 0;
        $.each(rectangle_width_array, function( i, val ) {
            if (typeof val !== 'undefined') {total_rec_widths += val;}
        });
        available_space = 100-total_rec_widths;
        var left_spacing = available_space/(num_recs_to_create+1);
        var left_position = left_spacing;
    }
    else{ //if a specific spacing is specified:
        rectangle_width = (100-((num_recs_to_create+1)*space_between))/num_recs_to_create;
    }
    //z-index default
    if (typeof z_index === 'undefined') {z_index = 0;}
    //visibility default
    if (typeof visibility === 'undefined') {visibility = "visible";}
    //create each rectangle on page:
    for (var i = 1; i < num_recs_to_create+1; i++) {
        if($.isArray(color) == true){ //if we are passed an array of colors:
            rec_color = color[i-1];
        }
        else{ //if all rectangles are to be the same color:
            rec_color = color;
        }
        //generate rectangle width and left position CSS values:
        if (typeof space_between === 'undefined') {
            left_position = ((2*i)-1)*rectangle_width;
        }
        else if(space_between == 'random'){
            rectangle_width = rectangle_width_array[i-1];
            rectangle_number = num_of_existing_recs+i; //so that we don't overwrite any existing rectangles on page
        }
        else{
            left_position = (i*space_between)+((i-1)*rectangle_width);   
        }
        rectangle_number = num_of_existing_recs+i; //so that we don't overwrite any existing rectangles on page
        $("#visualizer_space").append("<div class='rectangle vertical_rectangle' id='rectangle"+rectangle_number+"' style='width:"+rectangle_width+"%; left:"+left_position+"%; background-color:"+rec_color+"; z-index:"+z_index+"; visibility:"+visibility+";'></div>");
        //get next rectangle's left positioning (only relevant if space_between is set to "random":
        left_position = left_position+left_spacing+rectangle_width;
    }
}


function changeRectangleVisibility(rectangle_number){
    var rectangle_display_property = $("#rectangle"+rectangle_number).css('visibility');
    //console.log(rectangle_display_property);
    if(rectangle_display_property == "hidden"){
        $("#rectangle"+rectangle_number).css('visibility', 'visible');
    }
    else{
        $("#rectangle"+rectangle_number).css('visibility', 'hidden');
    }
}

//randomly toggle visibility of all rectangles on page
function randomRectangleAnimation(){
    var num_recs_on_page = $(".rectangle").length;
    randomnumber = Math.floor(Math.random()*10)+1;
    switch(randomnumber) {
        case 1:
            for (var i = 1; i < 5; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 2:
            for (var i = 1; i < 3; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 3:
            changeRectangleVisibility(1);
            break;
        case 4:
            for (var i = 3; i < 5; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 5:
            changeRectangleVisibility(3);
            break;
        case 6:
            for (var i = 5; i < 9; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 7:
            for (var i = 5; i < 7; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 8:
            changeRectangleVisibility(5);
            break;
        case 9:
            for (var i = 7; i < 9; i++) {
                changeRectangleVisibility(i);
            }
            break;
        case 10:
            changeRectangleVisibility(7);
            break;
    }
}
function rectangleAnimationChange2(){
    changeRectangleVisibility(9);
}
function hideRectangles(){
    $(".rectangle").css('visibility', 'hidden');
}
function clearRectangles(){
    $(".rectangle").remove();
}

/**********End Rectangle Manipulation***********/

/*********Begin Image Manipulation*******/

function changeImageURL(image_url){
    $("#image").attr("src", image_url);
}

//shuffleImage function
//accepts the number of the image to be shown
//if no image number is given as a argument, it chooses one at random from the page
var current_visible_image_number = 1;
function changeImage(number_of_image_to_show){
    $(".visual_image").css("z-index", -1); //hide all images
    if (typeof number_of_image_to_show === 'undefined') {
        //if no image number arg given, choose one at random from page:
        var total_num_images = $(".visual_image").length;
        var random_number = Math.floor(Math.random()*total_num_images)+1;
        $("#image"+random_number).css("z-index", 0); //show desired image
    }
    else{
        $("#image"+number_of_image_to_show).css("z-index", 0); //show desired image
    }
    current_visible_image_number = number_of_image_to_show;
}

/*loadImages function
**accepts up to 30 image urls as arguments
**adds those images to the page and gives each an id of the form "image_" 
**where _ is a number signifying the order in which the image url was passed as a arg
**TODO 12/7/15: Add ajax code so that images load asynchronously?
*/
function loadImages(){
    var num_arguments;
    var image_number;
    if(arguments.length > 30){
        //cap the number of images to load at 30
        num_arguments = 30;
    }
    else{
        num_arguments = arguments.length;
    }
    for (var i = 0; i < num_arguments; i++) {
        image_number = i+2; //so that first image is #image2
        $("#image1").after("<img src='"+arguments[i]+"' class='visual_image' id='image"+image_number+"'>");
    }
}

/*TEST IMAGES
var image_url1 = "https://danthemantrivia.files.wordpress.com/2010/09/rubiks-cube.jpg";
var image_url2 = "https://c2.staticflickr.com/8/7410/11983237056_36250c52d3_z.jpg";
var image_url3 = "http://cdn.shopify.com/s/files/1/0395/6813/products/nu-disco-funk_studiopistol_1024x1024.jpg?v=1434905657";
var image_url4 = "http://media.giphy.com/media/lRDc8y67mapVu/giphy.gif";
var image_url5 = "http://40.media.tumblr.com/15b5f64882b81695d2baaa186cc0f965/tumblr_nn94zjBggC1soumhdo1_500.jpg";
*/
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
    $("#image1").attr("src", url_to_use);
}

/**********End Image Manipulation***********/



/*******Begin Randomization Functions*******/

//randomFrom function
//choose random element from given array
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/*randomize function
**picks an animation function at random and does it for the given interval length, then picks another and repeats
**interval length must be in the same units as the frequency at which this function is called
**e.g., if this function is called once per beat (4), interval length should be the number of beats!
**if no interval length specified, it defaults to 32 (2 measures when called 16 times per measure)
**functions to animate from are hard-coded for now
*/
var randomize_counter = 1;
var func;
function randomize(interval_length){
    if (typeof interval_length === 'undefined') {interval_length = 32;} //32 is default
    if(randomize_counter == 1){
        //hard-coded functions to randomize from:
        func = randomFrom([
            'randomRectangleAnimation', 
            'rectangleAnimationChange2', 
            'invertImageColors'
            ]);
    }
    if(randomize_counter < interval_length){
        //if we're in the middle of the interval:
        window[func]();
        randomize_counter++;
    }
    else{ //if we're at the end of the interval, start over
        randomize_counter = 1;
    }
}

/********End Randomization Functions********/



