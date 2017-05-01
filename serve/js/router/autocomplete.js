class dropdown{
  constructor(id) {
    this.rootParent = $(`#${id}`);
    const dropHTML = `<div style='display:none; top:${this.rootParent.height() + 10}' class='autocomplete'></div>`
    this.rootParent.append(dropHTML);

    this.root = $(`#${id} .autocomplete`);
    this.id = id;
    this.inject = ""

    this.root.append(dropHTML);
  }

  clear(){

    this.root.html("");
    this.root.css("display", "none");
  }

  list(results){
    let that = this;
    that.clear();

    if(results.length){
      this.root.css("display", "block");
      results.map(function(result, key){
        function selected(key){
          return (key === 0) ? "selected" : "";
        }
        that.root.append(`<a href='/topics/${result.id}'><li class='${selected(key)} autocomplete-item'>${result.title}</li></a>`);
      })
    } else {
      this.root.css("display", "none");
    }


  }


}

function autocomplete(){
  let searchMain = new dropdown("learn-main-search");

  function doPrimarySearch(topic){
    $.ajax({
      type: 'GET',
      url: `/search/${topic}` ,
      beforeSend:function(){
        // this is where we append a loading image
        $('#ajax-panel').html('<div class="loading"><img src="/images/loading.gif" alt="Loading..." /></div>');
      },
      success:function(data){
        searchMain.list(data);
      },
      error:function(){
        // failed request; give feedback to user
        $('#ajax-panel').html('<p class="error"><strong>Oops!</strong> Try that again in a few moments.</p>');
      }
    });
  };

  let timer;

  $("#learn-main-search input").keyup(function(e){
    const topic = $(this).val();
    if(topic){
      clearTimeout(timer);
      timer = setTimeout(() => doPrimarySearch(topic), 100)

      return;
    }

    searchMain.clear();
  });

  $("#learn-main-search input").keyup(function(e){
    const selected = $("#learn-main-search .autocomplete").find(".selected");
    switch(e.keyCode){
      case 13:
        window.location.href = selected.parent().attr("href");
      }
  });

  $("#submitSearch").click(function(){
    const selected = $("#learn-main-search .autocomplete").find(".selected");
    const redirectTo = selected.parent().attr("href");
    window.location.href = (redirectTo) ? redirectTo :  "/topics/economics";
  });
}
