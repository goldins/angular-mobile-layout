// Source: src/release.prefix
(function (window, document) {
  'use strict';

// Source: src/release.suffix
})(window, document);  // Source: src/utils/utils.js
  var Js = {};
  
  /**
   * shorthand for "is null or undefined"
   * @param x
   */
  Js.isNothing = function (x) {
    return x === undefined || x === null;
  };
  
  /**
   * shorthand for "is not nothing"
   * @param x
   * @returns {boolean}
   */
  Js.isSomething = function (x) {
    return !Js.isNothing(x);
  };
  
  Js.isArray = function (x) {
    return x instanceof Array;
  };
  
  Js.isObject = function (o) {
    return o !== null && typeof o === 'object' && !(o instanceof Array);
  };
  
  Js.isNumber = function (n) {
    return typeof n === 'number' && !isNaN(n) && isFinite(n);
  };
  
  /**
   * Check that a string or number is an integer.
   * Note that you can't necessarily to math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   * strings with dots and letters evaluate to false, and objects are false.
   */
  Js.isInteger = function (n) {
    if (n === null) {
      return false;
    }
  
    if (isNaN(n)) {
      return false;
    }
  
    return parseInt(n, 10) === parseFloat(n);
  };
  
  /**
   * Check that a number is an integer. This will reject strings.
   * Note that you can't necessarily do math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   */
  Js.isIntegerNumber = function (n) {
    if ((typeof n) !== 'number') {
      return false;
    }
  
    return Js.isInteger(n);
  };
  
  /**
   * Check that a string or number is an integer, and it's > 0.
   * Note that you can't necessarily to math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   * strings with dots and letters evaluate to false, and objects are false.
   */
  Js.isPositiveInteger = function (n) {
    if (!Js.isInteger(n)) {
      return false;
    }
  
    return n > 0;
  };
  
  /**
   * Inspired by angular.isBoolean(), which is inaccessible.
   *
   * @param b
   * @returns {boolean}
   */
  Js.isBoolean = function (b) {
    return typeof b === 'boolean';
  };
  
  Js.isString = function (s) {
    if (s === null) {
      return false;
    }
  
    if (s === undefined) {
      return false;
    }
  
    return typeof s === 'string';
  };
  
  Js.isFunction = function (f) {
    return typeof f === 'function';
  };
  
  Js.isEmptyString = function(s) {
    return !Js.isString(s) || s.length === 0;
  };
  
  Js.formatString = function () {
    var str = arguments[0];
  
    if (!Js.isString(str)) {
      throw 'Expected first argument to be the string format, but was ' + str;
    }
  
    for (var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
      str = str.replace('%s', arg);
    }
  
    return str;
  };
  
  Js.printException = function (ex) {
    if (!(ex instanceof Error)) {
      return 'Expected an Error, but was ' + ex;
    }
  
    return ex.message + '\n' + ex.stack;
  };
  
  
  var Preconditions = {};
  
  /**
   * Throw an error if a condition evaluates to false, like in Guava.
   * The first argument is the condition. The second argument is the error message. All other arguments are used in formatting the error message argument.
   * The error message can be templated, according to Js.formatString(), so this function takes any number of trailing arguments.
   *
   * usage: Preconditions.checkArgument(x === y, 'Bad argument %s x should be y.', 'because')
   */
  Preconditions.check = function (isGood, checkTypeMsg, errorMsg, errorMsgArgs) {
    if (!!isGood || isGood === 0) {
      return;
    }
  
    if (!errorMsg) {
      throw new Error(checkTypeMsg);
    }
  
    if (!Js.isString(errorMsg)) {
      console.error('Expected a string as the second argument, but was ' + errorMsg);
      return;
    }
  
    if (!checkTypeMsg) {
      checkTypeMsg = 'Error: ';
    }
  
    var formattedErrorMsg = Js.formatString.apply(null, errorMsgArgs);
    throw new Error(checkTypeMsg + formattedErrorMsg);
  };
  
  Preconditions.checkArgument = function (isGood, errorMsg) {
    var args = Array.prototype.slice.call(arguments);
    var errorMsgArgs = args.slice(1, args.length);
  
    Preconditions.check(isGood, 'Illegal Argument: ', errorMsg, errorMsgArgs);
  };
  
  Preconditions.checkState = function (isGood, errorMsg) {
    var args = Array.prototype.slice.call(arguments);
    var errorMsgArgs = args.slice(1, args.length);
  
    Preconditions.check(isGood, 'Illegal State: ', errorMsg, errorMsgArgs);
  };
    // Source: src/angular-mobile-layout/js/widgets-module.js
  angular.module('mobile.layout', [])
  
    .provider('JqLiteExtender', function JqLiteExtender() {
      var extender = this;
  
      this.extendPrototype = function () {
  
        angular.element.prototype.$forEach = function (callback) {
          for (var i = 0; i < this.length; i++) {
            callback(this[i]);
          }
        };
  
        angular.element.prototype.$filter = function (predicate) {
          var matches = [];
  
          this.$forEach(function (node) {
            if (!!(predicate(node))) {
              matches.push(node);
            }
          });
  
          return new angular.element(matches);
        };
  
        var parseTagSelector = function (tagSelector) {
          var selectors = tagSelector.split('[');
  
          if (selectors.length === 1) {
            return {tag: selectors[0]};
          }
  
          Preconditions.checkArgument(selectors.length === 2, 'Expected 1 attr and 1 tag selector, but was: %s', selectors);
  
          var attributeSelector = selectors[1];
          Preconditions.checkArgument(attributeSelector[attributeSelector.length - 1] === ']', 'Malformed attribute selector.');
  
          var cleanAttrSelector = attributeSelector.substring(0, attributeSelector.length - 1);
  
          return {tag: selectors[0], attr: cleanAttrSelector};
        };
  
        var isEmptyJQL = function (jql) {
          if (!jql) {
            return true;
          }
  
          return jql.length < 1;
        };
  
        var Selector = function Selector(selector) {
          Preconditions.checkArgument(Js.isString(selector), 'Not a selector: %s', selector);
  
          var selectors = selector.split('.');
          Preconditions.checkArgument(selectors.length >= 1, 'Invalid selector: %s', selector);
  
          var tagName = selectors.shift();
          this.tagSelector = parseTagSelector(tagName);
          this.classNames = selectors;
        };
  
        Selector.prototype = {};
        Selector.prototype.getTagName = function () {
          return this.tagSelector.tag;
        };
  
        Selector.prototype.filterByTagName = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var tagName = this.tagSelector.tag;
  
          if (tagName === '*') {
            return jql;
          }
  
          return jql.$filter(function (node) {
            return node.localName === tagName;
          });
        };
  
        Selector.prototype.filterByClass = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var requiredClasses = this.classNames;
          if (requiredClasses.length < 1) {
            return jql;
          }
  
          var hasClasses = function (node) {
            var classList = node.classList;
  
            for (var i = 0; i < requiredClasses.length; i++) {
              if (!(classList.contains(requiredClasses[i]))) {
                return false;
              }
            }
  
            return true;
          };
  
          return jql.$filter(hasClasses);
        };
  
        Selector.prototype.filterByAttribute = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var tagSelector = this.tagSelector;
          if (!(tagSelector.attr)) {
            return jql;
          }
  
          var hasAttribute = function (node) {
            return node.nodeType === 1 && node.hasAttribute(tagSelector.attr);
          };
  
          return jql.$filter(hasAttribute);
        };
  
        /**
         * Supports more css selector syntax than the default JQLite.
         * This supports dot-class selectors and at most 1 attribute selector.
         *
         * @param selectorString - ex:  div[foo-attribute].class-1.class-2
         * @returns {*}
         */
        angular.element.prototype.$find = function (selectorString) {
          var selector = new Selector(selectorString);
  
          var nodes = this.find(selector.getTagName());
  
          if (isEmptyJQL(nodes)) {
            return nodes;
          }
  
          var classFiltered = selector.filterByClass(nodes);
          var attrFiltered = selector.filterByAttribute(classFiltered);
  
          return attrFiltered;
        };
  
        /**
         * Supports expanded selector syntax, like $find(). This provides a
         * better performance profile than find(), if you're only searching
         * through top level nodes, because filter is recursive and
         *
         * @param selectorString
         * @returns {*}
         */
        angular.element.prototype.$contents = function (selectorString) {
          var selector = new Selector(selectorString);
  
          var nodes = selector.filterByTagName(this);
  
          if (isEmptyJQL(nodes)) {
            return nodes;
          }
  
          var classFiltered = selector.filterByClass(nodes);
          var attrFiltered = selector.filterByAttribute(classFiltered);
  
          return attrFiltered;
        };
  
      };
  
      this.$get = [function JqLiteExtenderFactory() {
        return extender;
      }];
    })
  
    .config(['JqLiteExtenderProvider', function (JqLiteExtender) {
      JqLiteExtender.extendPrototype();
    }]);
    // Source: src/angular-mobile-layout/js/multi-transclude-controller.js
  angular.module('mobile.layout')
    .controller('multiTransclude', ['$scope', '$exceptionHandler', function ($scope, $exceptionHandler) {
      var transcludePostLinkers = [];
  
      $scope.multiTranscludeCtrl = {
        addTranscludePostLinker: function (callback) {
          Preconditions.checkArgument(_.isFunction(callback), 'Expected callback function, but was %s', callback);
          transcludePostLinkers.push(callback);
        },
  
        doTranscludePostLink: function () {
  
          for (var i = 0; i < transcludePostLinkers.length; i++) {
            var postlinker = transcludePostLinkers[i];
  
            try {
              postlinker();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
  
        }
      };
  
    }])
  ;
    // Source: src/angular-mobile-layout/js/transclude-footer-directive.js
  /**
   * This directive calls the multi-transclude post-linker, indicating the completion of all transcluded content's
   * post-linking, so you want your transclude-footer directive to be the last transcluded element.
   */
  angular.module('mobile.layout')
    .directive('transcludeFooter', [function TranscludeFooter() {
  
      return {
        restrict: 'A',
        replace: false,
  
        link: function($scope) {
          Preconditions.checkState(!!($scope.multiTranscludeCtrl), 'Missing required multi-transclude controller object.');
          $scope.multiTranscludeCtrl.doTranscludePostLink();
        }
  
      };
    }]);
    // Source: src/angular-mobile-layout/js/vertical-fill-layout-directive.js
  /**
   * This is a layout container that fills a space with a header/body/footer template.  The header and footer heights
   * are determined by their contents, and the body container, in between, fills the remaining the available height.
   * The size of the header and footer are determined by their contents, and the body div in the middle stretches to
   * fill the space between them. This is browser backward compatible because it uses javascript dom manipulation to
   * set the body height.  This version calculates its size after all its transcluded contents have completed their
   * post-linking, and it does not support dynamic resizing.
   */
  angular.module('mobile.layout')
    .directive('verticalFillLayout', [function VerticalFillLayout() {
  
      return {
        template: '<div class="vfl vfl-container"><div class="vfl vfl-header"></div><div class="vfl vfl-body"></div><div class="vfl vfl-footer"></div></div>',
        restrict: 'E',
        replace: true,
        transclude: true,
  
        /**
         * This controller transcludes multiple divs.
         */
        controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
          $transclude(function(clone) {
            var headerContainer = $element.$find('div.vfl.vfl-header');
            var bodyContainer = $element.$find('div.vfl.vfl-body');
            var footerContainer = $element.$find('div.vfl.vfl-footer');
  
            var headerContent = clone.$contents('*[transclude-header]');
            var bodyContent = clone.$contents('*[transclude-body]');
            var footerContent = clone.$contents('*[transclude-footer]');
  
            Preconditions.checkArgument(headerContent.length === 1, 'Expected 1 transclude-header element, but found %s', headerContent.length);
            Preconditions.checkArgument(bodyContent.length === 1, 'Expected 1 transclude-body element, but found %s', bodyContent.length);
            Preconditions.checkArgument(footerContent.length === 1, 'Expected 1 transclude-footer element, but found %s', footerContent.length);
  
            headerContainer.append(headerContent);
            footerContainer.append(footerContent);
            bodyContainer.append(bodyContent);
          });
        }],
  
        link: function($scope, $element, $attr, $multiTranscludeCtrl) {
          Preconditions.checkArgument(!!$multiTranscludeCtrl, 'Missing multi-transclude controller.');
          var multiTranscludeCtrl = $scope.multiTranscludeCtrl;
          Preconditions.checkArgument(!!multiTranscludeCtrl, 'Missing multi-transclude controller object.');
  
          var resize = function () {
            var rootContainer = $element.$contents('div.vfl.vfl-container')[0];
            var headerContainer = $element.$find('div.vfl.vfl-header')[0];
            var bodyContainer = $element.$find('div.vfl.vfl-body')[0];
            var footerContainer = $element.$find('div.vfl.vfl-footer')[0];
  
            var rootHeight = rootContainer.offsetHeight;
            var headerHeight = headerContainer.offsetHeight;
            var footerHeight = footerContainer.offsetHeight;
  
            var bodyHeight = rootHeight - (headerHeight + footerHeight);
  
            bodyContainer.style.height = bodyHeight.toString() + 'px';
          };
  
          $scope.multiTranscludeCtrl.addTranscludePostLinker(resize);
        }
  
      };
    }]);
  