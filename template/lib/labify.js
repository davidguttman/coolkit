(function() {
  var fs, labify, _;

  _ = require('underscore');

  fs = require('fs');

  labify = function(js_dir, config) {
    var file_list, file_prefix, files, js_prefix, load_path, loader;
    js_prefix = '/js/';
    file_prefix = js_prefix + ("" + js_dir + "/");
    load_path = __dirname + '/../public' + file_prefix;
    loader = '';
    file_list = _.filter(fs.readdirSync(load_path), function(filename) {
      return filename.match(/\.js$/);
    });
    files = _.map(file_list, function(filename) {
      var regex;
      regex = new RegExp("^.*" + ('public' + file_prefix));
      filename = filename.replace(regex, '');
      return filename;
    });
    if (config != null) {
      if (config.noload != null) {
        files = _.filter(files, function(filename) {
          return !_.detect(config.noload, function(no_load_filename) {
            return no_load_filename === filename;
          });
        });
      }
      if (config.order != null) {
        _.each(config.order, function(filename) {
          return loader += ".script('" + file_prefix + filename + "').wait()";
        });
        files = _.filter(files, function(filename) {
          return !_.detect(config.order, function(order_filename) {
            return order_filename === filename;
          });
        });
      }
    }
    _.each(files, function(filename) {
      return loader += ".script('" + file_prefix + filename + "')";
    });
    return loader += '.wait()';
  };

  exports.labify = labify;

}).call(this);
