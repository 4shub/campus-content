
module.exports = function(server){
  // views
  server.views({
      engines: { pug: require('pug') },
      path: dir + '/serve/templates',
      compileOptions: {
          pretty: true
      }
  });

  // serve default files
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
  });
};
