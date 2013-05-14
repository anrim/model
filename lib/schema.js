/**
* Schema
*/
var Schema = Object.create({});
module.exports = Schema;

Schema.create = function (data) {
  data = data || {};
   
  // Copy methods to model proto
  Object.keys(this).forEach(function (prop) {
    if (['properties', 'relations'].indexOf(prop) < 0 && !this.modelProto.hasOwnProperty(prop)) {
      this.modelProto[prop] = this[prop];
    }
  }, this);
  
  // Create instance of model;
  var model = Object.create(this.modelProto, {
    _data: {
      value: {}
    },
    _changesets: {
      value: []
    },
    _schema: {
     value: this 
    }
  });
  
  // Create properties
  var properties = this.properties;
  Object.keys(properties).forEach(function (prop) {
    var property = properties[prop];
    
    Object.defineProperty(model, prop, {
      enumerable: true,
      get: function () {
        return this.get(prop);
      },
      set: function (value) {
        this.set(prop, value);
      }
    });
    
    // Default value
    if ('value' in property) {
      var value;
      if (typeof property.value === "function") {
        value = property.value.call(model);
      } else if (Array.isArray(property.value)) {
        value = property.value.slice(0);
      } else {
        value = property.value;
      }
      model.set(prop, value, {silent: true});
    }
  });
  
  // Set values
  Object.keys(data).forEach(function (k) {
    // only set values for properties in schema
    if (k in properties) {
      model.set(k, data[k], {silent: true});
    }
  });
  
  // Validate model
  model.validate();
  
  // Create relations
  var relations = this.relations;
  Object.keys(relations).forEach(function(name){
    if (name in data) {
      var relation = relations[name];
      var relatedModel = MODELS[relation.model];
      if (relation.toMany) {
        var models = array(data[name].map(relatedModel.create.bind(relatedModel)));
        models.on('add', change.bind(this, 'add'));
        models.on('remove', change.bind(this, 'delete'));
        
        function change (action, item) {
          this.change({
            action: action+' item',
            property: name,
            value: item
          });
        }
        
        Object.defineProperty(model, name, {
          enumerable: true,
          value: models
        });
        
      } else {
        // TODO lookup foreign key
        throw "Not implemented";
      }
    }
  }, this);
  
  return model;
}

Schema.property = function (name, options) {
  options = options || {};
  
  // default type is string
  if(!('type' in options)) {
    options.type = 'string';
  }
  this.properties[name] = options;
  return this;
}

Schema.relationship = function (name, options) {
  this.relations[name] = options;
  return this;
}