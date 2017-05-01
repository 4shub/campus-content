const crypto = require('crypto');

class Key{
  constructor(values){
    if(values){
      let key = "";


      for(let i in values){
        key += crypto.randomBytes(values[i]).toString('hex');
      }

      this.key = key;

      return key;
    } else {
      throw err()
    }

  }
}

const util = {
  createKey:function(values){
    return new Key(values);
  },
  regex:{
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password:  /^.{6,}$/,
  },
  validate:{
    isObjectLiteral:function(obj){
      return (!!obj) && (obj.constructor === Object);
    },
    isFunction:function(functionToCheck){
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },
    password: function(plainPass, hashedPass, resolve){
      if(!hashedPass || util.validate.isFunction(hashedPass)){

        let new_resolve = hashedPass; // since hashPass is our resolve function

        // check if password complies with policy
        let re = this.regex.password;
        let truth = re.test(plainPass);

        if(new_resolve){
          resolve(truth);
        } else {
          return truth;
        }

      } else {
        // check if passwords are both valid with each other

        const salt = hashedPass.substr(0, 10);
        const hash = crypto.createHash('sha256').update(plainPass + salt).digest('base64');
        const validHash = (salt + hash);

        const truth = (hashedPass === validHash);

        if(resolve){
          resolve(truth); // async
        } else {
          return truth;
        }
      }

    },
    email:function(email, resolve){
      let re = this.regex.email;
      let truth = re.test(email);

      if(resolve){
        resolve(truth);
      } else {

        return truth;
      }
    }
  },
  generate:{
    saltAndHash:function(pass, resolve){
      function generateSalt(){
          let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
          let salt = '';
          for (let i = 0; i < 10; i++) {
              let p = Math.floor(Math.random() * set.length);
              salt += set[p];
          }
          return salt;
      }

      const salt = generateSalt();
      const hash = crypto.createHash('sha256').update(pass + salt).digest('base64');
      const new_pass = (salt + hash);

      if(resolve){
         resolve(new_pass);
      } else {
        return new_pass;
      }

    }
  }
}


module.exports = util;
