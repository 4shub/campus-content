const fs = require("fs");
const database = require("../db");
const Boom = require("Boom");

module.exports = function(server){

  server.route({
      method: 'GET',
      path:'/',
      handler: function (req, res) {

        res.view('index', {
          title: 'Campus Content',
          type:'index',
          status: process.env.STATUS,
          user:req.auth.credentials.account
        });
      },
      config:{
        auth: {
          strategy: 'session',
          mode: 'try'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        },
      }
  });

  server.route({
      method: 'GET',
      path:'/explore',
      handler: function (req, res) {
        res.view('index', {
          title: 'Campus Content',
          type:'explore',
          status: process.env.STATUS,
          user:req.auth.credentials.account
        });
      },
      config:{
        auth: {
          strategy: 'session',
          mode: 'try'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        },
      }
  });


  server.route({
      method: 'GET',
      path:'/upload',
      handler: function (req, res) {
        res.view('index', {
          title: 'Campus Content',
          type:'upload',
          status: process.env.STATUS,
          user:req.auth.credentials.account
        });
      },
      config:{
        auth: {
          strategy: 'session',
          mode: 'try'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        },
      }
  });

  server.route({
      method: 'GET',
      path:'/contribute',
      config:{
        handler: function (req, res) {
          res.view('index', {
            title: 'Campus Content | Contribute',
            type:'auth',
            status: process.env.STATUS,
          });
        },
      },



  });

  server.route({
      method: 'GET',
      path:'/login',
      handler: function (req, res) {
        return res.redirect("/contribute");
      },
      config: {

      }
  });


  server.route({
      method: 'GET',
      path:'/signup',
      handler: function (req, res) {
        return res.redirect("/contribute");
      },
      config: {

      }
  });


}
