(function() {
  var active, exec, fork, path, spawn, util, _ref,
    __slice = Array.prototype.slice;

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec, fork = _ref.fork;

  util = require('util');

  path = require('path');

  active = function() {
    var cake, runCommand;
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
    cake = runCommand('cake', 'active');
    return process.on('exit', function() {
      return cake.kill();
    });
  };

  module.exports = active;

}).call(this);
