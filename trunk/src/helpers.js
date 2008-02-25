/**
 * @usage   $("myElement").contains(" some text... ");
 * @params  element HTMLElement
 * @params  content String text to match against
 * @return  Boolean true if element's innerHTML property matches with specified text
 *
 */
Element.Methods.contains = function(element, content) { 
  element = $(element);
  return !!element.innerHTML.stripTags().match(RegExp.escape(content))
}


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
 * Returns negated function
 * 
 * e.g. Find all hidden elements:
 * 
 * $$('*').findAll(function(element) { return !element.visible() }); // old way
 * $$('*').findAll(Element.visible.negate()); // using negate
 *
 */
Function.prototype.negate = function() {
  var f = this, args = $A(arguments);
  return function() {
    return !f.apply(f, args);
  }
}

/**
 * Calls and returns function
 *
 * myElement.toggle();
 * input.observe('change', myElement.toggle); // old way
 * 
 * input.observe('change', myElement.toggle.invoke()); // using invoke
 */
Function.prototype.invoke = function() {
  this.apply(this, $A(arguments)); return this;
}


/**
 * Preventing IE from caching Ajax requests
 *
 */
Ajax.Responders.register({
  onCreate: function(req) {
    req.url = req.url + (req.url.indexOf('?') == -1 ? '?' : '&') 
      + '_token=' + Date.now();
  }
})


/**
 * Strip event handlers when removing an element
 *
 */
Element.Methods.remove = Element.Methods.remove.wrap(
  function(proceed, element) {
    element = $(element);
    [element].concat(element.descendants()).each(Element.stopObserving);
    return proceed(element);
  }
)


/**
 * Removes element from the document, returning it's HTML representation
 *
 */
Element.Methods.toTemplate = function(element) {
  if (!(element = $(element))) return null;
  return element.wrap().show().up().remove().innerHTML;
}


/**
 * Are any of the form fields empty?
 *
 */
Field.Methods.isEmpty = function(element) {
  return $(element).getElements().any(Element.present);
}


/**
 * Little helper to change element's attribute given pattern and replacement (RegExp object)
 * Encapsulates verbose el.writeAttribute(attr, el.readAttribute(attr))
 *
 */ 
Element.Methods.replaceAttribute = function(element, attr, pattern, replacement) {
  element = $(element);
  return el.writeAttribute(attr, element.readAttribute(attr)
    .replace(new RegExp(pattern), replacement)
  )
}


/**
 * Replaces innerHTML of an element given pattern and replacement
 *
 */
Element.Methods.replaceHTML = function(element, pattern, replacement) {
  element = $(element);
  return element.update(
    element.innerHTML.replace(new RegExp(pattern), replacement)
  );
}


Element.Methods.toHTML = function(element) {
  element = $(element);
  try {
    var xmlSerializer = new XMLSerializer();
    return element.nodeType == 4
      ? element.nodeValue
      : xmlSerializer.serializeToString(element);
  } catch(e) {
    return element.xml 
      || element.outerHTML
      || element.cloneNode(true).wrap().innerHTML;
  }
}


(function(){
  Prototype.Q = {}
  for (var method in Element.methods) {
    Prototype.Q[method] = function(){ return Prototype.Q }
  }
  $ = $.wrap(function(){
    var args = $A(arguments), proceed = args.shift();
    return proceed.apply(proceed, args) || Prototype.Q;
  })
})()


/*

Label support in Safari 2

*/
document.observe('click', function(e) {
  var target = e.findElement('label[for]');
  if (!target) return;
  var input = $(target.readAttribute('for'));
  if (!input) return;
  input.focus();
  if (input.type && (/radio|checkbox/).test(input.type)) {
    input.click();
  }
})


/**
 * Boosts Field#present to work somewhat more reasonably 
 * with any form control (element with type attribute)
 * 
 * - "reset, submit, button and hidden" always return true
 * - "text, password and file" return true if value attribute is anything but whitespace
 * - "checkbox" return true if checked attribute is not false
 * - "radio" return true if either checked attribute is not false 
 *   or any of the input elements with the same name have checked attribute and it's not false
 * - "select" return true if selectedIndex attribute is not -1
 *
 */
Field.Methods.present = function(element) {
  if (!(element = $(element)) && !element.type) return;
  var t = element.type;
  return ((/text|password|file/.test(t) && !element.value.blank()) ||
    /reset|submit|button|hidden/.test(t) ||
    (t == 'checkbox' && element.checked) ||
    (t == 'radio' && (element.checked || $$('input[name=' + element.name + ']:checked').length))
    (/select-one|select-multiple/.test(t) && element.selectedIndex != -1));
}