var toFunction = require('to-function');

function mapper(obj, map) {
  var result = {};
  Object.keys(map).forEach(function(s){
    var fn = toFunction(s);
    var val = fn(obj);
    
    var k = map[s];
    if (typeof k === "string") {
      result[k] = val;
    } else if (typeof k === "function"){
      var o = k(val);
      Object.keys(o).forEach(function(k){result[k]=o[k];});
    } else {
      // ignore
    }
  })
  return result;
}

module.exports = mapper;