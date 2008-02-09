(function() {
  var rules = { };
  var eventManager = function(event) {
    var element = event.target;
    do {
      if (element.nodeType == 1) {
        element = Element.extend(element);
        for (var selector in rules[event.type]) {
          if (matches(rules[event.type][selector]._selector, element)) {
            for (var j=0, handlers=rules[event.type][selector], lj=handlers.length; j<lj; ++j) {
              handlers[j].call(element, Object.extend(Object.clone(event), { target: element }));
            }
          }
        }
      }
    } while (element = element.parentNode)
    event.stop();
  }
  var matches = function(selectors, element) {
    for (var i=0, l=selectors.length; i<l; ++i) {
      if (selectors[i].match(element)) return true;
    }
    return false;
  }
  Event.register = function(selector, eventName, handler) {
    // observe event only once
    if (!rules[eventName]) {
      rules[eventName] = { };
      document.observe(eventName, eventManager);
    }    
    var _selector = [ ], expr = selector.strip();
    // instantiate Selector's
    Selector.split(selector).each(function(s) { _selector.push(new Selector(s)) })
    // store instantiated Selector for faster matching
    if (!rules[eventName][expr]) {
      rules[eventName][expr] = Object.extend([ ], { _selector: _selector });
    }
    // associate handler with expression
    rules[eventName][expr].push(handler);
  }
  Event.unregister = function(selector, eventName) {
    if (eventName) {
      rules[eventName][selector] = null;
      delete rules[eventName][selector];
    } 
    else {
      for (var eventName in rules) {
        selector ? rules[eventName][selector] : rules[eventName] = null;
        delete (selector ? rules[eventName][selector] : rules[eventName]);
      }
    }
  }
  Event.observe(window, 'unload', Event.unregister.curry(null, null));
})();