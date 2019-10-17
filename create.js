var client = require('./connection.js');

client.indices.create({
  index: 'movie'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});
