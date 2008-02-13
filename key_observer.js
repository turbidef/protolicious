/*

Example:

document.observe('key:esc', helpWindow.close);
document.observe('key:space', focusNextField);

Notes:
tab event is NOT working (apparently due to keyup)

*/
 
(function() {
  var hash = { 32: 'space', 19: 'pause' };
  for (var prop in Event) {
    if (prop.startsWith('KEY_'))
      hash[Event[prop]] = prop.replace('KEY_', '').toLowerCase();
  }
  document.observe('keyup', function(e) {
    if (!hash[e.keyCode]) return;
    document.fire('key:' + hash[e.keyCode], e);
  })
})();

