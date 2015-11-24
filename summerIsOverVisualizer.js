function showCrossRectangles(){
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:5%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:10%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:15%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:20%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:25%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:30%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:35%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:40%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:45%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:50%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:55%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:60%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:65%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:70%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:75%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_right" style="top:80%;"></div>');
  $("#visualizer_space").append('<div class="cross_rectangle cr_left" style="top:85%;"></div>');
}

function animateCrossRectangles(){
  showCrossRectangles();
  $(".cr_left").animate({left: "100%"}, ms_per_beat*2);
  $(".cr_right").animate({left: "-100%"}, ms_per_beat*2, function(){
    $(".cross_rectangle").remove();
  });
}



function summerIsOver(){ //demo/testing 11/23/15.  https://soundcloud.com/anoraak/summer-is-over-rework-master
    
    //cool bass lick on: 51, 55, 59, ...

    //images to use:
    //clouds/sky
    image_url1 = "https://img0.etsystatic.com/000/0/6604604/il_570xN.290724650.jpg";
    //gremlin with rainbow beams
    image_url2 = "https://s-media-cache-ak0.pinimg.com/736x/88/67/2e/88672e17eb5eacf99de03bdf6f39583a.jpg";
    //"happy summer" pic
    image_url3 = "https://s-media-cache-ak0.pinimg.com/736x/4e/00/55/4e005569ce9cd8942ab038e8ef175c3a.jpg";
    //pixelated surfer on a milkshake gif
    image_url4 = "https://media.giphy.com/media/26BkNqoThnP4sDG0g/giphy.gif";
    //colorful painting of beach
    image_url5 = "https://s-media-cache-ak0.pinimg.com/736x/fa/62/5b/fa625baa29c49e03adc45f1a83b0aa5d.jpg";
    //gif of sun waving sayonara
    image_url6 = "http://media1.giphy.com/media/phSwSP4SgHrK8/giphy.gif";
    //gif of popsicle with sunglasses giving the hang ten signal
    image_url7 = "http://media1.giphy.com/media/ucXbjTmJPwKUE/giphy.gif";
    
    
    //doInTime(1, invertImageColors, 1, 21); //every measure
    
    //experimental 11/19:
    //doInTime(1, alternateInTime); //every measure

    doInTime(16, rectangleAnimationChange, 1, 17, clearRectangles);
    doInTime(16, rectangleAnimationChange2, 17, 33, clearRectangles);
    doInTime(16, rectangleAnimationChange, 33, 49, clearRectangles);
    doOnceAtACertainBeat(49, changeImage, image_url2);
    doInTime(16, rectangleAnimationChange2, 49, 65, clearRectangles);
    doOnceAtACertainBeat(50, animateCrossRectangles);
    doOnceAtACertainBeat(54, animateCrossRectangles);
    doOnceAtACertainBeat(58, animateCrossRectangles);
    doInTime(16, rectangleAnimationChange, 65, 81, clearRectangles);
    doInTime(16, rectangleAnimationChange2, 81, 97, clearRectangles);

}