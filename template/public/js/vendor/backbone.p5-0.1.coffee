class BackboneP5 extends Backbone.View
  initialize: ->
    _.bindAll this
    
    @canvas = $('<canvas />')
    ($ @el).append @canvas
    
    new Processing @canvas[0], @init_p5
  
  init_p5: (p5) ->
    @link_methods p5
    @p5 = p5

  link_methods: (p5) ->
    p5.draw = @draw

    p5.setup = @setup

    p5.mouseMoved = @mouseMoved
    p5.mouseClicked = @mouseClicked
    p5.mouseDragged = @mouseDragged
    
    p5.keyPressed = @keyPressed
    p5.keyReleased = @keyReleased
    p5.keyTyped = @keyTyped
    
    self = this
    
    _.each p5, (value, name) ->
      if _.isFunction value
        self[name] = ->
          p5[name] arguments...
      else
        self[name] = ->
          p5[name]
      
    
    p5

window.BackboneShims ?= {}
BackboneShims.Processing = BackboneP5