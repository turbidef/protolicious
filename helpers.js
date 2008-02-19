/**
 * @usage   $("myElement").contains(" some text... ");
 * @params  element HTMLElement
 * @params  content String text to match against
 * @return  Boolean true if element's innerHTML property matches with specified text
 *
 */
function contains(element, content) { 
  element = $(element);
  return !!element.innerHTML.stripTags().match(RegExp.escape(content))
}
Element.addMethods(contains);


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
function tokenize(req) {
  req.url = req.url + (req.url.indexOf('?') == -1 ? '?' : '&') + '_token=' + Date.now();
}
Ajax.Responders.register({onCreate: tokenize})


/**
 * Strip event handlers when removing an element
 *
 */
Element.addMethods({
  remove: Element.remove.wrap(function(proceed, element){
    element = $(element);
    [element].concat(element.descendants()).each(Element.stopObserving);
    return proceed(element);
  })
})


/**
 * Removes element from the document, returning it's HTML representation
 *
 */
function toTemplate(element) {
  if (!(element = $(element))) return null;
  return element.wrap().show().up().remove().innerHTML;
}
Element.addMethods(toTemplate)