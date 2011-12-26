(function() {
  var BackboneP5,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BackboneP5 = (function(_super) {

    __extends(BackboneP5, _super);

    function BackboneP5() {
      BackboneP5.__super__.constructor.apply(this, arguments);
    }

    BackboneP5.prototype.initialize = function() {
      _.bindAll(this);
      this.canvas = $('<canvas />');
      ($(this.el)).append(this.canvas);
      return new Processing(this.canvas[0], this.init_p5);
    };

    BackboneP5.prototype.init_p5 = function(p5) {
      this.link_methods(p5);
      return this.p5 = p5;
    };

    BackboneP5.prototype.link_methods = function(p5) {
      var self;
      p5.draw = this.draw;
      p5.setup = this.setup;
      p5.mouseMoved = this.mouseMoved;
      p5.mouseClicked = this.mouseClicked;
      p5.mouseDragged = this.mouseDragged;
      p5.keyPressed = this.keyPressed;
      p5.keyReleased = this.keyReleased;
      p5.keyTyped = this.keyTyped;
      self = this;
      _.each(p5, function(value, name) {
        if (_.isFunction(value)) {
          return self[name] = function() {
            return p5[name].apply(p5, arguments);
          };
        } else {
          return self[name] = function() {
            return p5[name];
          };
        }
      });
      return p5;
    };

    return BackboneP5;

  })(Backbone.View);

  if (window.BackboneShims == null) window.BackboneShims = {};

  BackboneShims.Processing = BackboneP5;

}).call(this);
