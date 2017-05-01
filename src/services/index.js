module.exports = function(){
  const serviceType = process.argv[3];

  if(!serviceType){
    throw 'Please specify a particular service you would like to run!'
  }

  switch(serviceType){
    default:
      throw 'This service does not exist!'
  }


}
