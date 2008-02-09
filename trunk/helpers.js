/**
 * @usage   $("myElement").contains(" some text... ");
 * @params  element HTMLElement
 * @params  content String text to match against
 * @return  Boolean true if element's innerHTML property matches with specified text
 *
 */
Element.addMethods({
  contains: function(element, content) { 
    element = $(element);
    return !!element.innerHTML.stripTags().match(RegExp.escape(content))
  }
})

/**
 * @usage   $w(" MyApp util Dom ").namespace(Prototype); //=> Prototype.MyApp.util.Dom
 * @params  arguments[0] Root object to begin nesting with
 * @return  
 *
 */
Array.prototype.namespace = function() {
  this.inject(arguments[0] || window, function(object, property) {
    return object[property] = object[property] || { };
  })
}

/**
 * Preventing IE from caching Ajax requests
 *
 */
Ajax.Responders.register ({
  onCreate: function(req) {
    req.url = req.url + (req.url.indexOf('?') == -1 ? '?' : '&') + '_token=' + Date.now();
  }
})