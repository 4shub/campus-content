
function songPlayer() {

}

$(document).on("click", ".song", function(){
  const music = document.getElementById('music');

  $(".player").animate({
    bottom:0,
  }, 500);

  $(".song").removeClass("selected");
  $("#music").attr('src', `https://s3-us-west-1.amazonaws.com/campus-content/${$(this).data('play')}`)

  music.play();
  playSong(music);

  $(".player .song-title").text($(this).find(".song-title").text());

  $(".player .song-creator").text($(this).find(".song-creator").text());
  $(this).addClass("selected");
})

function playSong(music){

  let duration = music.duration;
  const playButton = document.getElementById('playButton');
  const playhead = document.getElementById('playhead');
  const timeline = document.getElementById('timeline');

  var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

  playButton.addEventListener("click", play);

  // timeupdate event listener
  music.addEventListener("timeupdate", timeUpdate, false);

  // makes timeline clickable
  timeline.addEventListener("click", function(event) {
      moveplayhead(event);
      music.currentTime = duration * clickPercent(event);
  }, false);

  // returns click as decimal (.77) of the total timelineWidth
  function clickPercent(event) {
      return (event.clientX - getPosition(timeline)) / timelineWidth;
  }

  // makes playhead draggable
  playhead.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  // Boolean value so that audio position is updated only when the playhead is released
  var onplayhead = false;

  // mouseDown EventListener
  function mouseDown() {
      onplayhead = true;
      window.addEventListener('mousemove', moveplayhead, true);
      music.removeEventListener('timeupdate', timeUpdate, false);
  }

  // mouseUp EventListener
  // getting input from all mouse clicks
  function mouseUp(event) {
      if (onplayhead == true) {
          moveplayhead(event);
          window.removeEventListener('mousemove', moveplayhead, true);
          // change current time
          music.currentTime = duration * clickPercent(event);
          music.addEventListener('timeupdate', timeUpdate, false);
      }
      onplayhead = false;
  }
  // mousemove EventListener
  // Moves playhead as user drags
  function moveplayhead(event) {
      var newMargLeft = event.clientX - getPosition(timeline);

      if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
          playhead.style.marginLeft = newMargLeft + "px";
      }
      if (newMargLeft < 0) {
          playhead.style.marginLeft = "0px";
      }
      if (newMargLeft > timelineWidth) {
          playhead.style.marginLeft = timelineWidth + "px";
      }
  }

  // timeUpdate
  // Synchronizes playhead position with current point in audio
  function timeUpdate() {
      var playPercent = timelineWidth * (music.currentTime / duration);
      playhead.style.marginLeft = playPercent + "px";
      if (music.currentTime == duration) {
          playButton.className = "";
          playButton.className = "play";
      }
  }

  //Play and Pause
  function play() {
      // start music
      if (music.paused) {
          music.play();
          // remove play, add pause
          playButton.className = "";
          playButton.className = "pause";
      } else { // pause music
          music.pause();
          // remove pause, add play
          playButton.className = "";
          playButton.className = "play";
      }
  }

  // Gets audio file duration
  music.addEventListener("canplaythrough", function() {
      duration = music.duration;
  }, false);

  // getPosition
  // Returns elements left position relative to top-left of viewport
  function getPosition(el) {
      return el.getBoundingClientRect().left;
  }

}
