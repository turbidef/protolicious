if (Object.isUndefined(window.Proto)) { Proto = { } }

Proto.Cropper = Class.create({
  
  /* CONSTRUCTOR */
  
  initialize: function(element) {
    this.element = $(element);
    
    // building elements
    $w('clone overlay shim clip handle slider').each(function(component) {
      this[component] = this['_create' + component.capitalize()]();
    }, this);
    
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
    
    this.center();
  },
  
  /* PRIVATE */
  
  _createClone: function() {
    return this.element.cloneNode(true).addClassName('cropper-clone')
  },
  
  _createOverlay: function() {
    return new Element('div', {className: 'cropper-overlay'})
      .absolutize()
      .setStyle({
        width: '100%', 
        height: '100%',
        opacity: 0.5
      })
  },
  
  _createClip: function() {
    this.clone.removeAttribute('id');
    return new Element('div', {className: 'cropper-clip'})
      .insert(this.clone)
      .insert(this.shim);
  },
  
  _createShim: function() {
    return new Element('div', {className: 'cropper-shim'})
  },
  
  _createHandle: function() {
    return new Element('div', {className: 'cropper-handle'})
  },
  
  _createSlider: function() {
    return new Element('div', {className: 'cropper-slider'})
      .insert(this.handle)
  },
  
  _wrap: function() {
    this.element
      .wrap({className: 'cropper-wrapper'})
      .setStyle({
        width: this.elDimensions.width + 'px',
        height: this.elDimensions.height + 'px',
        position: 'relative'
      })
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
      this.handleOffset = parseInt(this.handle.style.left || this.handle.getStyle('left'));
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
  
  moveBy: function(top, left) {
    this.clip.style.top = parseInt(this.clip.style.top) + top + 'px';
    this.clip.style.left = parseInt(this.clip.style.left) + left + 'px';
    this.clone.style.top = parseInt(this.clone.style.top) - top + 'px';
    this.clone.style.left = parseInt(this.clone.style.left) - left + 'px';
  },
  
  center: function() {
    var top = (this.elDimensions.height - this.clipDimensions.height) / 2,
        left = (this.elDimensions.width - this.clipDimensions.width) / 2;
    this.position(top, left);
  },
  
  zoom: function(value) {
    var width = Math.min((this.clipDimensions.width + value), this.elDimensions.width),
        height = Math.min((this.clipDimensions.height + value), this.elDimensions.height);
    this.moveBy(-value/2, -value/2);
    this.clipDimensions.width = width;
    this.clipDimensions.height = height;
    this.clip.style.width = width + 'px';
    this.clip.style.height = height + 'px';
  }
})