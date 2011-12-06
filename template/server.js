(function() {
  var app, express, fs, labify, port, _;
  _ = require('underscore');
  fs = require('fs');
  express = require('express');
  labify = (require('./lib/labify')).labify;
  app = express.createServer();
  app.configure(function() {
    return app.use(express.static(__dirname + '/public'));
  });
  app.get('/loader.js', function(req, res) {
    var lab_config, loader;
    res.contentType('application/javascript');
    lab_config = JSON.parse(fs.readFileSync(__dirname + '/config/lab.json'));
    loader = '$LAB';
    loader += labify('vendor', lab_config.vendor);
    loader += labify('config', lab_config.config);
    loader += labify('app', lab_config.app);
    loader += ".script('/js/main.js');";
    return res.send(loader);
  });
  port = process.env.PORT || 3000;
  app.listen(port);
  console.log("JSCoolkit Server running at http://localhost:" + port + "/");
}).call(this);
