(function() {
  var activeScripts, active_reload, app, express, fs, labify, port, _, _base, _ref;

  if ((_ref = (_base = process.env).NODE_ENV) == null) {
    _base.NODE_ENV = 'development';
  }

  _ = require('underscore');

  fs = require('fs');

  express = require('express');

  labify = (require('./lib/labify')).labify;

  app = express.createServer();

  app.configure(function() {
    return app.use(express.static(__dirname + '/public'));
  });

  activeScripts = function(req, res) {
    return fs.readFile(__dirname + '/config/lab.json', function(err, data) {
      var lab_config, loader;
      lab_config = JSON.parse(data);
      loader = '$LAB';
      loader += labify('vendor', lab_config.vendor);
      loader += labify('app', lab_config.app);
      loader += ".script('/js/main.js');";
      if (process.env.activeReload != null) {
        loader += "$LAB.script('/socket.io/socket.io.js').wait(function(){        var socket = io.connect('http://localhost');        socket.on('message', function(m) {          if (m.name === 'coffee') {            location.reload();          }        });      })";
      }
      fs.writeFile(__dirname + '/public/js/loader.js', loader);
      return res.send(loader);
    });
  };

  app.get('/loader.js', function(req, res) {
    res.contentType('application/javascript');
    if (process.env.NODE_ENV === 'production') {
      return fs.readFile(__dirname + '/public/js/loader.js', function(err, data) {
        return res.send(data);
      });
    } else {
      return activeScripts(req, res);
    }
  });

  port = process.env.PORT || 3000;

  app.listen(port);

  active_reload = function() {
    var io, sockets;
    io = (require('socket.io')).listen(app);
    io.set('log level', 0);
    sockets = {};
    io.sockets.on('connection', function(socket) {
      return sockets[socket.id] = socket;
    });
    io.sockets.on('disconnect', function(socket) {
      return delete sockets[socket.id];
    });
    return process.on('message', function(m) {
      var key, value, _results;
      if (m.name === 'coffee' && m.type === 'stdout') {
        console.log("broadcasting", m.message);
        _results = [];
        for (key in sockets) {
          value = sockets[key];
          _results.push(value.emit('message', m));
        }
        return _results;
      }
    });
  };

  if (process.env.activeReload != null) active_reload();

  console.log("Coolkit Server running at http://localhost:" + port + "/");

}).call(this);
