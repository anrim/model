var assert = require('assert');
var should = require('should');
var Model = require('..');
var ValidationError = require('anrim-validator').ValidationError;

describe('Model', function(){
  var User;
  
  before(function(){
    User = Model()
      .property('username')
      .property('created', {type: 'date', value: function(){return new Date();}})
      .property('isActive', {type: 'boolean'});
  });
  
  describe('#create', function(){
    it('should create model with no data', function(){
      var Model1 = Model().property('username');
      var user = Model1.create();
      assert.equal(typeof user, "object");
    })
    
    it('should have default value', function(){
      var Model1 = Model().property('type', {value: "PERSON"});
      var user = Model1.create();
      assert.equal(user.type, "PERSON");
    })
    
    it('should have default generated value', function(){
      var user = User.create({username: 'username'});
      assert.ok(user.created instanceof Date);
      assert.ok(user.created.getTime() <= new Date().getTime());
    })
    
    it('should convert number to Date', function(){
      var DateModel = Model().property('created', {type: 'date'});
      var now = new Date();
      var model = DateModel.create({created: now.getTime()});
      model.should.have.property('created');
      (model.created instanceof Date).should.be.true;
      model.created.getTime().should.equal(now.getTime());
    })
    
    it('should convert "true" to bool', function(){
      var BoolModel = Model().property('isActive', {type: 'boolean'});
      var model = BoolModel.create({isActive: "true"});
      (typeof model.isActive === 'boolean').should.be.true;
    })
    
    it('should not be valid without required property', function () {
      var User = Model()
        .property('username', {required: true})
        .property('email', {format: "email"});

      assert.throws(function () {
        var user = User.create();
      }, ValidationError);
    })
    
    it('should clone default array', function () {
      var Address = Model()
        .property("address", {required: true})
        
      var User = Model()
        .property('name', {required: true})
        .property('addresses', {type: "array", value: []});
      
      var user1 = User.create({name: 'user1'});
      user1.addresses.push({address: "email@server.com"});
      assert(user1.hasOwnProperty('addresses'));
      assert.equal(user1.addresses.length, 1);
      
      var user2 = User.create({name: 'user2'});
      assert.notStrictEqual(user1.addresses, user2.addresses);
      assert.equal(user2.addresses.length, 0);
    });
  });
  
  describe('property', function (){
    it('should set type to "string" as default', function(){
      var User = Model().property('name');
      assert.equal(User.properties.name.type, "string");
    })
  })
  
  describe('set', function () {
    it('should set value', function () {
      var User = Model().property('username', {required: true});
      var user = User.create({username: "me"});
      assert.equal(user.hasOwnProperty("username"), true);
    });
    
    it('should throw ValidationError when setting property with wrong type', function () {
      var User = Model().property('username', {type: "string"});
      var user = User.create({username: "me"});
      assert.throws(function () {
        user.username = 1;
      }, ValidationError);
    });
  });
  
  describe.skip('slug property', function(){
    it('should auto update slug from title property', function(){
      var Post = Model()
        .property('title', {required: true})
        .property('slug', {format: 'slug', populateFrom: 'title', type: 'string'});
        
      var m = Post.create({title: 'One two three'});
      m.should.have.property('slug', 'one-two-three');
    })
  })
  
  describe.skip('Changeset', function(){
    it('should get changeset with update', function(){
      var model = Model().property('prop1').property('prop2');
      var m = model.create({prop1: 'value', prop2: 'value'});
      m.prop1 = 'value2';
      
      var changes = m.changes;
      Object.keys(changes.updated).should.have.length(1);
      changes.updated.should.have.property('prop1', 'value2');
    })
  })
})
