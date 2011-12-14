(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.App = (function() {

    __extends(App, Backbone.P5);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.setup = function() {
      return this.p5.size($(window).width(), $(window).height());
    };

    App.prototype.draw = function() {};

    App.prototype.mouseMoved = function() {
      return console.log("Mouse Moved: ", this.p5.mouseX, this.p5.mouseY);
    };

    App.prototype.mouseClicked = function() {
      return console.log("Mouse Clicked: ", this.p5.mouseX, this.p5.mouseY);
    };

    return App;

  })();

}).call(this);
