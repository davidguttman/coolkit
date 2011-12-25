class window.App extends BackboneShims.Processing
  setup: ->
    @size $(window).width(), $(window).height()
    @background 20
  
  draw: ->
    # @fill 255
    # @rect @width()/2, @height()/2, 50, 50
    
  mouseMoved: ->
    # console.log "Mouse Moved: ", @mouseX(), @mouseY()
    
  mouseClicked: ->
    # console.log "Mouse Clicked: ", @mouseX(), @mouseY()