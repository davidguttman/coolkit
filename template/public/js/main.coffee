simplex = new SimplexNoise()

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
    p5.mouseMoved = @mouse_moved
    p5.mouseClicked = @mouse_clicked
    p5.mouseDragged = @mouse_dragged
    p5


class November extends Backbone.P5
  setup: ->
    @p5.size $(window).width(), $(window).height()
    @p5.background 30
    @p5.frameRate 1000
    
    @n_seeds = 200
    @seed_width = @p5.width / @n_seeds
    @noise_inc = 0.05
    @x_off_max = @seed_width*10
    @y_off_max =  @seed_width*10
    @seed_w = 1
    @seed_h = 1
    
  draw: ->
    milli = @p5.millis()
    
    @p5.fill 255, 5
    @p5.noStroke()

    for seed_i in [1..@n_seeds]
      x_noise_offset = 0 + (seed_i * @noise_inc) - milli/10000
      y_noise_offset = 20 + (seed_i * @noise_inc) + milli/10000
      
      xi = (seed_i * @seed_width) - (@seed_width/2)
      yi = (@p5.height - 100) - (milli/100)
      
      xo = (simplex.noise(x_noise_offset, 0)+1)/2 * @x_off_max
      yo = (simplex.noise(y_noise_offset, 0)+1)/2 * @y_off_max
      
      x = xi + xo
      y = yi + yo
      
      @p5.rect x, y, @seed_w, @seed_h
    

    
  mouse_moved: ->
    console.log "moved"
  

init = ->
  $('html').css 'overflow', 'hidden'
  
  nov = new November()
  
  $('#main').append nov.el
  
$(document).ready init