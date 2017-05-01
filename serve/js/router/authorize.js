function authorize(){
  $("#submitSignup").click(function(){
    let signupButton = new asyncButton($(this).find("span:nth-child(1)"));
    authUp("signup", signupButton);
  });

  $("#submitLogin").click(function(){
    let loginButton = new asyncButton($(this).find("span:nth-child(1)"));
    authUp("login", loginButton);
  });
}

function packageAuth(){

  const $auth = $("#contribute-form")

  function contibPart(part){
    return $auth.find(`#contribute-${part}`).val();
  }

  return {
    name:contibPart("name"),
    email:contibPart("email"),
    password:contibPart("password"),
    confirmPassword:contibPart("password-confirm"),
  }
}

function userIsLoggedIn(){
  window.location.href = "/explore"
}

class asyncButton{
  constructor($this){
    this.original = $this.text();
    this.$object = $this;
  }

  loading(override){
    this.$object.text((override) ? override : "Loading...");
  }

  done(){
    this.$object.text(this.original);
  }
}

function authUp(type, signupButton){

  $.ajax({
    type: 'POST',
    url: `/${type}` ,
    data:packageAuth(),
    dataType:"json",
    beforeSend:function(){
      signupButton.loading((type === "signup") ? "Signing up..." : "Logging In...");
    },
    success:function(data){
      signupButton.done();
      userIsLoggedIn();
    },
    error:function(err){
      signupButton.done();
      popError(err);
    }
  });
}
