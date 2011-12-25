(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.App = (function() {

    __extends(App, BackboneShims.Processing);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.setup = function() {
      this.size($(window).width(), $(window).height());
      return this.background(20);
    };

    App.prototype.draw = function() {};

    App.prototype.mouseMoved = function() {};

    App.prototype.mouseClicked = function() {};

    return App;

  })();

}).call(this);
