class Backbone.P5 extends Backbone.View
  initialize: ->
    _.bindAll this
    
    @canvas = $('<canvas />')
    ($ @el).append @canvas
    
    new Processing @canvas[0], @init_p5
  
  init_p5: (p5) ->
    @link_methods p5
    @p5 = p5

  link_methods: (p5) ->
    p5.setup = @setup
    p5.draw = @draw
    p5.mouseMoved = @mouseMoved
    p5.mouseClicked = @mouseClicked
    p5.mouseDragged = @mouseDragged
    p5
    
