function  upload() {
  function readURL(input) {

      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#blah').attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]);
      }
  }

  $(".upload-overlay-cover").change(function(){
    $(this).click(function(){
      $(this).find("span").text("File added!")
    })
      readURL(this);
  });
}
