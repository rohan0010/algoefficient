var express=require('express');
var app=express();
var client = require('./connection.js');
var url = require('url');
var sw = require('stopword');
var stemmer = require('stemmer');
var checkWord = require('check-word')
var words = checkWord('en');

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
function remove_stopwords_and_stemmer(str) {

    const oldString = str.split(' ')
    var newString = sw.removeStopwords(oldString)
    for (var word in newString){
      newString[word] = stemmer(newString[word]);
      var str = newString[word];
      var n = str.length;
      var i = 0;
      for (var len = 3; len <= n - 3; len++){
          if(words.check(str.substring(i,len)) && words.check(str.substring(len,n))){
            newString[word] = str.substring(i,len)+'   '+str.substring(len,n);
          }
      }
    }
    return(newString.join(' '))
}

app.get('/',function(req,res){
res.render('index.html');
});

app.get('/search', (req, res) => {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  client.search({
    index: 'movie',
    type: 'movies',
    body: {
      from: 0,
      size : 10,
      query: {
        match: {
          MovieName: {
            query: remove_stopwords_and_stemmer(query.query),
            fuzziness: "AUTO"
          }
        }
      }
    }
  },function (error, response,status) {
      var result = '[';
      if (error){
      }
      else {
        response.hits.hits.forEach(function(hit){
          if (result != '['){
            result += ','
          }
          result += JSON.stringify(hit._source);
        })
        result += ']'
        res.send(result);
      }
  });
});

var server=app.listen(process.env.PORT||5000);
