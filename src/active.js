(function() {
  var active, exec, fork, path, spawn, util, _ref;
  var __slice = Array.prototype.slice;

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec, fork = _ref.fork;

  util = require('util');

  path = require('path');

  active = function() {
    var cake_path, runCommand;
    runCommand = function() {
      var args, name, proc;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      proc = spawn(name, args);
      proc.stdout.on('data', function(buffer) {
        var message;
        message = buffer.toString();
        message = message.replace(/\s+$/g, '');
        return console.log(message);
      });
      proc.stderr.on('data', function(buffer) {
        var message;
        message = buffer.toString();
        message = message.replace(/\s+$/g, '');
        return console.log(message);
      });
      proc.on('exit', function(status) {
        if (status !== 0) return process.exit(1);
      });
      return proc;
    };
    cake_path = "" + (process.cwd()) + "/node_modules/coffee-script/bin/cake";
    return path.exists(cake_path, function(exists) {
      var cake;
      if (exists) {
        cake = runCommand(cake_path, 'active');
        return process.on('exit', function() {
          return cake.kill();
        });
      } else {
        return console.log("Cake not found. Run from a Coolkit project directory.");
      }
    });
  };

  module.exports = active;

}).call(this);
