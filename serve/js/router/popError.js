function popBar(type, text){
  return `<div class='${type} popBar'>${text}</div>`
}

function popError(err){
  err = err.responseJSON.message;
  $("body").prepend(popBar('error', err));
  const $popBar = $(".popBar");

  $popBar.css("top", -$popBar.height())
  $popBar.css("display","block");
  $popBar.animate({
    top:0
  });

  setTimeout(function(){
    $popBar.animate({
      top:-$popBar.height()
    }, 600, function(){
      $popBar.remove();
    })
  }, 6 * 1000)
}
