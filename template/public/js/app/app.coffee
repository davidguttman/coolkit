class window.App extends Backbone.P5
  setup: ->
    @p5.size $(window).width(), $(window).height()
  
  draw: ->
    
  mouseMoved: ->
    console.log "Mouse Moved: ", @p5.mouseX, @p5.mouseY
    
  mouseClicked: ->
    console.log "Mouse Clicked: ", @p5.mouseX, @p5.mouseY