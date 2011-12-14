(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Backbone.P5 = (function() {

    __extends(P5, Backbone.View);

    function P5() {
      P5.__super__.constructor.apply(this, arguments);
    }

    P5.prototype.initialize = function() {
      _.bindAll(this);
      this.canvas = $('<canvas />');
      ($(this.el)).append(this.canvas);
      return new Processing(this.canvas[0], this.init_p5);
    };

    P5.prototype.init_p5 = function(p5) {
      this.link_methods(p5);
      return this.p5 = p5;
    };

    P5.prototype.link_methods = function(p5) {
      p5.setup = this.setup;
      p5.draw = this.draw;
      p5.mouseMoved = this.mouseMoved;
      p5.mouseClicked = this.mouseClicked;
      p5.mouseDragged = this.mouseDragged;
      return p5;
    };

    return P5;

  })();

}).call(this);
