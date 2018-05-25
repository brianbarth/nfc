'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');
const wordData = require('./static/wordData.json');

const loggedCookie = 'monkeyIsLoggedIn';
const messageCookie = 'monkeyMessage';

const server = Hapi.server({
  port: 4000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'static')
    }
  },
  debug: { request: '*' }
});

const viewOptions = {layout: 'mainLayout'};

const start = async () => {
  await server.register(Inert);
  await server.register(Vision);

  server.views({
    engines: {
      handlebars: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates',
    layoutPath: 'templates/layout',
    helpersPath: 'templates/helpers'
  });

  server.state(loggedCookie, {
    isSecure: false,
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: false, // remove invalid cookies
    strictHeader: false // don't allow violations of RFC 6265
  });

  server.state(messageCookie, {
    isSecure: false,
    isHttpOnly: true,
    encoding: 'none',
    clearInvalid: false, // remove invalid cookies
    strictHeader: false // don't allow violations of RFC 6265
  });


  server.route ({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      let array = wordData.words;
      let word = array[Math.floor(Math.random()*array.length)];
      let newArray = JSON.stringify(wordData.words);
      let loggedIn = request.state[loggedCookie] === 'true';
      let home = false;

      let message = request.state[messageCookie] || false;
      h.state(messageCookie, null)
      
      return h.view('index', {word, newArray, loggedIn, home, message}, viewOptions);
    }
  });

  server.route ({
    method: 'POST',
    path: '/',
    handler: function (request, h) {
      let array = wordData.words;
      let word = array[Math.floor(Math.random()*array.length)];
      let newArray = JSON.stringify(wordData.words);

      const { username, password} = request.payload;

      let loggedIn = (username === 'brian' && password === 'monkey');

      let home = false;

      h.state(loggedCookie, loggedIn ? 'true' : 'false');

      if(loggedIn){
        return h.view('index', {word, newArray, loggedIn, home}, viewOptions);
      }
      
      return h.view('login', {word, newArray, loggedIn, home}, viewOptions);
    }
  });

  server.route ({
    method: 'GET',
    path: '/login.html',
    handler: function (request, h) {
      const stuff = {car: 'beater', bear: 'winnie'};
      return h.view('login', stuff, viewOptions)
    }
  });

  server.route ({
    method: 'GET',
    path: '/user/new',
    handler: function (request, h) {
      const user = {firstName: null, lastname: null};
      return h.view('editUser', user, viewOptions)
    }
  });

  server.route ({
    method: 'GET',
    path: '/user/{id}',
    handler: function (request, h) {
      const user = {firstName: 'Bridan', lastName: 'barth'};
      return h.view('editUser', user, viewOptions)
    }
  });



  server.route ({
    method: 'GET',
    path: '/admin.html',
    handler: function (request, h) {
      const totalWords = wordData.words.length;
      const words = wordData.words;
      let loggedIn = request.state[loggedCookie] === 'true';
      let home = true;

      if(!loggedIn){
        return h.view('login', {words, totalWords, loggedIn, home}, viewOptions);
      }

      

      return h.view('admin', {words, totalWords, loggedIn, home}, viewOptions);

    }

  });

  server.route ({
    method: 'GET',
    path: '/logout.html',
    handler: function (request, h) {
      let loggedIn = false;
      let home = true;

      h.state(loggedCookie, 'false');
      h.state(messageCookie, "You have been logged out.");

      return h.redirect('/')

    }
  });

  server.route({    /*static file route!!!!!!!!!!!!!!!!!!*/
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.'
      }
    }
  });

  await server.start();

  console.log('Server started listening on %s', server.info.uri);

};

start();