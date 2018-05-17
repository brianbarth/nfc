'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');
const wordData = require('./static/wordData.json');

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

  server.route ({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      let array = wordData.words;
      let word = array[Math.floor(Math.random()*array.length)];
      return h.view('index', {word, array}, viewOptions);
    }
  });
/* added semicolons to 38, 47 and similar */
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
    path: '/admin.html',
    handler: function (request, h) {
      const totalWords = wordData.words.length;
      const words = wordData.words;
      return h.view('admin', {words, totalWords}, viewOptions);

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