/* Readable DOM compatibility source. The site build bundles this with core-js. */
(function () {
  if (typeof document === 'undefined' || typeof Element === 'undefined') return;

  function fragmentFor(nodes) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < nodes.length; i++) {
      var value = nodes[i];
      fragment.appendChild(value instanceof Node ? value : document.createTextNode(String(value)));
    }
    return fragment;
  }
  function define(prototype, name, implementation) {
    if (prototype && !prototype[name]) {
      Object.defineProperty(prototype, name, {configurable: true, writable: true, value: implementation});
    }
  }
  var parents = [Element.prototype, Document.prototype, DocumentFragment.prototype];
  for (var i = 0; i < parents.length; i++) {
    define(parents[i], 'append', function () { this.appendChild(fragmentFor(arguments)); });
    define(parents[i], 'prepend', function () { this.insertBefore(fragmentFor(arguments), this.firstChild); });
    define(parents[i], 'replaceChildren', function () {
      // Build the fragment first: existing children may also be among the replacements.
      var fragment = fragmentFor(arguments);
      while (this.firstChild) this.removeChild(this.firstChild);
      this.appendChild(fragment);
    });
  }
  var children = [Element.prototype, CharacterData.prototype, DocumentType.prototype];
  for (var j = 0; j < children.length; j++) {
    define(children[j], 'replaceWith', function () {
      var parent = this.parentNode;
      if (!parent) return;
      var next = this.nextSibling;
      while (next && Array.prototype.indexOf.call(arguments, next) !== -1) next = next.nextSibling;
      var fragment = fragmentFor(arguments);
      if (this.parentNode === parent) parent.replaceChild(fragment, this);
      else parent.insertBefore(fragment, next);
    });
    define(children[j], 'remove', function () { if (this.parentNode) this.parentNode.removeChild(this); });
  }

  // Old focus() accepts no dictionary and may silently scroll instead of throwing.
  // Probe the option getter; when it is ignored, restore each scroll container.
  var nativeFocus = HTMLElement.prototype.focus, preventScrollSupported = false;
  try {
    var probe = Object.defineProperty({}, 'preventScroll', {get: function () { preventScrollSupported = true; }});
    nativeFocus.call(document.createElement('button'), probe);
  } catch (ignored) { /* The fallback below also handles engines that reject options. */ }
  if (!preventScrollSupported) {
    HTMLElement.prototype.focus = function (options) {
      if (!options || !options.preventScroll) return nativeFocus.call(this);
      var positions = [], parent = this.parentElement;
      while (parent) {
        positions.push([parent, parent.scrollLeft, parent.scrollTop]);
        parent = parent.parentElement;
      }
      var left = window.pageXOffset, top = window.pageYOffset;
      nativeFocus.call(this);
      for (var k = 0; k < positions.length; k++) {
        positions[k][0].scrollLeft = positions[k][1];
        positions[k][0].scrollTop = positions[k][2];
      }
      window.scrollTo(left, top);
    };
  }
})();
