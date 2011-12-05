(function() {
  var November, init, simplex;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  simplex = new SimplexNoise();
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
      p5.mouseMoved = this.mouse_moved;
      p5.mouseClicked = this.mouse_clicked;
      p5.mouseDragged = this.mouse_dragged;
      return p5;
    };
    return P5;
  })();
  November = (function() {
    __extends(November, Backbone.P5);
    function November() {
      November.__super__.constructor.apply(this, arguments);
    }
    November.prototype.setup = function() {
      this.p5.size($(window).width(), $(window).height());
      this.p5.background(30);
      this.p5.frameRate(1000);
      this.n_seeds = 200;
      this.seed_width = this.p5.width / this.n_seeds;
      this.noise_inc = 0.05;
      this.x_off_max = this.seed_width * 10;
      this.y_off_max = this.seed_width * 10;
      this.seed_w = 1;
      return this.seed_h = 1;
    };
    November.prototype.draw = function() {
      var milli, seed_i, x, x_noise_offset, xi, xo, y, y_noise_offset, yi, yo, _ref, _results;
      milli = this.p5.millis();
      this.p5.fill(255, 5);
      this.p5.noStroke();
      _results = [];
      for (seed_i = 1, _ref = this.n_seeds; 1 <= _ref ? seed_i <= _ref : seed_i >= _ref; 1 <= _ref ? seed_i++ : seed_i--) {
        x_noise_offset = 0 + (seed_i * this.noise_inc) - milli / 10000;
        y_noise_offset = 20 + (seed_i * this.noise_inc) + milli / 10000;
        xi = (seed_i * this.seed_width) - (this.seed_width / 2);
        yi = (this.p5.height - 100) - (milli / 100);
        xo = (simplex.noise(x_noise_offset, 0) + 1) / 2 * this.x_off_max;
        yo = (simplex.noise(y_noise_offset, 0) + 1) / 2 * this.y_off_max;
        x = xi + xo;
        y = yi + yo;
        _results.push(this.p5.rect(x, y, this.seed_w, this.seed_h));
      }
      return _results;
    };
    November.prototype.mouse_moved = function() {
      return console.log("moved");
    };
    return November;
  })();
  init = function() {
    var nov;
    $('html').css('overflow', 'hidden');
    nov = new November();
    return $('#main').append(nov.el);
  };
  $(document).ready(init);
}).call(this);
