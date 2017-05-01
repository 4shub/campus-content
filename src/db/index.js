exports.connect = function(resolve){
  const MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

    // Connection URL
  const uri = process.env.MONGO_DB_CONNECTION_URI;
  // Use connect method to connect to the Server
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    global.db = db;

    console.log("Connected correctly to mongodb instance");
    resolve();
  });
}


exports.createId = function(name){
  return name.toLowerCase().replace(/ /g, "_");
}

exports.save = function(col, object, resolve, reject){
  const collection = db.collection(col);

    // Insert some documents
    collection.save(object, function(err) {
      if(err){
        reject(err);
        return;
      }

      resolve();
    });
}

exports.update = function(col, object, resolve, reject){
  const collection = db.collection(col);

    // Insert some documents
    collection.update({"id" : object.id}, object, function(err) {
      if(err){
        reject(err);
        return;
      }

      resolve();
    });
}


exports.find = function(col, query, resolve, reject){
  const collection = db.collection(col);

    // Insert some documents
    collection.findOne(query, function(err, value) {
      if(err){
        reject(err);
        return;
      }

      resolve(value);
    });
}

exports.remove = function(col, query, resolve, reject){
  const collection = db.collection(col);

    // Insert some documents
    collection.remove(query, function(err, value) {
      if(err){
        reject(err);
        return;
      }

      resolve(value);
    });
}

exports.findAll = function(col, query, resolve, reject){
  const collection = db.collection(col);

    // Insert some documents
    collection.find(query).toArray(function(err, value) {
      if(err){
        reject(err);
        return;
      }

      resolve(value);
    });
}
