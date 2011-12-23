class window.App extends BackboneShims.Processing
  setup: ->
    @size $(window).width(), $(window).height()
    @background 0
  
  draw: ->
    
  mouseMoved: ->
    console.log "Mouse Moved: ", @mouseX(), @mouseY()
    
  mouseClicked: ->
    console.log "Mouse Clicked: ", @mouseX(), @mouseY()