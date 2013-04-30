var Observable = require('anrim-observable');
var Validator = require('anrim-validator');
var validator = Validator();

/**
* Model base object
*/
var Model = Object.create(Observable, {});
module.exports = Model;

Model.get = function (prop) {
  return this._data[prop];
}

Model.set = function (prop, value, options) {
  if (!prop) {
    throw new TypeError('Model.set - property name is required');
  }
  value = convert(value, this._schema.properties[prop].type);
  options = options || {};
  
  var err = this.validateProperty(prop, value);
  if (err) {
    throw err;
  }
  
  // Set value
  this._data[prop] = value;
  
  // record change
  if (!options.silent) {
    this.change({
      action: (typeof value === "undefined")?'delete':'update',
      property: prop,
      value: value
    });

    // fire event
    var obj = {};
    obj[prop] = value;
    this.trigger('change', obj);
    this.trigger('change '+prop, value);
  }
}

Model.change = function (options) {
  // console.log(options.action, options.property, options.value);
  this._changesets.push(options);
}

Model.validateProperty = function (name, value) {
  var error;
  if (name in this._schema.properties) {
    var obj = {};
    obj[name] = value;
    
    var schema = {properties: {}};
    schema.properties[name] = this._schema.properties[name];
    
    var errors = validator.validate(obj, schema);
    if (errors) {
      throw errors[0];
    }
  }
}

Model.validate = function () {
  var errors = validator.validate(this, this._schema);
  if (errors) {
    throw errors[0];
  }
}

// Object.defineProperty(Model, 'changes', {
//   enumerable: true,
//   get: function () {
//     var changes = {deleted: [], updated: {}};
//     this._changesets.forEach(function(changeset){
//       if (changeset.action === 'Delete' && changes.deleted.indexOf(changeset.property) < 0) {
//         changes.deleted.push(changeset.property);
//       } else if (changeset.action === 'Update') {
//         changes.updated[changeset.property] = changeset.value;
//       }
//     })
//     return changes;
//   }
// });

// Helpers
function convert(value, type) {
  switch (type) {
    case 'date':
      if (!(value instanceof Date)) {
        value = new Date(value);
      }
      break;
    case 'boolean':
      if (!(value instanceof Boolean)) {
        value = Boolean(value);
      }
      break;
    case "number":
      value = Number(value);
      break;
  }
  return value;
}