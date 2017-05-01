const util = require("../tools/util.js");
const AWS = require("aws-sdk");
const fs = require('fs');
const database = require("../db");

const Boom = require('boom');


function uploadFile(data, name, callback){

  AWS.config.update({region: process.env.S3_REGION});
  const s3 = new AWS.S3();



  var params = {
      Bucket: 'campus-content',
      Key: name,
      Body: data,
      ACL:'public-read'
  };

  s3.putObject(params, function (perr, pres) {
      if (perr) {
          console.log("Error uploading data: ", perr);
      } else {

      }

      callback();
  });

}



module.exports = function(server){
  server.route({
      method: 'POST',
      path:'/upload',
      handler: function (req, res){
          const data = req.payload;

          const cover_image = data['cover'];
          const song = data['song'];
          const name = data['name'];
          const id = util.createKey([4,6,3]).key;

          const song_data = {
            id:id,
            cover_location:`pictures/${id}.${cover_image.hapi.filename.split(".")[1]}`,
            song_location:`songs/${id}.${song.hapi.filename.split(".")[1]}`,
            name: name,
            creator:req.auth.credentials.account.name
          }


          uploadFile(cover_image._data, song_data.cover_location, function() {
            uploadFile(song._data, song_data.song_location, function() {
              database.save("songs", song_data, function(err){
                if(err){
                  return res(Boom.badRequest("We couldn't upload your song:" + JSON.stringify(err)));
                } else {
                  return res.redirect("/explore");
                }
              });
            });
          });



      },

      config:{
        cors: true,
        payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data',
          maxBytes: 10048576,
        },
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

};
