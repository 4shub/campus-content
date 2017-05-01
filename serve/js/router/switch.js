function switchjs(){
  $(".switch").click(function(){
    const $this = $(this);
    $(".switch").removeClass("selected");
    $this.addClass("selected");
    $this.parent().parent().attr("data-type", $this.data('type'));

  })
}
