const Handlebars = require('handlebars');

Handlebars.registerHelper('newWord', function(array, options) {
  
  var x = Object.keys(array);
  var length = array.length;
  var rndNum = Math.floor( Math.random() * length  );
  var nextJWord = words[rndNum].word;
  document.getElementById("sightWord").innerHTML = nextJWord;
  
});