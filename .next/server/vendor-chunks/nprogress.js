/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nprogress";
exports.ids = ["vendor-chunks/nprogress"];
exports.modules = {

/***/ "(ssr)/./node_modules/nprogress/nprogress.js":
/*!*********************************************!*\
  !*** ./node_modules/nprogress/nprogress.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress\n * @license MIT */\n\n;(function(root, factory) {\n\n  if (true) {\n    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else {}\n\n})(this, function() {\n  var NProgress = {};\n\n  NProgress.version = '0.2.0';\n\n  var Settings = NProgress.settings = {\n    minimum: 0.08,\n    easing: 'ease',\n    positionUsing: '',\n    speed: 200,\n    trickle: true,\n    trickleRate: 0.02,\n    trickleSpeed: 800,\n    showSpinner: true,\n    barSelector: '[role=\"bar\"]',\n    spinnerSelector: '[role=\"spinner\"]',\n    parent: 'body',\n    template: '<div class=\"bar\" role=\"bar\"><div class=\"peg\"></div></div><div class=\"spinner\" role=\"spinner\"><div class=\"spinner-icon\"></div></div>'\n  };\n\n  /**\n   * Updates configuration.\n   *\n   *     NProgress.configure({\n   *       minimum: 0.1\n   *     });\n   */\n  NProgress.configure = function(options) {\n    var key, value;\n    for (key in options) {\n      value = options[key];\n      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;\n    }\n\n    return this;\n  };\n\n  /**\n   * Last number.\n   */\n\n  NProgress.status = null;\n\n  /**\n   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.\n   *\n   *     NProgress.set(0.4);\n   *     NProgress.set(1.0);\n   */\n\n  NProgress.set = function(n) {\n    var started = NProgress.isStarted();\n\n    n = clamp(n, Settings.minimum, 1);\n    NProgress.status = (n === 1 ? null : n);\n\n    var progress = NProgress.render(!started),\n        bar      = progress.querySelector(Settings.barSelector),\n        speed    = Settings.speed,\n        ease     = Settings.easing;\n\n    progress.offsetWidth; /* Repaint */\n\n    queue(function(next) {\n      // Set positionUsing if it hasn't already been set\n      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();\n\n      // Add transition\n      css(bar, barPositionCSS(n, speed, ease));\n\n      if (n === 1) {\n        // Fade out\n        css(progress, { \n          transition: 'none', \n          opacity: 1 \n        });\n        progress.offsetWidth; /* Repaint */\n\n        setTimeout(function() {\n          css(progress, { \n            transition: 'all ' + speed + 'ms linear', \n            opacity: 0 \n          });\n          setTimeout(function() {\n            NProgress.remove();\n            next();\n          }, speed);\n        }, speed);\n      } else {\n        setTimeout(next, speed);\n      }\n    });\n\n    return this;\n  };\n\n  NProgress.isStarted = function() {\n    return typeof NProgress.status === 'number';\n  };\n\n  /**\n   * Shows the progress bar.\n   * This is the same as setting the status to 0%, except that it doesn't go backwards.\n   *\n   *     NProgress.start();\n   *\n   */\n  NProgress.start = function() {\n    if (!NProgress.status) NProgress.set(0);\n\n    var work = function() {\n      setTimeout(function() {\n        if (!NProgress.status) return;\n        NProgress.trickle();\n        work();\n      }, Settings.trickleSpeed);\n    };\n\n    if (Settings.trickle) work();\n\n    return this;\n  };\n\n  /**\n   * Hides the progress bar.\n   * This is the *sort of* the same as setting the status to 100%, with the\n   * difference being `done()` makes some placebo effect of some realistic motion.\n   *\n   *     NProgress.done();\n   *\n   * If `true` is passed, it will show the progress bar even if its hidden.\n   *\n   *     NProgress.done(true);\n   */\n\n  NProgress.done = function(force) {\n    if (!force && !NProgress.status) return this;\n\n    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);\n  };\n\n  /**\n   * Increments by a random amount.\n   */\n\n  NProgress.inc = function(amount) {\n    var n = NProgress.status;\n\n    if (!n) {\n      return NProgress.start();\n    } else {\n      if (typeof amount !== 'number') {\n        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);\n      }\n\n      n = clamp(n + amount, 0, 0.994);\n      return NProgress.set(n);\n    }\n  };\n\n  NProgress.trickle = function() {\n    return NProgress.inc(Math.random() * Settings.trickleRate);\n  };\n\n  /**\n   * Waits for all supplied jQuery promises and\n   * increases the progress as the promises resolve.\n   *\n   * @param $promise jQUery Promise\n   */\n  (function() {\n    var initial = 0, current = 0;\n\n    NProgress.promise = function($promise) {\n      if (!$promise || $promise.state() === \"resolved\") {\n        return this;\n      }\n\n      if (current === 0) {\n        NProgress.start();\n      }\n\n      initial++;\n      current++;\n\n      $promise.always(function() {\n        current--;\n        if (current === 0) {\n            initial = 0;\n            NProgress.done();\n        } else {\n            NProgress.set((initial - current) / initial);\n        }\n      });\n\n      return this;\n    };\n\n  })();\n\n  /**\n   * (Internal) renders the progress bar markup based on the `template`\n   * setting.\n   */\n\n  NProgress.render = function(fromStart) {\n    if (NProgress.isRendered()) return document.getElementById('nprogress');\n\n    addClass(document.documentElement, 'nprogress-busy');\n    \n    var progress = document.createElement('div');\n    progress.id = 'nprogress';\n    progress.innerHTML = Settings.template;\n\n    var bar      = progress.querySelector(Settings.barSelector),\n        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),\n        parent   = document.querySelector(Settings.parent),\n        spinner;\n    \n    css(bar, {\n      transition: 'all 0 linear',\n      transform: 'translate3d(' + perc + '%,0,0)'\n    });\n\n    if (!Settings.showSpinner) {\n      spinner = progress.querySelector(Settings.spinnerSelector);\n      spinner && removeElement(spinner);\n    }\n\n    if (parent != document.body) {\n      addClass(parent, 'nprogress-custom-parent');\n    }\n\n    parent.appendChild(progress);\n    return progress;\n  };\n\n  /**\n   * Removes the element. Opposite of render().\n   */\n\n  NProgress.remove = function() {\n    removeClass(document.documentElement, 'nprogress-busy');\n    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');\n    var progress = document.getElementById('nprogress');\n    progress && removeElement(progress);\n  };\n\n  /**\n   * Checks if the progress bar is rendered.\n   */\n\n  NProgress.isRendered = function() {\n    return !!document.getElementById('nprogress');\n  };\n\n  /**\n   * Determine which positioning CSS rule to use.\n   */\n\n  NProgress.getPositioningCSS = function() {\n    // Sniff on document.body.style\n    var bodyStyle = document.body.style;\n\n    // Sniff prefixes\n    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :\n                       ('MozTransform' in bodyStyle) ? 'Moz' :\n                       ('msTransform' in bodyStyle) ? 'ms' :\n                       ('OTransform' in bodyStyle) ? 'O' : '';\n\n    if (vendorPrefix + 'Perspective' in bodyStyle) {\n      // Modern browsers with 3D support, e.g. Webkit, IE10\n      return 'translate3d';\n    } else if (vendorPrefix + 'Transform' in bodyStyle) {\n      // Browsers without 3D support, e.g. IE9\n      return 'translate';\n    } else {\n      // Browsers without translate() support, e.g. IE7-8\n      return 'margin';\n    }\n  };\n\n  /**\n   * Helpers\n   */\n\n  function clamp(n, min, max) {\n    if (n < min) return min;\n    if (n > max) return max;\n    return n;\n  }\n\n  /**\n   * (Internal) converts a percentage (`0..1`) to a bar translateX\n   * percentage (`-100%..0%`).\n   */\n\n  function toBarPerc(n) {\n    return (-1 + n) * 100;\n  }\n\n\n  /**\n   * (Internal) returns the correct CSS for changing the bar's\n   * position given an n percentage, and speed and ease from Settings\n   */\n\n  function barPositionCSS(n, speed, ease) {\n    var barCSS;\n\n    if (Settings.positionUsing === 'translate3d') {\n      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };\n    } else if (Settings.positionUsing === 'translate') {\n      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };\n    } else {\n      barCSS = { 'margin-left': toBarPerc(n)+'%' };\n    }\n\n    barCSS.transition = 'all '+speed+'ms '+ease;\n\n    return barCSS;\n  }\n\n  /**\n   * (Internal) Queues a function to be executed.\n   */\n\n  var queue = (function() {\n    var pending = [];\n    \n    function next() {\n      var fn = pending.shift();\n      if (fn) {\n        fn(next);\n      }\n    }\n\n    return function(fn) {\n      pending.push(fn);\n      if (pending.length == 1) next();\n    };\n  })();\n\n  /**\n   * (Internal) Applies css properties to an element, similar to the jQuery \n   * css method.\n   *\n   * While this helper does assist with vendor prefixed property names, it \n   * does not perform any manipulation of values prior to setting styles.\n   */\n\n  var css = (function() {\n    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],\n        cssProps    = {};\n\n    function camelCase(string) {\n      return string.replace(/^-ms-/, 'ms-').replace(/-([\\da-z])/gi, function(match, letter) {\n        return letter.toUpperCase();\n      });\n    }\n\n    function getVendorProp(name) {\n      var style = document.body.style;\n      if (name in style) return name;\n\n      var i = cssPrefixes.length,\n          capName = name.charAt(0).toUpperCase() + name.slice(1),\n          vendorName;\n      while (i--) {\n        vendorName = cssPrefixes[i] + capName;\n        if (vendorName in style) return vendorName;\n      }\n\n      return name;\n    }\n\n    function getStyleProp(name) {\n      name = camelCase(name);\n      return cssProps[name] || (cssProps[name] = getVendorProp(name));\n    }\n\n    function applyCss(element, prop, value) {\n      prop = getStyleProp(prop);\n      element.style[prop] = value;\n    }\n\n    return function(element, properties) {\n      var args = arguments,\n          prop, \n          value;\n\n      if (args.length == 2) {\n        for (prop in properties) {\n          value = properties[prop];\n          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);\n        }\n      } else {\n        applyCss(element, args[1], args[2]);\n      }\n    }\n  })();\n\n  /**\n   * (Internal) Determines if an element or space separated list of class names contains a class name.\n   */\n\n  function hasClass(element, name) {\n    var list = typeof element == 'string' ? element : classList(element);\n    return list.indexOf(' ' + name + ' ') >= 0;\n  }\n\n  /**\n   * (Internal) Adds a class to an element.\n   */\n\n  function addClass(element, name) {\n    var oldList = classList(element),\n        newList = oldList + name;\n\n    if (hasClass(oldList, name)) return; \n\n    // Trim the opening space.\n    element.className = newList.substring(1);\n  }\n\n  /**\n   * (Internal) Removes a class from an element.\n   */\n\n  function removeClass(element, name) {\n    var oldList = classList(element),\n        newList;\n\n    if (!hasClass(element, name)) return;\n\n    // Replace the class name.\n    newList = oldList.replace(' ' + name + ' ', ' ');\n\n    // Trim the opening and closing spaces.\n    element.className = newList.substring(1, newList.length - 1);\n  }\n\n  /**\n   * (Internal) Gets a space separated list of the class names on the element. \n   * The list is wrapped with a single space on each end to facilitate finding \n   * matches within the list.\n   */\n\n  function classList(element) {\n    return (' ' + (element.className || '') + ' ').replace(/\\s+/gi, ' ');\n  }\n\n  /**\n   * (Internal) Removes an element from the DOM.\n   */\n\n  function removeElement(element) {\n    element && element.parentNode && element.parentNode.removeChild(element);\n  }\n\n  return NProgress;\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbnByb2dyZXNzL25wcm9ncmVzcy5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBOztBQUVBLENBQUM7O0FBRUQsTUFBTSxJQUEwQztBQUNoRCxJQUFJLG9DQUFPLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUNuQixJQUFJLEtBQUssRUFJTjs7QUFFSCxDQUFDO0FBQ0Q7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQixNQUFNO0FBQ04saUJBQWlCO0FBQ2pCLE1BQU07QUFDTixpQkFBaUI7QUFDakI7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL215LWFwcC8uL25vZGVfbW9kdWxlcy9ucHJvZ3Jlc3MvbnByb2dyZXNzLmpzPzI0YzIiXSwic291cmNlc0NvbnRlbnQiOlsiLyogTlByb2dyZXNzLCAoYykgMjAxMywgMjAxNCBSaWNvIFN0YS4gQ3J1eiAtIGh0dHA6Ly9yaWNvc3RhY3J1ei5jb20vbnByb2dyZXNzXG4gKiBAbGljZW5zZSBNSVQgKi9cblxuOyhmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICByb290Lk5Qcm9ncmVzcyA9IGZhY3RvcnkoKTtcbiAgfVxuXG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgdmFyIE5Qcm9ncmVzcyA9IHt9O1xuXG4gIE5Qcm9ncmVzcy52ZXJzaW9uID0gJzAuMi4wJztcblxuICB2YXIgU2V0dGluZ3MgPSBOUHJvZ3Jlc3Muc2V0dGluZ3MgPSB7XG4gICAgbWluaW11bTogMC4wOCxcbiAgICBlYXNpbmc6ICdlYXNlJyxcbiAgICBwb3NpdGlvblVzaW5nOiAnJyxcbiAgICBzcGVlZDogMjAwLFxuICAgIHRyaWNrbGU6IHRydWUsXG4gICAgdHJpY2tsZVJhdGU6IDAuMDIsXG4gICAgdHJpY2tsZVNwZWVkOiA4MDAsXG4gICAgc2hvd1NwaW5uZXI6IHRydWUsXG4gICAgYmFyU2VsZWN0b3I6ICdbcm9sZT1cImJhclwiXScsXG4gICAgc3Bpbm5lclNlbGVjdG9yOiAnW3JvbGU9XCJzcGlubmVyXCJdJyxcbiAgICBwYXJlbnQ6ICdib2R5JyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJiYXJcIiByb2xlPVwiYmFyXCI+PGRpdiBjbGFzcz1cInBlZ1wiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJzcGlubmVyXCIgcm9sZT1cInNwaW5uZXJcIj48ZGl2IGNsYXNzPVwic3Bpbm5lci1pY29uXCI+PC9kaXY+PC9kaXY+J1xuICB9O1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqICAgICBOUHJvZ3Jlc3MuY29uZmlndXJlKHtcbiAgICogICAgICAgbWluaW11bTogMC4xXG4gICAqICAgICB9KTtcbiAgICovXG4gIE5Qcm9ncmVzcy5jb25maWd1cmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGtleSwgdmFsdWU7XG4gICAgZm9yIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIFNldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogTGFzdCBudW1iZXIuXG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5zdGF0dXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwcm9ncmVzcyBiYXIgc3RhdHVzLCB3aGVyZSBgbmAgaXMgYSBudW1iZXIgZnJvbSBgMC4wYCB0byBgMS4wYC5cbiAgICpcbiAgICogICAgIE5Qcm9ncmVzcy5zZXQoMC40KTtcbiAgICogICAgIE5Qcm9ncmVzcy5zZXQoMS4wKTtcbiAgICovXG5cbiAgTlByb2dyZXNzLnNldCA9IGZ1bmN0aW9uKG4pIHtcbiAgICB2YXIgc3RhcnRlZCA9IE5Qcm9ncmVzcy5pc1N0YXJ0ZWQoKTtcblxuICAgIG4gPSBjbGFtcChuLCBTZXR0aW5ncy5taW5pbXVtLCAxKTtcbiAgICBOUHJvZ3Jlc3Muc3RhdHVzID0gKG4gPT09IDEgPyBudWxsIDogbik7XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSBOUHJvZ3Jlc3MucmVuZGVyKCFzdGFydGVkKSxcbiAgICAgICAgYmFyICAgICAgPSBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKFNldHRpbmdzLmJhclNlbGVjdG9yKSxcbiAgICAgICAgc3BlZWQgICAgPSBTZXR0aW5ncy5zcGVlZCxcbiAgICAgICAgZWFzZSAgICAgPSBTZXR0aW5ncy5lYXNpbmc7XG5cbiAgICBwcm9ncmVzcy5vZmZzZXRXaWR0aDsgLyogUmVwYWludCAqL1xuXG4gICAgcXVldWUoZnVuY3Rpb24obmV4dCkge1xuICAgICAgLy8gU2V0IHBvc2l0aW9uVXNpbmcgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgIGlmIChTZXR0aW5ncy5wb3NpdGlvblVzaW5nID09PSAnJykgU2V0dGluZ3MucG9zaXRpb25Vc2luZyA9IE5Qcm9ncmVzcy5nZXRQb3NpdGlvbmluZ0NTUygpO1xuXG4gICAgICAvLyBBZGQgdHJhbnNpdGlvblxuICAgICAgY3NzKGJhciwgYmFyUG9zaXRpb25DU1Mobiwgc3BlZWQsIGVhc2UpKTtcblxuICAgICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgLy8gRmFkZSBvdXRcbiAgICAgICAgY3NzKHByb2dyZXNzLCB7IFxuICAgICAgICAgIHRyYW5zaXRpb246ICdub25lJywgXG4gICAgICAgICAgb3BhY2l0eTogMSBcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2dyZXNzLm9mZnNldFdpZHRoOyAvKiBSZXBhaW50ICovXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBjc3MocHJvZ3Jlc3MsIHsgXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsICcgKyBzcGVlZCArICdtcyBsaW5lYXInLCBcbiAgICAgICAgICAgIG9wYWNpdHk6IDAgXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9LCBzcGVlZCk7XG4gICAgICAgIH0sIHNwZWVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQobmV4dCwgc3BlZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgTlByb2dyZXNzLmlzU3RhcnRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0eXBlb2YgTlByb2dyZXNzLnN0YXR1cyA9PT0gJ251bWJlcic7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSBwcm9ncmVzcyBiYXIuXG4gICAqIFRoaXMgaXMgdGhlIHNhbWUgYXMgc2V0dGluZyB0aGUgc3RhdHVzIHRvIDAlLCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGdvIGJhY2t3YXJkcy5cbiAgICpcbiAgICogICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuICAgKlxuICAgKi9cbiAgTlByb2dyZXNzLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFOUHJvZ3Jlc3Muc3RhdHVzKSBOUHJvZ3Jlc3Muc2V0KDApO1xuXG4gICAgdmFyIHdvcmsgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghTlByb2dyZXNzLnN0YXR1cykgcmV0dXJuO1xuICAgICAgICBOUHJvZ3Jlc3MudHJpY2tsZSgpO1xuICAgICAgICB3b3JrKCk7XG4gICAgICB9LCBTZXR0aW5ncy50cmlja2xlU3BlZWQpO1xuICAgIH07XG5cbiAgICBpZiAoU2V0dGluZ3MudHJpY2tsZSkgd29yaygpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBwcm9ncmVzcyBiYXIuXG4gICAqIFRoaXMgaXMgdGhlICpzb3J0IG9mKiB0aGUgc2FtZSBhcyBzZXR0aW5nIHRoZSBzdGF0dXMgdG8gMTAwJSwgd2l0aCB0aGVcbiAgICogZGlmZmVyZW5jZSBiZWluZyBgZG9uZSgpYCBtYWtlcyBzb21lIHBsYWNlYm8gZWZmZWN0IG9mIHNvbWUgcmVhbGlzdGljIG1vdGlvbi5cbiAgICpcbiAgICogICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAqXG4gICAqIElmIGB0cnVlYCBpcyBwYXNzZWQsIGl0IHdpbGwgc2hvdyB0aGUgcHJvZ3Jlc3MgYmFyIGV2ZW4gaWYgaXRzIGhpZGRlbi5cbiAgICpcbiAgICogICAgIE5Qcm9ncmVzcy5kb25lKHRydWUpO1xuICAgKi9cblxuICBOUHJvZ3Jlc3MuZG9uZSA9IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgaWYgKCFmb3JjZSAmJiAhTlByb2dyZXNzLnN0YXR1cykgcmV0dXJuIHRoaXM7XG5cbiAgICByZXR1cm4gTlByb2dyZXNzLmluYygwLjMgKyAwLjUgKiBNYXRoLnJhbmRvbSgpKS5zZXQoMSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluY3JlbWVudHMgYnkgYSByYW5kb20gYW1vdW50LlxuICAgKi9cblxuICBOUHJvZ3Jlc3MuaW5jID0gZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgdmFyIG4gPSBOUHJvZ3Jlc3Muc3RhdHVzO1xuXG4gICAgaWYgKCFuKSB7XG4gICAgICByZXR1cm4gTlByb2dyZXNzLnN0YXJ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgYW1vdW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBhbW91bnQgPSAoMSAtIG4pICogY2xhbXAoTWF0aC5yYW5kb20oKSAqIG4sIDAuMSwgMC45NSk7XG4gICAgICB9XG5cbiAgICAgIG4gPSBjbGFtcChuICsgYW1vdW50LCAwLCAwLjk5NCk7XG4gICAgICByZXR1cm4gTlByb2dyZXNzLnNldChuKTtcbiAgICB9XG4gIH07XG5cbiAgTlByb2dyZXNzLnRyaWNrbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTlByb2dyZXNzLmluYyhNYXRoLnJhbmRvbSgpICogU2V0dGluZ3MudHJpY2tsZVJhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgYWxsIHN1cHBsaWVkIGpRdWVyeSBwcm9taXNlcyBhbmRcbiAgICogaW5jcmVhc2VzIHRoZSBwcm9ncmVzcyBhcyB0aGUgcHJvbWlzZXMgcmVzb2x2ZS5cbiAgICpcbiAgICogQHBhcmFtICRwcm9taXNlIGpRVWVyeSBQcm9taXNlXG4gICAqL1xuICAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluaXRpYWwgPSAwLCBjdXJyZW50ID0gMDtcblxuICAgIE5Qcm9ncmVzcy5wcm9taXNlID0gZnVuY3Rpb24oJHByb21pc2UpIHtcbiAgICAgIGlmICghJHByb21pc2UgfHwgJHByb21pc2Uuc3RhdGUoKSA9PT0gXCJyZXNvbHZlZFwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudCA9PT0gMCkge1xuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgaW5pdGlhbCsrO1xuICAgICAgY3VycmVudCsrO1xuXG4gICAgICAkcHJvbWlzZS5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGN1cnJlbnQtLTtcbiAgICAgICAgaWYgKGN1cnJlbnQgPT09IDApIHtcbiAgICAgICAgICAgIGluaXRpYWwgPSAwO1xuICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zZXQoKGluaXRpYWwgLSBjdXJyZW50KSAvIGluaXRpYWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICB9KSgpO1xuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIHJlbmRlcnMgdGhlIHByb2dyZXNzIGJhciBtYXJrdXAgYmFzZWQgb24gdGhlIGB0ZW1wbGF0ZWBcbiAgICogc2V0dGluZy5cbiAgICovXG5cbiAgTlByb2dyZXNzLnJlbmRlciA9IGZ1bmN0aW9uKGZyb21TdGFydCkge1xuICAgIGlmIChOUHJvZ3Jlc3MuaXNSZW5kZXJlZCgpKSByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25wcm9ncmVzcycpO1xuXG4gICAgYWRkQ2xhc3MoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnbnByb2dyZXNzLWJ1c3knKTtcbiAgICBcbiAgICB2YXIgcHJvZ3Jlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzcy5pZCA9ICducHJvZ3Jlc3MnO1xuICAgIHByb2dyZXNzLmlubmVySFRNTCA9IFNldHRpbmdzLnRlbXBsYXRlO1xuXG4gICAgdmFyIGJhciAgICAgID0gcHJvZ3Jlc3MucXVlcnlTZWxlY3RvcihTZXR0aW5ncy5iYXJTZWxlY3RvciksXG4gICAgICAgIHBlcmMgICAgID0gZnJvbVN0YXJ0ID8gJy0xMDAnIDogdG9CYXJQZXJjKE5Qcm9ncmVzcy5zdGF0dXMgfHwgMCksXG4gICAgICAgIHBhcmVudCAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTZXR0aW5ncy5wYXJlbnQpLFxuICAgICAgICBzcGlubmVyO1xuICAgIFxuICAgIGNzcyhiYXIsIHtcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMCBsaW5lYXInLFxuICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoJyArIHBlcmMgKyAnJSwwLDApJ1xuICAgIH0pO1xuXG4gICAgaWYgKCFTZXR0aW5ncy5zaG93U3Bpbm5lcikge1xuICAgICAgc3Bpbm5lciA9IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoU2V0dGluZ3Muc3Bpbm5lclNlbGVjdG9yKTtcbiAgICAgIHNwaW5uZXIgJiYgcmVtb3ZlRWxlbWVudChzcGlubmVyKTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50ICE9IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGFkZENsYXNzKHBhcmVudCwgJ25wcm9ncmVzcy1jdXN0b20tcGFyZW50Jyk7XG4gICAgfVxuXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGVsZW1lbnQuIE9wcG9zaXRlIG9mIHJlbmRlcigpLlxuICAgKi9cblxuICBOUHJvZ3Jlc3MucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmVtb3ZlQ2xhc3MoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnbnByb2dyZXNzLWJ1c3knKTtcbiAgICByZW1vdmVDbGFzcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNldHRpbmdzLnBhcmVudCksICducHJvZ3Jlc3MtY3VzdG9tLXBhcmVudCcpO1xuICAgIHZhciBwcm9ncmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCducHJvZ3Jlc3MnKTtcbiAgICBwcm9ncmVzcyAmJiByZW1vdmVFbGVtZW50KHByb2dyZXNzKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBwcm9ncmVzcyBiYXIgaXMgcmVuZGVyZWQuXG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5pc1JlbmRlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25wcm9ncmVzcycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgd2hpY2ggcG9zaXRpb25pbmcgQ1NTIHJ1bGUgdG8gdXNlLlxuICAgKi9cblxuICBOUHJvZ3Jlc3MuZ2V0UG9zaXRpb25pbmdDU1MgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBTbmlmZiBvbiBkb2N1bWVudC5ib2R5LnN0eWxlXG4gICAgdmFyIGJvZHlTdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XG5cbiAgICAvLyBTbmlmZiBwcmVmaXhlc1xuICAgIHZhciB2ZW5kb3JQcmVmaXggPSAoJ1dlYmtpdFRyYW5zZm9ybScgaW4gYm9keVN0eWxlKSA/ICdXZWJraXQnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKCdNb3pUcmFuc2Zvcm0nIGluIGJvZHlTdHlsZSkgPyAnTW96JyA6XG4gICAgICAgICAgICAgICAgICAgICAgICgnbXNUcmFuc2Zvcm0nIGluIGJvZHlTdHlsZSkgPyAnbXMnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKCdPVHJhbnNmb3JtJyBpbiBib2R5U3R5bGUpID8gJ08nIDogJyc7XG5cbiAgICBpZiAodmVuZG9yUHJlZml4ICsgJ1BlcnNwZWN0aXZlJyBpbiBib2R5U3R5bGUpIHtcbiAgICAgIC8vIE1vZGVybiBicm93c2VycyB3aXRoIDNEIHN1cHBvcnQsIGUuZy4gV2Via2l0LCBJRTEwXG4gICAgICByZXR1cm4gJ3RyYW5zbGF0ZTNkJztcbiAgICB9IGVsc2UgaWYgKHZlbmRvclByZWZpeCArICdUcmFuc2Zvcm0nIGluIGJvZHlTdHlsZSkge1xuICAgICAgLy8gQnJvd3NlcnMgd2l0aG91dCAzRCBzdXBwb3J0LCBlLmcuIElFOVxuICAgICAgcmV0dXJuICd0cmFuc2xhdGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCcm93c2VycyB3aXRob3V0IHRyYW5zbGF0ZSgpIHN1cHBvcnQsIGUuZy4gSUU3LThcbiAgICAgIHJldHVybiAnbWFyZ2luJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhlbHBlcnNcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xhbXAobiwgbWluLCBtYXgpIHtcbiAgICBpZiAobiA8IG1pbikgcmV0dXJuIG1pbjtcbiAgICBpZiAobiA+IG1heCkgcmV0dXJuIG1heDtcbiAgICByZXR1cm4gbjtcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIGNvbnZlcnRzIGEgcGVyY2VudGFnZSAoYDAuLjFgKSB0byBhIGJhciB0cmFuc2xhdGVYXG4gICAqIHBlcmNlbnRhZ2UgKGAtMTAwJS4uMCVgKS5cbiAgICovXG5cbiAgZnVuY3Rpb24gdG9CYXJQZXJjKG4pIHtcbiAgICByZXR1cm4gKC0xICsgbikgKiAxMDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIHJldHVybnMgdGhlIGNvcnJlY3QgQ1NTIGZvciBjaGFuZ2luZyB0aGUgYmFyJ3NcbiAgICogcG9zaXRpb24gZ2l2ZW4gYW4gbiBwZXJjZW50YWdlLCBhbmQgc3BlZWQgYW5kIGVhc2UgZnJvbSBTZXR0aW5nc1xuICAgKi9cblxuICBmdW5jdGlvbiBiYXJQb3NpdGlvbkNTUyhuLCBzcGVlZCwgZWFzZSkge1xuICAgIHZhciBiYXJDU1M7XG5cbiAgICBpZiAoU2V0dGluZ3MucG9zaXRpb25Vc2luZyA9PT0gJ3RyYW5zbGF0ZTNkJykge1xuICAgICAgYmFyQ1NTID0geyB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgnK3RvQmFyUGVyYyhuKSsnJSwwLDApJyB9O1xuICAgIH0gZWxzZSBpZiAoU2V0dGluZ3MucG9zaXRpb25Vc2luZyA9PT0gJ3RyYW5zbGF0ZScpIHtcbiAgICAgIGJhckNTUyA9IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlKCcrdG9CYXJQZXJjKG4pKyclLDApJyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBiYXJDU1MgPSB7ICdtYXJnaW4tbGVmdCc6IHRvQmFyUGVyYyhuKSsnJScgfTtcbiAgICB9XG5cbiAgICBiYXJDU1MudHJhbnNpdGlvbiA9ICdhbGwgJytzcGVlZCsnbXMgJytlYXNlO1xuXG4gICAgcmV0dXJuIGJhckNTUztcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIFF1ZXVlcyBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxuICAgKi9cblxuICB2YXIgcXVldWUgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBlbmRpbmcgPSBbXTtcbiAgICBcbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgdmFyIGZuID0gcGVuZGluZy5zaGlmdCgpO1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuKG5leHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihmbikge1xuICAgICAgcGVuZGluZy5wdXNoKGZuKTtcbiAgICAgIGlmIChwZW5kaW5nLmxlbmd0aCA9PSAxKSBuZXh0KCk7XG4gICAgfTtcbiAgfSkoKTtcblxuICAvKipcbiAgICogKEludGVybmFsKSBBcHBsaWVzIGNzcyBwcm9wZXJ0aWVzIHRvIGFuIGVsZW1lbnQsIHNpbWlsYXIgdG8gdGhlIGpRdWVyeSBcbiAgICogY3NzIG1ldGhvZC5cbiAgICpcbiAgICogV2hpbGUgdGhpcyBoZWxwZXIgZG9lcyBhc3Npc3Qgd2l0aCB2ZW5kb3IgcHJlZml4ZWQgcHJvcGVydHkgbmFtZXMsIGl0IFxuICAgKiBkb2VzIG5vdCBwZXJmb3JtIGFueSBtYW5pcHVsYXRpb24gb2YgdmFsdWVzIHByaW9yIHRvIHNldHRpbmcgc3R5bGVzLlxuICAgKi9cblxuICB2YXIgY3NzID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjc3NQcmVmaXhlcyA9IFsgJ1dlYmtpdCcsICdPJywgJ01veicsICdtcycgXSxcbiAgICAgICAgY3NzUHJvcHMgICAgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNhbWVsQ2FzZShzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXi1tcy0vLCAnbXMtJykucmVwbGFjZSgvLShbXFxkYS16XSkvZ2ksIGZ1bmN0aW9uKG1hdGNoLCBsZXR0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmVuZG9yUHJvcChuYW1lKSB7XG4gICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5ib2R5LnN0eWxlO1xuICAgICAgaWYgKG5hbWUgaW4gc3R5bGUpIHJldHVybiBuYW1lO1xuXG4gICAgICB2YXIgaSA9IGNzc1ByZWZpeGVzLmxlbmd0aCxcbiAgICAgICAgICBjYXBOYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSksXG4gICAgICAgICAgdmVuZG9yTmFtZTtcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmVuZG9yTmFtZSA9IGNzc1ByZWZpeGVzW2ldICsgY2FwTmFtZTtcbiAgICAgICAgaWYgKHZlbmRvck5hbWUgaW4gc3R5bGUpIHJldHVybiB2ZW5kb3JOYW1lO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHlsZVByb3AobmFtZSkge1xuICAgICAgbmFtZSA9IGNhbWVsQ2FzZShuYW1lKTtcbiAgICAgIHJldHVybiBjc3NQcm9wc1tuYW1lXSB8fCAoY3NzUHJvcHNbbmFtZV0gPSBnZXRWZW5kb3JQcm9wKG5hbWUpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUNzcyhlbGVtZW50LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgcHJvcCA9IGdldFN0eWxlUHJvcChwcm9wKTtcbiAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oZWxlbWVudCwgcHJvcGVydGllcykge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgcHJvcCwgXG4gICAgICAgICAgdmFsdWU7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIGZvciAocHJvcCBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BdO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcCkpIGFwcGx5Q3NzKGVsZW1lbnQsIHByb3AsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlDc3MoZWxlbWVudCwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIERldGVybWluZXMgaWYgYW4gZWxlbWVudCBvciBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lcyBjb250YWlucyBhIGNsYXNzIG5hbWUuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGhhc0NsYXNzKGVsZW1lbnQsIG5hbWUpIHtcbiAgICB2YXIgbGlzdCA9IHR5cGVvZiBlbGVtZW50ID09ICdzdHJpbmcnID8gZWxlbWVudCA6IGNsYXNzTGlzdChlbGVtZW50KTtcbiAgICByZXR1cm4gbGlzdC5pbmRleE9mKCcgJyArIG5hbWUgKyAnICcpID49IDA7XG4gIH1cblxuICAvKipcbiAgICogKEludGVybmFsKSBBZGRzIGEgY2xhc3MgdG8gYW4gZWxlbWVudC5cbiAgICovXG5cbiAgZnVuY3Rpb24gYWRkQ2xhc3MoZWxlbWVudCwgbmFtZSkge1xuICAgIHZhciBvbGRMaXN0ID0gY2xhc3NMaXN0KGVsZW1lbnQpLFxuICAgICAgICBuZXdMaXN0ID0gb2xkTGlzdCArIG5hbWU7XG5cbiAgICBpZiAoaGFzQ2xhc3Mob2xkTGlzdCwgbmFtZSkpIHJldHVybjsgXG5cbiAgICAvLyBUcmltIHRoZSBvcGVuaW5nIHNwYWNlLlxuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gbmV3TGlzdC5zdWJzdHJpbmcoMSk7XG4gIH1cblxuICAvKipcbiAgICogKEludGVybmFsKSBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxuICAgKi9cblxuICBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBuYW1lKSB7XG4gICAgdmFyIG9sZExpc3QgPSBjbGFzc0xpc3QoZWxlbWVudCksXG4gICAgICAgIG5ld0xpc3Q7XG5cbiAgICBpZiAoIWhhc0NsYXNzKGVsZW1lbnQsIG5hbWUpKSByZXR1cm47XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBjbGFzcyBuYW1lLlxuICAgIG5ld0xpc3QgPSBvbGRMaXN0LnJlcGxhY2UoJyAnICsgbmFtZSArICcgJywgJyAnKTtcblxuICAgIC8vIFRyaW0gdGhlIG9wZW5pbmcgYW5kIGNsb3Npbmcgc3BhY2VzLlxuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gbmV3TGlzdC5zdWJzdHJpbmcoMSwgbmV3TGlzdC5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIEdldHMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiB0aGUgY2xhc3MgbmFtZXMgb24gdGhlIGVsZW1lbnQuIFxuICAgKiBUaGUgbGlzdCBpcyB3cmFwcGVkIHdpdGggYSBzaW5nbGUgc3BhY2Ugb24gZWFjaCBlbmQgdG8gZmFjaWxpdGF0ZSBmaW5kaW5nIFxuICAgKiBtYXRjaGVzIHdpdGhpbiB0aGUgbGlzdC5cbiAgICovXG5cbiAgZnVuY3Rpb24gY2xhc3NMaXN0KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKCcgJyArIChlbGVtZW50LmNsYXNzTmFtZSB8fCAnJykgKyAnICcpLnJlcGxhY2UoL1xccysvZ2ksICcgJyk7XG4gIH1cblxuICAvKipcbiAgICogKEludGVybmFsKSBSZW1vdmVzIGFuIGVsZW1lbnQgZnJvbSB0aGUgRE9NLlxuICAgKi9cblxuICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBlbGVtZW50ICYmIGVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gTlByb2dyZXNzO1xufSk7XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/nprogress/nprogress.js\n");

/***/ })

};
;