function showCrossRectangles(){
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:5%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:15%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:25%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:35%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:45%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:55%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:65%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:75%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:85%;"></div>');
}

function animateCrossRectangles(){
  showCrossRectangles();
  $(".cr_left").animate({width: "100%"}, ms_per_beat, function(){
    $(".cross_rectangle").remove();
  });
}

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

//images to use:
//clouds/sky
var image_url1 = "https://img0.etsystatic.com/000/0/6604604/il_570xN.290724650.jpg";
//gremlin with rainbow beams
var image_url2 = "https://s-media-cache-ak0.pinimg.com/736x/88/67/2e/88672e17eb5eacf99de03bdf6f39583a.jpg";
//"happy summer" pic
var image_url3 = "https://s-media-cache-ak0.pinimg.com/736x/4e/00/55/4e005569ce9cd8942ab038e8ef175c3a.jpg";
//pixelated surfer on a milkshake gif
var image_url4 = "https://media.giphy.com/media/26BkNqoThnP4sDG0g/giphy.gif";
//colorful painting of beach
var image_url5 = "https://s-media-cache-ak0.pinimg.com/736x/fa/62/5b/fa625baa29c49e03adc45f1a83b0aa5d.jpg";
//gif of sun waving sayonara
var image_url6 = "http://media1.giphy.com/media/phSwSP4SgHrK8/giphy.gif";
//gif of popsicle with sunglasses giving the hang ten signal
var image_url7 = "http://media1.giphy.com/media/ucXbjTmJPwKUE/giphy.gif";
//gif of statue head with animated colored cubes
var image_url8 = "http://38.media.tumblr.com/417ee0135346a6ec2c7d18cd2c9ca5c5/tumblr_nj2c2siHns1u8prugo1_500.gif";
//gif of girl with umbrella
var image_url9 = "http://somethingaboutmagazine.com/wp-content/uploads/2015/03/Marilyn-Beach-2-together.gif";
//neon pic of simon and garfunkel with sunglasses
var image_url10 = "http://2.bp.blogspot.com/_4ARUtqkw2pM/S7S8plWtqYI/AAAAAAAAAn8/BgBYPsxyV8E/s1600/Art+Garfunkel+And+Trevor+Jackson+Separated+at+birth%3F.jpg";
//gif of colorful hand giving peace sign and thumbs up
var image_url11 = "http://static1.squarespace.com/static/54340e70e4b0ebdd5103c677/545d46f4e4b0263200d209c8/545d46f8e4b02ca19c76c924/1415399193202/f14aacae842b56fb0f3e5208eb9f4740.gif";


//STUFF TO INITIALIZE:
$( document ).ready(function() {
    $("#visualizer_space").append('<img src="'+image_url1+'" class="visual_image" id="image1">')
    loadImages(image_url2, image_url3, image_url4, image_url5, image_url6, image_url7, image_url8, image_url9, image_url10, image_url11);
    //TESTING 12/23/15:
    createVerticalRectangles({num_recs_to_create:8, z_index:1, visibility:"hidden", space_between:"random"});
    createCustomRectangle({height: 50, width: 20, left:55, top:20, visibility:"hidden"});
});


function summerIsOver(){ //demo/testing 11/23/15.  https://soundcloud.com/anoraak/summer-is-over-rework-master
    
    //cool bass lick on: 51, 55, 59, ...
    //piano starts at 112
    
    //doInTime(1, invertImageColors, 1, 21); //every measure
    
    doOnceAtACertainBeat(49, changeImage, 2);
    doOnceAtACertainBeat(81, changeImage, 10);
    doOnceAtACertainBeat(113, changeImage, 11);
    doOnceAtACertainBeat(129, changeImage, 5);
    doOnceAtACertainBeat(145, changeImage, 4);
    doOnceAtACertainBeat(161, changeImage, 9);
    doOnceAtACertainBeat(177, changeImage, 6);
    doOnceAtACertainBeat(193, changeImage, 7);
    doOnceAtACertainBeat(209, changeImage, 8);
    doOnceAtACertainBeat(241, changeImage, 3);
    doOnceAtACertainBeat(257, changeImage, 11);
    doOnceAtACertainBeat(289, changeImage, 2);

    doInTime(16, alternateRectangleChanges);
    doInTimeStartingOnBeat(1, animateCrossRectangles, 50, 81);
    
    //randomize after 305th beat
    doInTime(16, randomize, 305)
}