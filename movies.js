var client = require('./connection.js');
var inputfile = require("./movies.json");
var bulk = [];

var makebulk = function(movielist,callback){
  for (var current in movielist){
    bulk.push(
      { index: {_index: 'movie', _type: 'movies'} },
      {
        'MovieName': movielist[current].MovieName,
        'Year': movielist[current].Year,
        'IMDbRating': movielist[current].IMDbRating,
        'IMDbVotes': movielist[current].IMDbVotes,
        'Awards': movielist[current].Awards,
        'Language': movielist[current].Language,
        'AltText': movielist[current].AltText
      }
    );
  }
  callback(bulk);
}

var indexall = function(madebulk,callback) {
  client.bulk({
    maxRetries: 5,
    index: 'movie',
    type: 'movies',
    body: madebulk
  },function(err,resp,status) {
      if (err) {
        console.log(err);
      }
      else {
        callback(resp.items);
      }
  })
}

makebulk(inputfile,function(response){
  console.log("Bulk content prepared");
  indexall(response,function(response){
    console.log(response);
  })
});
