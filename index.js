var Schema = require('./lib/schema');
var Model = require('./lib/model');

function SchemaFactory (proto, options) {
  // Create model from proto
  proto = proto || Model;
  
  // Shared by all model instances
  var modelProto = Object.create(proto || Model, {
  });
  
  // Init
  options = options || {};
  Object.keys(options).forEach(function (option) {
    model[option] = options[option];
  });
  
  var schema = Object.create(Schema, {
    modelProto: {
      value: modelProto
    },
    properties: {
      enumerable: true,
      value: {}
    },
    relations: {
      enumerable: true,
      value: {}
    }
  });
  
  return schema;
}

exports = module.exports = SchemaFactory;

// Repo of models
var models = {};
exports.models = models;