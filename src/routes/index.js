module.exports = function(server){
  require("./static")(server);
  require("./pages")(server);
  require("./upload")(server);
  require("./songs")(server);
  require("./authentication")(server);
}
