const runType = process.argv[2];

// load environment manager to perform checks
const envManager = require("envmanager");
const manager = new envManager();

global.dir = __dirname;

if(manager.checkVariables()){
  require("dotenv").load(); // load environmental variables

  require("./src/db").connect(function(){
    if(runType === "service"){
      require("./src/services/index.js")();
      return;
    }

    require("./src/server.js")();

  });
}
