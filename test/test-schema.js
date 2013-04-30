var assert = require('assert');
var should = require('should');
var Model = require('..');

describe('Model', function(){
  describe('#create', function(){
    it('should create Model', function(){
      var m = Model();
      m.should.be.an.instanceOf(Object);
    });
    
    it.skip('should inherit from proptype object', function(){
      var parent = Model().property('parent');
      var child = Model(parent).property('child');
      child.properties.should.have.property('parent');
    });
    
    it.skip('should be prototype of Model', function(){
      var parent = Object.create({});
      (function (){
        var child = Model(parent);
      }).should.throw()
    });
  });
  
  describe('property', function(){
    it('should create property with type', function(){
      var m = Model().property('prop', {type: 'string'});
      m.properties.should.have.ownProperty('prop');
      m.properties.prop.should.have.property('type', 'string');
      Object.keys(m.properties).should.have.length(1);
    })
    
    it('should create a property with default type of string', function(){
      var m = Model().property('prop');
      m.properties.should.have.ownProperty('prop');
      m.properties.prop.should.have.ownProperty('type', 'string');
    });
  });
  
  describe('method', function () {
    it('should create method on prototype', function () {
      var User = Model()
        .property('username')
        .property('password');
        
      User.authenticate = function (username, password) {
        return username == this.username && password == this.password;
      }
      
      var user = User.create({username: "me", password: "secret"});
      user.should.have.property('authenticate');
      user.authenticate.should.be.a('function');
      user.authenticate("me", "secret").should.equal(true);
    });
  });
  
  describe.skip('relationship', function () {
    it('should create a one-to-many relationship', function () {
      var User = Model()
        .property("name")
        .relationship("roles", {toMany: true, model: "Role"});
        
      var Role = Model()
        .property("name")
        .relationship("user", {model: "User"});
        
      var user = User.create({name: "Me", roles: [{name: "user"}, {name: "admin"}]});
      user.should.have.ownProperty('roles');
      user.roles.push.should.be.a('function');
    });
  });
});
