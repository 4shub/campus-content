const fs = require("fs");
const database = require("../db");
const User = require("../tools/user").user;
const util = require("../tools/util");
const Boom = require("Boom");
const Joi = require("Joi");

function createErrMsg(key){
  let err = ""

  if(key === "email"){
    err = 'Your email is invalid';
  } else if(key === "name"){
    err = 'You have no name!';
  } else if(key === "password"){
    err = 'Your password needs to be at least 6 characters long';
  } else if(key === "confirmPassword"){
    err = 'Your passwords does not match!';
  }

  return err;
}

function createUserSession(req, res, user, server){
  req.server.app.cache.set(user.id, { account: user }, 0, (err) => {

      if (err) {
          return res(Boom.badRequest(err));
      }

      req.cookieAuth.set({ sid: user.id, account: user });

      return res(user);
  });
}

module.exports = function(server){

  server.route({
      method: 'POST',
      path:'/signup',
      handler: function (req, res) {


        let newUser = new User( req.payload.email, req.payload.password,
        {name:req.payload.name});
        newUser.create(function(user){

          createUserSession(req, res, user, server);
        }, function(err){
          if(err){
            return res(Boom.badRequest("We couldn't create your account:" + JSON.stringify(err)));
          }

          return res(Boom.badRequest("We cannot create a new account for you, there already seems to be an account with this email!"));

        })
      },
      config: {
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required().min(6),
                confirmPassword: Joi.string().required().valid(Joi.ref('password'))
            },
            failAction: function (req, res, source, error) {

              return res(Boom.badRequest(createErrMsg(error.output.payload.validation.keys[0])));
            }
        }
      }
  });


  server.route({
      method: 'POST',
      path:'/login',
      handler: function (req, res) {
        let oldUser = new User(req.payload.email, req.payload.password);

        oldUser.validate(function(user){

          createUserSession(req, res, user, server);



        }, function(err){
          if(err){
            return res(Boom.badRequest("Server eror:" + JSON.stringify(err)));
          }

          return res(Boom.badRequest("We cannot login, your username or password is wrong!"));

        })
      },
      config: {
        validate: {
            payload: {
              name:Joi.string().allow(''),
              email: Joi.string().required().email(),
              password: Joi.string().required(),
              confirmPassword:Joi.string().allow('')
            },
            failAction: function (req, res, source, error) {
              return res(Boom.badRequest(createErrMsg(error.output.payload.validation.keys[0])));
            }
        }
      }
  });


  server.route({
      method: 'GET',
      path:'/logout',
      handler: function (req, res) {

        req.cookieAuth.clear();
        return res('Logout Successful!');
      },
      config: {

      }
  });





}
