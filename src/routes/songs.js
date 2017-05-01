const database = require("../db");

module.exports = function(server){



  server.route({
    method: 'GET',
    path: '/songs/latest',
    handler: function(req, res){
      database.findAll("songs", {}, function (songs) {
        return res(songs)
      }, function(err){
        return res(Boom.badRequest("Song not found!"));
      });
    }
  });

  // serve default files
  server.route({
    method: 'GET',
    path: '/songs/{songId}',
    handler: function(req, res){
      database.find("songs", {id: req.params['songId']}, function (song) {
        return res(song)
      }, function(err){
        return res(Boom.badRequest("Song not found!"));
      });
    }
  });
};
