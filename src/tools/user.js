const database = require("../db");
const utilities = require('../tools/util.js');

class user{
  constructor(email, password, data, id){
    this.email = email;
    this.name = (data.name) ? data.name : null;
    this.status = (data.status) ? data.status : null;
    this.id = (id) ? id : this.assignId();
    this.password = (password) ? password : null;
  }

  assignId(){
    return utilities.createKey([4,6,3]).key;
  }

  get(){
    return {
      email:this.email,
      name:this.name,
      id:this.id,
      status:this.status,
      password:this.password
    }
  }

  setCookie(){
    return {
      email:this.email,
      id:this.id,
      status:this.status,
      name:this.name,
    }
  }

  encodePassword(password){
    this.password = utilities.generate.saltAndHash(this.password);
  }

  static find(query, resolve, reject){
    database.find("user", query, function (user) {
      resolve(user);
    }, function(err){
      reject(err);
    });
  }

  remove(resolve, reject){
    const user = this;
    database.remove("user", {email:user.email}, function (user) {
      resolve(user);
    }, function(err){
      reject(err);
    })
  }

  update(resolve, reject){
    const update_data = that.get();
    const that = this;

    database.update("user", update_data, function(err){
      if(err){
        reject(err);
      } else {
        that.find("user", {user:update_data.id}, function(user){
          resolve(user);
        }, function(err){
          reject(err);
        })
      }
    });
  }

  create(resolve, reject){
    // check if email already exists
    let that = this;
        that.encodePassword();
        that.status = "member";

    user.find({email:this.email}, function(user){
      if(user){
          reject(false); // the user exists
          return;
      }
      const new_user = that.get();
      database.save("user", new_user, function(err){
        if(err){
          reject(err);
        } else {
          resolve(new_user);
        }
      });
    }, function(err){
      reject(err);
    });
  }

  validate(resolve, reject){
    // check if email already exists
    let that = this;

    user.find({email:this.email}, function(user){
      if(!user){
          reject();
          return;
      }

      if(utilities.validate.password(that.password, user.password)){

        that.id = user.id;
        that.name = user.name;
        that.password = user.password
        that.status = user.status
        resolve(user);
        return;
      }

      reject();
    }, function(err){
      reject(err);
    });
  }
}

exports.user = user;
