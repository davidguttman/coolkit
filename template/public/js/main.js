(function() {
  $(document).ready(function() {
    var app;
    app = new App();
    return $('#main').append(app.el);
  });
}).call(this);
