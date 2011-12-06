(function() {
  var EventEmitter, async, capitalize, colorize, colors, exec, extend, fileUtil, formatDate, fs, getColor, name, notifiers, pad, path, spawn, transform, util, walkTree, _, _fn, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  fs = require('fs');
  path = require('path');
  fileUtil = require('file');
  util = require('util');
  _ref = require('child_process'), exec = _ref.exec, spawn = _ref.spawn;
  EventEmitter = require('events').EventEmitter;
  async = require('async');
  _ = require('underscore');
  exports.extend = extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      if (!__hasProp.call(properties, key)) continue;
      val = properties[key];
      object[key] = val;
    }
    return object;
  };
  exports.copyFile = function(source, destination, callback) {
    var read, write;
    read = fs.createReadStream(source);
    write = fs.createWriteStream(destination);
    return util.pump(read, write, function() {
      return typeof callback === "function" ? callback() : void 0;
    });
  };
  exports.walkTreeAndCopyFiles = walkTree = function(source, destination, callback) {
    return fs.readdir(source, function(error, files) {
      if (error) {
        return callback(error);
      }
      return async.forEach(files, function(file, next) {
        var destinationPath, sourcePath;
        if (file.match(/^\./)) {
          return next();
        }
        sourcePath = path.join(source, file);
        destinationPath = path.join(destination, file);
        return fs.stat(sourcePath, function(error, stats) {
          if (!error && stats.isDirectory()) {
            return fs.mkdir(destinationPath, 0755, function() {
              return walkTree(sourcePath, destinationPath, function(error, destinationPath) {
                if (destinationPath) {
                  return callback(error, destinationPath);
                } else {
                  return next();
                }
              });
            });
          } else {
            return exports.copyFile(sourcePath, destinationPath, function() {
              callback(error, destinationPath);
              return next();
            });
          }
        });
      }, callback);
    });
  };
  exports.createBuildDirectories = function(buildPath, directories) {
    var dirPath, _i, _len, _results;
    if (directories == null) {
      directories = ['web/css', 'web/js'];
    }
    _results = [];
    for (_i = 0, _len = directories.length; _i < _len; _i++) {
      dirPath = directories[_i];
      _results.push(fileUtil.mkdirsSync(path.join(buildPath, dirPath), 0755));
    }
    return _results;
  };
  exports.recursiveCopy = function(source, destination, callback) {
    var paths;
    fileUtil.mkdirsSync(destination, 0755);
    paths = [];
    return walkTree(source, destination, function(err, filename) {
      if (err) {
        return callback(err);
      } else if (filename) {
        return paths.push(filename);
      } else {
        return callback(err, paths.sort());
      }
    });
  };
  exports.Watcher = (function() {
    __extends(Watcher, EventEmitter);
    Watcher.prototype.invalid = /^(\.|#)/;
    function Watcher() {
      this.watched = {};
    }
    Watcher.prototype._getWatchedDir = function(directory) {
      var _base, _ref2;
      return (_ref2 = (_base = this.watched)[directory]) != null ? _ref2 : _base[directory] = [];
    };
    Watcher.prototype._watch = function(item, callback) {
      var basename, parent;
      parent = this._getWatchedDir(path.dirname(item));
      basename = path.basename(item);
      if (__indexOf.call(parent, basename) >= 0) {
        return;
      }
      parent.push(basename);
      return fs.watchFile(item, {
        persistent: true,
        interval: 500
      }, __bind(function(curr, prev) {
        if (curr.mtime.getTime() !== prev.mtime.getTime()) {
          return typeof callback === "function" ? callback(item) : void 0;
        }
      }, this));
    };
    Watcher.prototype._handleFile = function(file) {
      var emit;
      emit = __bind(function(file) {
        return this.emit('change', file);
      }, this);
      emit(file);
      return this._watch(file, emit);
    };
    Watcher.prototype._handleDir = function(directory) {
      var read;
      read = __bind(function(directory) {
        return fs.readdir(directory, __bind(function(error, current) {
          var file, previous, _i, _j, _len, _len2, _results;
          if (error != null) {
            return exports.logError(error);
          }
          if (!current) {
            return;
          }
          previous = this._getWatchedDir(directory);
          for (_i = 0, _len = previous.length; _i < _len; _i++) {
            file = previous[_i];
            if (__indexOf.call(current, file) < 0) {
              console.log('Deleting file', path.join(directory, file));
              this.emit('delete', file);
            }
          }
          _results = [];
          for (_j = 0, _len2 = current.length; _j < _len2; _j++) {
            file = current[_j];
            if (__indexOf.call(previous, file) < 0) {
              _results.push(this._handle(path.join(directory, file)));
            }
          }
          return _results;
        }, this));
      }, this);
      read(directory);
      return this._watch(directory, read);
    };
    Watcher.prototype._handle = function(file) {
      if (this.invalid.test(path.basename(file))) {
        return;
      }
      return fs.realpath(file, __bind(function(error, filePath) {
        if (error != null) {
          return exports.logError(error);
        }
        return fs.stat(file, __bind(function(error, stats) {
          if (error != null) {
            return exports.logError(error);
          }
          if (stats.isFile()) {
            this._handleFile(file);
          }
          if (stats.isDirectory()) {
            return this._handleDir(file);
          }
        }, this));
      }, this));
    };
    Watcher.prototype.add = function(file) {
      this._handle(file);
      return this;
    };
    Watcher.prototype.onChange = function(callback) {
      this.on('change', callback);
      return this;
    };
    Watcher.prototype.onDelete = function(callback) {
      this.on('delete', callback);
      return this;
    };
    Watcher.prototype.clear = function() {
      var directory, file, files, _i, _len, _ref2;
      this.removeAllListeners('change');
      _ref2 = this.watched;
      for (directory in _ref2) {
        files = _ref2[directory];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          fs.unwatchFile(path.join(directory, file));
        }
      }
      this.watched = {};
      return this;
    };
    return Watcher;
  })();
  exports.filterFiles = function(files, sourcePath) {
    return files.filter(function(filename) {
      var stats;
      if (exports.Watcher.prototype.invalid.test(filename)) {
        return false;
      }
      stats = fs.statSync(path.join(sourcePath, filename));
      if (stats != null ? stats.isDirectory() : void 0) {
        return false;
      }
      return true;
    });
  };
  colors = {
    black: 30,
    red: 31,
    green: 32,
    brown: 33,
    blue: 34,
    purple: 35,
    cyan: 36,
    gray: 37,
    none: '',
    reset: 0
  };
  getColor = function(color) {
    return colors[color.toString()] || colors.none;
  };
  colorize = function(text, color) {
    return "\033[" + (getColor(color)) + "m" + text + "\033[" + (getColor('reset')) + "m";
  };
  pad = function(number) {
    var num;
    num = "" + number;
    if (num.length < 2) {
      return "0" + num;
    } else {
      return num;
    }
  };
  formatDate = function(color) {
    var date, item, time, timeArr;
    if (color == null) {
      color = 'none';
    }
    date = new Date;
    timeArr = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = ['Hours', 'Minutes', 'Seconds'];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        _results.push(pad(date['get' + item]()));
      }
      return _results;
    })();
    time = timeArr.join(':');
    return colorize("[" + time + "]:", color);
  };
  exports.capitalize = capitalize = function(string) {
    return string[0].toUpperCase() + string.slice(1);
  };
  exports.formatClassName = function(filename) {
    return filename.split('_').map(capitalize).join('');
  };
  exports.isTesting = function() {
    return 'jasmine' in global;
  };
  exports.notify = function(title, text) {
    return null;
  };
  exports.notifiers = notifiers = {
    growlnotify: function(title, text) {
      return [title, '-m', text];
    },
    'notify-send': function(title, text) {
      return [title, text];
    }
  };
  _fn = function(name, transform) {
    return exec("which " + name, function(error) {
      if (error == null) {
        return exports.notify = (function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return spawn(name, transform.apply(null, args));
        });
      }
    });
  };
  for (name in notifiers) {
    transform = notifiers[name];
    _fn(name, transform);
  }
  exports.log = function(text, color, isError) {
    var output, stream;
    if (color == null) {
      color = 'green';
    }
    if (isError == null) {
      isError = false;
    }
    stream = isError ? process.stderr : process.stdout;
    output = "" + (formatDate(color)) + " " + text + "\n";
    if (!exports.isTesting()) {
      stream.write(output, 'utf8');
    }
    if (isError) {
      return exports.notify('Brunch error', text);
    }
  };
  exports.logError = function(text) {
    return exports.log(text, 'red', true);
  };
  exports.logDebug = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, [formatDate('green')].concat(__slice.call(args)));
  };
  exports.exit = function() {
    if (exports.isTesting()) {
      return exports.logError('Terminated process');
    } else {
      return process.exit(0);
    }
  };
}).call(this);
