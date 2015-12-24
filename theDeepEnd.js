var rectangle_alternate_counter = 0;
//switch off rectangle animations every 4 measures (function to be called 16 times per measure)
function alternateRectangleChanges(){
  rectangle_alternate_counter++;
  if(rectangle_alternate_counter < 64){
    randomRectangleAnimation("vertical_rectangle");
  }
  else if(rectangle_alternate_counter < 128){
    changeRectangleVisibility(9);
  }
  else{
    rectangle_alternate_counter = 0;
  }
  if(rectangle_alternate_counter == 63 || rectangle_alternate_counter == 127){
      hideRectangles();
  }
}

function counterFadeIn(){
  $("#visual_counter").fadeIn(2000);
}
function introFadeIn(){
  $(".equal_vertical_rectangle").fadeIn(ms_per_beat*21);
}
function counterFadeOut(){
  $("#visual_counter").fadeOut(ms_per_beat*25);
}

function smallRectangleAnimation(){
  randomRectangleAnimation("small_vertical_rectangles");
}
function largeRectangleAnimation(){
  randomRectangleAnimation("equal_vertical_rectangle");
}

function invertVisualizerSpace(){
  $("#visualizer_space").css("background-color", "black");
  $(".equal_vertical_rectangle").css("background-color", "white");
}

var image_url1 = "https://img0.etsystatic.com/000/0/6604604/il_570xN.290724650.jpg";

//STUFF TO INITIALIZE:
$( document ).ready(function() {
    //loadImages(image_url1);
    //TESTING 12/23/15:
    createVerticalRectangles({num_recs_to_create:4, z_index:1, class:"equal_vertical_rectangle"});
    $(".equal_vertical_rectangle").css("display", "none");
    createVerticalRectangles({num_recs_to_create:6, height:40, top:55, z_index:1, space_between:"random", visibility:"hidden", class:"small_vertical_rectangles"});
    $("#visualizer_space").append("<div id='visual_counter' style='position:relative; width:25%; margin:auto; font-size:650%; top:20%; text-align:center; display:none;'>1</div>");
});


function theDeepEnd(){ //demo/testing 12/23/15. 
    //63 is first piano note (pickup)
    //65 is downbeat of first piano lick
    //97 is downbeat of where bass drops (?)

    doOnceAtACertainBeat(2, counterFadeIn);
    doOnceAtACertainBeat(45, introFadeIn);
    doOnceAtACertainBeat(41, counterFadeOut);

    doInTimeStartingOnBeat(16, smallRectangleAnimation, 15, 17);
    doOnceAtACertainBeat(17, hideRectangles, "small_vertical_rectangles");
    doInTimeStartingOnBeat(16, smallRectangleAnimation, 23, 25);
    doOnceAtACertainBeat(25, hideRectangles, "small_vertical_rectangles");
    doInTimeStartingOnBeat(16, smallRectangleAnimation, 31, 33);
    doOnceAtACertainBeat(33, hideRectangles, "small_vertical_rectangles");
    doInTimeStartingOnBeat(16, smallRectangleAnimation, 39, 41);
    doOnceAtACertainBeat(41, hideRectangles, "small_vertical_rectangles");
    doInTimeStartingOnBeat(16, smallRectangleAnimation, 47, 49);
    doOnceAtACertainBeat(49, hideRectangles, "small_vertical_rectangles");
    doInTimeStartingOnBeat(16, smallRectangleAnimation, 55, 57);
    doOnceAtACertainBeat(57, hideRectangles, "small_vertical_rectangles");

    doOnceAtACertainBeat(63, invertVisualizerSpace);
    doInTimeStartingOnBeat(16, largeRectangleAnimation, 65);

    if(Number.isInteger(whole_counter)){
      $("#visual_counter").html(whole_counter);
    }
}