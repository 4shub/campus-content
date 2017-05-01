'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const Inert = require('inert');
const Vision = require('vision');
const Path = require('path');
const cookie = require('hapi-auth-cookie');


const server = new Hapi.Server({
  connections: {
       routes: {
           files: {
               relativeTo: Path.join(dir, 'src/static')
           }
       }
   }
});

module.exports = function(){

  // create connection
  server.connection({
      host: 'localhost',
      port: process.env.PORT
  });

  server.register([Vision, cookie, Inert], (err) => {
    if(err){
      throw err;
    }

    const cache = server.cache(
      {
        segment: 'sessions',
        expiresIn: 3 * 24 * 60 * 60 * 1000
      });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', {
      password: process.env.COOKIE_SECRET, //  secret
      cookie: process.env.COOKIE_NAME,
      ttl: 24 * 60 * 60 * 1000  * 30,
      redirectTo: '/contribute',
      isSecure: false,
      validateFunc: function (request, session, callback) {

            cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
        }
    });

    if (err) {
        throw err;
    }




    require("./routes")(server);
  });


  server.start((err) => {
      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });




}
