if (Object.isUndefined(window.Proto)) { Proto = { } }

Proto.Cropper = Class.create({
  
  /* CONSTRUCTOR */
  
  initialize: function(element) {
    this.element = $(element);
    
    // building elements
    $w('clone overlay shim clip handle slider').each(function(component) {
      this[component] = this['_create' + component.capitalize()]();
    })
    
    this.delta = 0;
    this.clipOffset = 0;
    this.handleOffset = 0;
    
    this.elDimensions = this.element.getDimensions();
    
    this._wrap();
    
    this.clipDimensions = this.clip.getDimensions();
    
    this.sliderWidth = this.slider.getWidth() - 
      parseInt(this.slider.getStyle('borderRightWidth')) -
      parseInt(this.slider.getStyle('borderLeftWidth'));
    
    this.handleWidth = this.handle.getWidth();
    
    new DragHelper(this.clip);
    new DragHelper(this.handle);
    
    this._observeClip();
    this._observeHandle();
  },
  
  /* PRIVATE */
  
  _createClone: function() {
    return this.element.cloneNode(true)
      .relativize()
      .setStyle({top: 0, left: 0})
  },
  
  _createOverlay: function() {
    return new Element('div', {id: 'cropper-overlay'})
      .absolutize()
      .setStyle({
        opacity: 0.5,
        background: '#000',
        width: '100%',
        height: '100%'
      });
  },
  
  _createClip: function() {
    this.clone.removeAttribute('id');
    return new Element('div', {id: 'cropper-clip'})
      .absolutize()
      .setStyle({
        overflow: 'hidden',
        width: '30%',
        height: '50%'
      })
      .insert(this.clone)
      .insert(this.shim);
  },
  
  _createShim: function() {
    return new Element('div').absolutize()
    .setStyle({
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      cursor: 'all-scroll'
    })
  },
  
  _createHandle: function() {
    return new Element('div', {id: 'cropper-handle'})
      .absolutize()
      .setStyle({
        height: '10px',
        width: '20px',
        left: 0,
        background: '#000'
      })
  },
  
  _createSlider: function() {
    return new Element('div', {id: 'cropper-slider'})
      .absolutize()
      .setStyle({
        bottom: '-20px',
        top: '',
        left: 0,
        width: '100%',
        height: '10px',
        background: '#eee',
        border: '1px solid #aaa'
      })
      .insert(this.handle)
  },
  
  _wrap: function() {
    this.element
      .wrap({id: 'cropper-wrapper', style: 'border: 1px solid #666'})
      .setStyle({
        width: this.elDimensions.width + 'px',
        height: this.elDimensions.height + 'px'
      })
      .relativize()
      .insert(this.overlay)
      .insert(this.clip)
      .insert(this.slider)
  },
  
  _observeClip: function() {
    this.clip.observe('drag:started', function(e) {
      this.clipOffset = {
        top: parseInt(this.clip.style.top),
        left: parseInt(this.clip.style.left)
      }
    }.bind(this))
    
    this.clip.observe('drag:updated', function(e) {
      this.position(e.memo.dragY + this.clipOffset.top, e.memo.dragX + this.clipOffset.left);
    }.bind(this));
  },
  
  _observeHandle: function() {
    this.handle.observe('drag:started', function(e) {
      this.handleOffset = parseInt(this.handle.style.left);
    }.bind(this))
    
    this.handle.observe('drag:updated', function(e) {
      var value = Math.min(Math.max((e.memo.dragX + this.handleOffset), 0),
        this.sliderWidth - this.handleWidth);
      this.handle.style.left = value + 'px';
      this.zoom(value * 100 / (this.sliderWidth - this.handleWidth));
    }.bind(this))
  },

  /* PUBLIC */
  
  position: function(top, left) {
    // normalize top/left
    top = Math.max(Math.min(top, this.elDimensions.height - 
      this.clipDimensions.height - this.delta), 0 + this.delta);
    left = Math.max(Math.min(left, this.elDimensions.width - 
      this.clipDimensions.width - this.delta), 0 + this.delta);
    
    this.clip.style.top = top + 'px';
    this.clip.style.left = left + 'px';
    this.clone.style.top = -top + 'px';
    this.clone.style.left = -left + 'px';
  },
  
  zoom: function(value) {
    console.log(value);
  }
})