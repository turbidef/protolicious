/**
 *  Simplified version of a UI.DragHelper
 *  http://svn.prototype-ui.com/public/prototype-ui/trunk/src/util/drag.js
 *
 */
DragHelper = Class.create({
  initialize: function(element) {
    this.element = $(element);
    $w(' mousedown mousemove mouseup ').each(function(eventName) {
      this[eventName + 'Event'] = this['on' + eventName.capitalize()].bind(this);
    }, this);
    this.element.observe("mousedown", this.mousedownEvent);
  },
  
  onMousedown: function(event) {
    var target = event.findElement('body *');
    if (!target) return;
    this.dragged = target;
    Object.extend(this, event.pointer());
    document
      .observe("mousemove", this.mousemoveEvent)
      .observe("mouseup",   this.mouseupEvent);
  },

  onMousemove: function(event) {
    event.stop();
    if (!this.dragging)
      return this.startDrag(event);
    this.fire('drag:updated', event);
  },

  onMouseup: function(event) {
    document.stopObserving("mousemove", this.mousemoveEvent)
            .stopObserving("mouseup", this.mouseupEvent);
    if (!this.dragging) return;
    event.stop();
    this.endDrag(event);
  },

  startDrag: function(event) {
    this.savedCallbacks = DragHelper.eventsToStop.inject({ }, function(save, name) {
      save[name] = document.body[name];
      document.body[name] = Prototype.falseFunction;
      return save;
    });
    this.dragging = true;
    this.fire('drag:started', event);
  },

  endDrag: function(event) {
    this.dragging = false;
    this.fire('drag:ended', event);
  },

  fire: function(eventName, event) {
    var pointer = event.pointer();
    this.dragged.fire(eventName, {
      dragX: pointer.x - this.x,
      dragY: pointer.y - this.y,
      mouseEvent: event
    });
  }
});

DragHelper.eventsToStop = $w(' ondrag onselectstart ');