Event.simulate = function(element, eventName) {
  var oEvent, options = Object.extend({
    pointerX: 0,
    pointerY: 0,
  	button:  0,
  	ctrlKey:  false,
  	altKey:   false,
  	shiftKey: false,
  	metaKey: false,
  	bubbles: true,
  	cancelable: true
  }, arguments[2] || { } );

  if (document.createEvent) {
		oEvent = document.createEvent("MouseEvents");
		oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
	  	options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
	  	options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, $(element));
		$(element).dispatchEvent(oEvent);
  }
  else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		oEvent = Object.extend(document.createEventObject(), options);
		$(element).fireEvent('on' + eventName, oEvent);
  }
}