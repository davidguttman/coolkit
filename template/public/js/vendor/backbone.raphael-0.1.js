(function() {
  var Shim;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Shim = (function() {

    __extends(Shim, Backbone.View);

    function Shim() {
      Shim.__super__.constructor.apply(this, arguments);
    }

    Shim.prototype.initialize = function() {
      _.bindAll(this);
      this.rpaper = Raphael(this.el, 100, 100);
      return this.init_paper();
    };

    Shim.prototype.init_paper = function() {
      this.time_0 = new Date();
      this.frame_count = 0;
      $(this.el).click(this.mouse_pressed);
      this.setup();
      return this.animate();
    };

    Shim.prototype.animate = function() {
      var event;
      event = {};
      event.time = (new Date() - this.time_0) / 1000;
      this.frame_count += 1;
      event.frame_count = this.frame_count;
      requestAnimFrame(this.animate);
      return this.draw(event);
    };

    return Shim;

  })();

  Backbone.Raphael = Shim;

}).call(this);
