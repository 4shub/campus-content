

function loadSongs() {
  const $songHandler = $("#loadsongs");

  $.ajax({
    type: 'GET',
    url: `/songs/latest` ,
    beforeSend:function(){
      $songHandler.html("Loading Songs...")
    },
    success:function(songs){
      listSongs(songs)
    },
    error:function(){

    }
  });
}

function listSongs(songs){
  const $songHandler = $("#loadsongs");

  $songHandler.html("");

  function renderSong(song){
    return `<div data-play='${song.song_location}'class='song'><div class='song-image' style='background-image:url("https://s3-us-west-1.amazonaws.com/campus-content/${song.cover_location}")'></div><div class='song-info'><div class='song-title'>${song.name}</div><div class='song-creator'>${song.creator}</div></div></div>`
  }



  for(i in songs){

    $songHandler.append(renderSong(songs[i]))

  }
}
