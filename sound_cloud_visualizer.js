
/*TO DO 11/19/15:
-Make the Soundcloud BPM calculation the default (spotify can be wrong sometimes)
    -BPM calc in general needs work - it's off for some songs
-Create cool visualization functions and add them for a given song.  Try to find problems/bugs in the process
-loading icon for search AND soundcloud tempo fetching (see switch statement inside beatsPerMillisecondCallback function)
-Either figure out how to use the frequency visualizations or hide them from the page
*/

/*OUTSTANDING ISSUES 11/19/15
-When searching and choosing a song from the search dialog, we are
not currently able to use the GetEchoNestSongInfo function to get EN BPM data 
for the song.  This is because soundcloud doesn't separate out the
song title and artist values and Echonest's API seems to require
separate song title and artist values to pull data (see the song_url
variable declaration in the GetEchoNestSongInfo() function).  The EN
API documentation is here: http://developer.echonest.com/docs/v4/song.html
(maybe this is possible, haven't dug too deep)
-BPM calculation in general needs work.
    -This could be a solution for speeding up the SoundCloud buffer calculation:
    https://friendlybit.com/js/partial-xmlhttprequest-responses/
*/

/******************************GLOBAL VARIABLES**********************************/

var player = document.getElementById("player");
var global_query;
var search_fade_speed = 300;
var ms_per_beat = 500; //start ms_per_beat at 500 as default
var msPerBeat_array = new Array();
var current_time = 0;
var audio_duration = 0;

//TESTING
var song = 'summer is over (rework)';
var artist = 'Anoraak';
global_query = song+"+"+artist;
GetSpotifySongInfo(global_query);


/*****************************SOUNDCLOUD STUFF***********************************/

var soundcloud_client_id = "81d37e14a99c54702e502072d8e2da23";
SC.initialize({
  client_id: soundcloud_client_id
});

function sendSteamUrlToPlayer(stream_url){
  //stream_url = "https://api.soundcloud.com/tracks/98372279/stream"; //hardcode the deep end by holy ghost
  stream_url += "?client_id="+soundcloud_client_id;
  $("#player").attr("src", stream_url);
  GetMSPerBeatFromURL(stream_url, 'Soundcloud'); //get msperbeat based on soundcloud stream url (SLOW)
}

//function to populate search results on page
function populateSearchResultOnPage(element, index, array){
    $("#search_results_list").append("<li class='search_result' onClick='songSelect("+element['id']+")'>"+element['title']+"</li>");
    $("#search_results_list").fadeIn(search_fade_speed);
}

//onClick of song from search results:
//generate the stream url from a SC id and load it in the audio player
function songSelect(sc_id){
    var stream_url = "https://api.soundcloud.com/tracks/"+sc_id+"/stream";
    sendSteamUrlToPlayer(stream_url); //load stream in player
    GetSpotifySongInfo(global_query);
    //get track info so we can attribute it on page:
    $("#soundcloud_attribution").css('visibility', 'visible');
    SC.get('/tracks/'+sc_id).then(function(track) {
      var title = track['title'];
      var creator = track['user']['username'];
      $("#soundcloud_title_display").html(title);
      $("#soundcloud_creator_display").html(creator);
    });
    $("#search_results_list").fadeOut(search_fade_speed);
};

//on search form submit
$('#search_form').submit(function () {
    $("#search_results_list").fadeOut(search_fade_speed);
    $("#search_results_list").empty(); //clear search result list
    var search_input = $("input:first").val();
    global_query = search_input;
    SC.get('/tracks', {
      q: search_input
    }).then(function(tracks) {
      //console.log(tracks);
      if(tracks.length == 0){ //if no results found:
        $("#search_results_list").fadeIn(search_fade_speed)
        $("#search_results_list").append("<p style='text-align:center;'>No results found :(</p>");
      }
      else{ //if we found matching tracks:
        tracks.forEach(populateSearchResultOnPage);
      }
    });
    return false; //don't refresh the page
});

//TESTING: Get Soundcloud info (for hard-coded song and artist above);
SC.get('/tracks', {
  q: song + artist
}).then(function(tracks) {
  //console.log(tracks);
  //get stream URL from soundcloud query:
  var stream_url = tracks[0]['stream_url']
  sendSteamUrlToPlayer(stream_url);
});

/*************************GENERAL BPM STUFF*************************************/

// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// Function to identify peaks
function getPeaksAtThreshold(data, threshold) {
  var peaksArray = [];
  var length = data.length;
  for(var i = 0; i < length;) {
    if (data[i] > threshold) {
      peaksArray.push(i);
      // Skip forward ~ 1/4s to get past this peak.
      i += 10000;
    }
    i++;
  }
  return peaksArray;
}

// Function used to return a histogram of peak intervals
function countIntervalsBetweenNearbyPeaks(peaks) {
  var intervalCounts = [];
  peaks.forEach(function(peak, index) {
    for(var i = 0; i < 10; i++) {
      var interval = peaks[index + i] - peak;
      var foundInterval = intervalCounts.some(function(intervalCount) {
        if (intervalCount.interval === interval)
          return intervalCount.count++;
      });
      if (!foundInterval) {
        intervalCounts.push({
          interval: interval,
          count: 1
        });
      }
    }
  });
  return intervalCounts;
}

// Function used to return a histogram of tempo candidates.
function groupNeighborsByTempo(intervalCounts, sampleRate) {
  var tempoCounts = [];
  intervalCounts.forEach(function(intervalCount, i) {
    if (intervalCount.interval !== 0) {
      // Convert an interval to tempo
      var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      theoreticalTempo = Math.round(theoreticalTempo);
      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo)
          return tempoCount.count += intervalCount.count;
      });
      if (!foundTempo) {
        tempoCounts.push({
          tempo: theoreticalTempo,
          count: intervalCount.count
        });
      }
    }
  });
  return tempoCounts;
}

//function to take in the ms_per_beat from a given source and to either set the global
//variable ms_per_beat accordingly, or discard the input ms_per_beat
function beatsPerMillisecondCallback(returned_ms_per_beat, source){
    input_array = [returned_ms_per_beat, source];
    msPerBeat_array.push(input_array);
    var arrayLength = msPerBeat_array.length;
    if(arrayLength == 1 && returned_ms_per_beat != 0){
        //if this is the first source to return a BPM AND it is non-zero:
        ms_per_beat = returned_ms_per_beat;
    }
    else{
        for (var i = 0; i < arrayLength; i++) {
            if(msPerBeat_array[i][0] != 0){
                //if the given source returned a valid tempo:
                ms_per_beat = msPerBeat_array[i][0];
                /* //commented out during development 11/8/15, not sure if we want this or not
                //if music is playing and visualizer is currently going, re-initialize it with new ms_per_beat value
                if (typeof visualizer_interval !== "undefined"){
                    visualizer();
                }*/
            }
        }
    }
    switch(source){
        case "Spotify":
            //code to run once Spotify ajax finishes
            break;
        case "Soundcloud":
            //code to run once SoundCloud ajax finishes
            break;
        case "EchoNest":
            //code to run once Echonest ajax finishes
            break;
    }

    if(returned_ms_per_beat == 0 && ms_per_beat == 500){
        source = "default"; //set source to default (just for debugging console.log below)
    }
    console.log("GLOBAL ms_per_beat is: "+ms_per_beat+" from "+source);
}


/******************************SPOTIFY STUFF*************************************/


function GetSpotifySongInfo(query){
  query = query.replace(/ /g,"+");
  url = "https://api.spotify.com/v1/search?query="+query+"&offset=0&limit=20&type=track";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    return_data = xhr.responseText
    if (xhr.readyState == 4) {
        results = JSON.parse(return_data);
        if(results.tracks.items.length == 0){ //if we weren't able to find the song via spotify:
            console.log("Song not found on Spotify");
            beatsPerMillisecondCallback(0, 'Spotify');
        }
        else{ 
            var track = results.tracks.items[0]; 
            var previewUrl = track.preview_url;
            GetMSPerBeatFromURL(previewUrl, 'Spotify');
        }
    }
  }
  xhr.open('GET', url, true);
  xhr.send();
}


/******************************ECHONEST STUFF*************************************/


function GetEchoNestSongInfo(song, artist){
  song = song.replace(/ /g,"%20");
  artist = artist.replace(/ /g,"%20");
  song_url = "http://developer.echonest.com/api/v4/song/search?api_key=SYMKX4PCI2YPULGTV&artist="+artist+"&title="+song+"&format=json";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    return_data = xhr.responseText
    if (xhr.readyState == 4) {
        results = JSON.parse(return_data);
        if(results["response"]["songs"].length == 0){ //if we weren't able to find the song via spotify:
            console.log("Song not found on EchoNest"); 
            beatsPerMillisecondCallback(0, 'EchoNest');
        }
        else{
            EN_song_id = results["response"]["songs"][0]["id"];
            GetEchoNestSongSummary(EN_song_id, function(results2){
              tempo = results2["response"]["songs"][0]["audio_summary"]["tempo"];
              tempo = Math.round(tempo); //round tempo to nearest integer
              var EN_ms_per_beat = 1/tempo*60000
              beatsPerMillisecondCallback(EN_ms_per_beat, 'EchoNest');
            });
        }
    }
  }
  xhr.open('GET', song_url, true);
  xhr.send();
}

function GetEchoNestSongSummary(song_id, callback){
    song_summary_url = "http://developer.echonest.com/api/v4/song/profile?api_key=SYMKX4PCI2YPULGTV&id="+song_id+"&bucket=audio_summary"
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      return_data = xhr.responseText
      if (xhr.readyState == 4) {
          results = JSON.parse(return_data);
          callback(results); //return results from spotify as callback
      }
    }
      xhr.open('GET', song_summary_url, true);
      xhr.send();
}

GetEchoNestSongInfo(song, artist);


/***************GetMSPerBeatFromURL - BPM Calulator*******************/


//url_origin specifies where the stream_url is coming from (e.g., Spotify, Soundlcoud, etc.)
//it is an optional argument
function GetMSPerBeatFromURL(stream_url, url_origin) {
    if (typeof url_origin === 'undefined') { 
        //if url_origin is not passed to function:
        url_origin = 'URL'; 
    }
    var request = new XMLHttpRequest();
    //prepare to send the ajax request for the spotify preview array buffer:
    request.open('GET', stream_url, true);
    request.responseType = 'arraybuffer';
    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            /*Code snippets taken from:
            **http://jmperezperez.com/beats-audio-api/
            **More info: 
            **http://tech.beatport.com/2014/web-audio/beat-detection-using-web-audio/
            **http://www.html5rocks.com/en/tutorials/webaudio/intro/
            **Example implementation: http://jmperezperez.com/beats-audio-api/script.js
            */
            // Create offline context
            var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            var offlineContext = new OfflineContext(1, buffer.length, buffer.sampleRate);
            // Create buffer source
            var source = offlineContext.createBufferSource();
            source.buffer = buffer;
            // Create a lowpass filter to isolate bass notes (likely the kick drum)
            var filter = offlineContext.createBiquadFilter();
            filter.type = "lowpass";
            // Pipe the song into the filter, and the filter into the offline context
            source.connect(filter);
            filter.connect(offlineContext.destination);
            // Schedule the song to start playing at time:0
            source.start(0);
            // Render the song
            offlineContext.startRendering();
            // Act on the result
            offlineContext.oncomplete = function(e) {
                // Filtered buffer!
                var filteredBuffer = e.renderedBuffer;
                //Begin BPM analysis code
                var peaks,
                initialThresold = 0.9,
                thresold = initialThresold,
                minThresold = 0.3,
                minPeaks = 30;
                do {
                    peaks = getPeaksAtThreshold(e.renderedBuffer.getChannelData(0), thresold);
                    thresold -= 0.05;
                } while (peaks.length < minPeaks && thresold >= minThresold);
                var intervals = countIntervalsBetweenNearbyPeaks(peaks);
                var groups = groupNeighborsByTempo(intervals, filteredBuffer.sampleRate);

                var top = groups.sort(function(intA, intB) {
                    return intB.count - intA.count;
                }).splice(0,5);

                var bpm = Math.round(top[0].tempo);
                milliseconds_per_beat = (60/bpm)*1000;
                beatsPerMillisecondCallback(milliseconds_per_beat, url_origin);
            }
        });
    }
    request.send();  
}


/****************************VISUALIZER STUFF*************************************/


player.onplay = function() {
    //start visualizer
    visualizer()
};
player.onpause = function() {
    //stop visualizer
    window.clearInterval(visualizer_interval); 
};

var sixteenth_counter = 1; //16th note counter
var eighth_counter = 1; //eight note counter
var quarter_counter = 1; //quarter note counter
var half_counter = 1; //half note counter
var whole_counter = 1; //1 measure counter
var two_counter = 1; //2 measure counter
var four_counter = 1; //4 measure counter
var eight_counter = 1; //8 measure counter
var infinite_counter = 1; //counts beats for entire song (never resets)

function dummy(){} //dummy function to be called if we don't want to do anything special on a given interval


/*counterManager function
**accepts the counter value (the counter we want to update) and the corresponding number of times per measure
**e.g., if counter_value is quarter_counter, the number of times per measure is 4 (for quarter notes)
**either adds 0.25 to the counter value or returns it to 1
**returns the new counter value
**needs to be separate from doInTime function below because the "else" part of the statement needs to happen at any time (not just the closing)
*/
function counterManager(counter_value, number_of_times_per_measure){
    if(counter_value == ((4/number_of_times_per_measure-0.25)+1)) {
        counter_value = 1;
    }
    else{
        counter_value = counter_value + 0.25;
    }
    return counter_value;
}

/*setCounters function
**Adds appropriate value to all of the counters when called in order to run them forward
**To be used in visualizerSwitch() function
*/
function SetCounters(){
    infinite_counter = infinite_counter+0.25; //starts at 1 and outputs increments of 0.25 everytime this function is called
    sixteenth_counter = counterManager(sixteenth_counter, 16); //outputs a 1 sixteen times per measure
    eighth_counter = counterManager(eighth_counter, 8); //outputs 1-1.25 eight times per measure
    quarter_counter = counterManager(quarter_counter, 4); //outputs 1-1.75 four times per measure
    half_counter = counterManager(half_counter, 2); //outputs 1-2.75 twice times per measure
    whole_counter = counterManager(whole_counter, 1); //outputs 1-4.75 once per measure
    two_counter = counterManager(two_counter, 0.5); //outputs 1-8.75 over two measures then resets
    four_counter = counterManager(four_counter, 0.25); //outputs 1-16.75 over four measures then resets
    eight_counter = counterManager(eight_counter, 0.125); //outputs 1-32.75 over eight measures then resets
}

function getAppropriateCounter(number_of_times_per_measure){
    //set the appropriate counter to watch based on number_of_times_per_measure
    switch(number_of_times_per_measure) {
        case 16:
            counter_value = sixteenth_counter;
            break;
        case 8:
            counter_value = eighth_counter;
            break;
        case 4:
            counter_value = quarter_counter;
            break;
        case 2:
            counter_value = half_counter;
            break;
        case 1:
            counter_value = whole_counter;
            break;
        case 0.5:
            counter_value = two_counter;
            break;
        case 0.25:
            counter_value = four_counter;
            break;
        case 0.125:
            counter_value = eight_counter;
            break;
        default:
            counter_value = 0;
            break;
    }
    return counter_value;
}

/*doInTime function
**accepts:
**   REQUIRED: number of times per measure to do something 
**   REQUIRED: a function to be done
**   OPTIONAL: the beat number to START at (default is 1 or the beginning of song)
**   OPTIONAL: the beat number to END at (default is beat #5,400 which is 3 hours at 2000 ms_per_beat (which is a SLOW tempo))
**   OPTIONAL: function to be called once when ending (default is dummy() function)
*/
function doInTime(number_of_times_per_measure, thing_to_do, start, end, closing_function){
    //set start_beat to be 1 if it was not passed
    if (typeof start === 'undefined') {start_beat = 1;}
    else{start_beat = convertTimeToBeats(start);}
    //set end_beat to be 5,400 if it was not passed (~3 hours at slowest ms_per_beat)
    if (typeof end === 'undefined') {end_beat = 5400;} 
    else{end_beat = convertTimeToBeats(end);}
    //set closing_function to be dummy if it was not passed
    if (typeof closing_function === 'undefined') {closing_function = dummy();}

    //set the appropriate counter to watch based on number_of_times_per_measure
    counter_value = getAppropriateCounter(number_of_times_per_measure);

    if(counter_value == ((4/number_of_times_per_measure-0.25)+1)) {
        if(infinite_counter > start_beat && infinite_counter < end_beat-0.25){
            //if we have not yet exceeded the desired end_beat:
            thing_to_do();
        }
        else if(end_beat != 0 && infinite_counter == end_beat){
            //if the desired end_beat was passed AND we've hit it:
            closing_function();
        }
    }
}


/*assumes that the start_beat is the first beat we want to do the thing on
**does it over subsequent intervals based on number_of_times_per_measure_value
**accepts:
**   REQUIRED: number of times per measure to do something 
**   REQUIRED: a function to be done
**   REQUIRED: the beat number to START at
**   OPTIONAL: the beat number to END at (default is beat #5,400 which is 3 hours at 2000 ms_per_beat (which is a SLOW tempo))
*/
function doInTimeStartingOnBeat(number_of_times_per_measure, thing_to_do, start, end){
    //set end_beat to be 5,400 if it was not passed (~3 hours at slowest ms_per_beat)
    if (typeof end === 'undefined') {end_beat = 5400;} 
    else{end_beat = convertTimeToBeats(end);}
    var start_beat = convertTimeToBeats(start);
    var beat_interval = 4/number_of_times_per_measure
    if(infinite_counter >= start_beat && infinite_counter < end_beat-.25){
        var difference = infinite_counter - start_beat;
        var mod = difference % beat_interval;
        if(mod == 0){
            thing_to_do();
        }
    }
}

/*converts time to beats based on the units specified
**E.g., input could be 4s, 4e, 4b, 4m, or just 4
**4s = 4 sixteenth notes = 1 beat
**4e = 4 eight notes = 2 beats
**4b = 4 beats
**4m = 4 measures or 16 beats
**4 by itself with no unites defaults to 4 beats
*/
function convertTimeToBeats(input){
    var beat;
    var regexp = /[0-9]$/;
    if(regexp.test(input) == true){
        //if input is just a number without any unit:
        return input;
    }
    else{
        for (var i = 0, len = input.length; i < len; i++) {
            var slice = input.slice(0,i+1);
            if (regexp.test(slice) == false) {//if we are at the end of the number:
                var number = slice.slice(0,-1);
                var unit = slice.slice(i, slice.length);
                switch(unit){
                    case "s": //sixteenth notes:
                        beat = number/4;
                        break;
                    case "e": //eighth notes:
                        beat = number/2;
                        break;
                    case "b": //beats (quarter notes):
                        beat = number;
                        break;
                    case "m": //measures:
                        beat = number*4;
                        break;
                    default:
                        beat = number;
                        break;
                }
            return beat;
            }
        }
    }
}

/*rounder() function
**accepts a number and the number of decimals to round to
**e.g., number is 55.324354 and num of decimals is 3
**returns the rounded number.  e.g., 55.324
*/
function rounder(number, decimals_to_round){
  var base_ten = Math.pow(10, decimals_to_round);
  multiplied_number = number * base_ten;
  rounded_number = Math.round(multiplied_number);
  rounded_number = rounded_number/base_ten;
  return rounded_number;
}

//takes optional 3rd parameter which is passed to the "thing_to_do" function as its parameter
function doOnceAtACertainBeat(time_to_do_thing, thing_to_do){
  var beat = convertTimeToBeats(time_to_do_thing);
  if(infinite_counter == beat){
    thing_to_do(arguments[2]);
  }
}

var visualizerSwitch = function visualizerSwitch(){
    
    SetCounters();

    //experimental 11/19:
    //doInTime(1, alternateInTime); //every measure

    summerIsOver(); //special programming for summerIsOver

    //display four count number on page
    if(Number.isInteger(whole_counter)){
        $("#counter_debug").html(whole_counter);
    }

    if(Number.isInteger(infinite_counter)){
      $("#infinite_counter_debug").html(infinite_counter);
    }

    //TESTING 11/25
    current_time = rounder(player.currentTime, 3);
    $("#current_time").html(current_time+" / "+audio_duration);
}


function visualizer(){
    if (typeof visualizer_interval !== "undefined"){
        //if the visualizer is already going, clear the interval and start over:
        window.clearInterval(visualizer_interval);
    }
    audio_duration = rounder(player.duration, 3); //set audio length
    console.log("MS per beat for visualizer is: "+ms_per_beat);
    //run visualizerSwitch function in time with the beat:
    /*TESTING 11/23/15*/if(global_query == "summer is over (rework)+Anoraak"){
      //delay animation start by 1 beat
      setTimeout(function() {
        visualizer_interval = window.setInterval(visualizerSwitch, ms_per_beat/4);
       }, ms_per_beat);
    }
    else{ //no delay:
      visualizer_interval = window.setInterval(visualizerSwitch, ms_per_beat/4);
    }
}

/************************END VISUALIZER STUFF*************************************/



/*********************BEGIN FREQUENCY VISUALIZER STUFF****************************/

// Create the analyser
var analyser = context.createAnalyser();
analyser.fftSize = 64;
var frequencyData = new Uint8Array(analyser.frequencyBinCount);

// Set up the visualisation elements
var visualisation = $("#visualisation");
var barSpacingPercent = 100 / analyser.frequencyBinCount;
for (var i = 0; i < analyser.frequencyBinCount; i++) {
    $("<div/>").css("left", i * barSpacingPercent + "%")
        .appendTo(visualisation);
}
var bars = $("#visualisation > div");

// Get the frequency data and update the visualisation
function update() {
    requestAnimationFrame(update);
    analyser.getByteFrequencyData(frequencyData);
    bars.each(function (index, bar) {
        bar.style.height = frequencyData[index] + 'px';
    });
};

// Hook up the audio routing...
// player -> analyser -> speakers
// (Do this after the player is ready to play - https://code.google.com/p/chromium/issues/detail?id=112368#c4)
var first_load = true;
$("#player").bind('canplay', function() {
    if(first_load == true){
        //only run this the first time the page loads
        var source = context.createMediaElementSource(this);
        source.connect(analyser);
        analyser.connect(context.destination);
    }
    first_load = false;
    /*
    var frameCount = context.sampleRate * 2.0;
    var buffer = context.createBuffer(2, frameCount, context.sampleRate);
    var nowBuffering = buffer.getChannelData(1);
    console.log(nowBuffering);
    */
});

// Kick it off...
update();


/***********************END FREQUENCY VISUALIZER STUFF****************************/


