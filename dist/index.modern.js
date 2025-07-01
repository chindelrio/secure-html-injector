import React, { useRef, useCallback, createElement, useMemo } from 'react';
import DOMPurify from 'dompurify';

var HtmlInjector = function HtmlInjector(_ref) {
  var htmlString = _ref.htmlString;
  var positionRef = useRef(0);
  var formatStyles = useCallback(function (style) {
    var _toCamelCase = function _toCamelCase(str) {
      return str.replace(/-([a-z])/g, function (_, _char) {
        return _char.toUpperCase();
      });
    };
    var formattedStyles = {};
    style.split(';').forEach(function (property) {
      var _property$split = property.split(':'),
        rawKey = _property$split[0],
        rawValue = _property$split[1];
      if (!rawKey || !rawValue) return;
      var key = _toCamelCase(rawKey.trim());
      var value = rawValue.trim();
      if (key && value) {
        formattedStyles[key] = value;
      }
    });
    return formattedStyles;
  }, []);
  var domNodeToReact = useCallback(function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      var el = node;
      var children = Array.from(el.childNodes).map(domNodeToReact);
      var props = {};
      props.key = positionRef.current;
      positionRef.current += 1;
      for (var _i = 0, _Array$from = Array.from(el.attributes); _i < _Array$from.length; _i++) {
        var attr = _Array$from[_i];
        if (attr.name === "class") {
          props["className"] = attr.value;
        } else if (attr.name === "style") {
          props["style"] = formatStyles(attr.value);
        } else if (/^on[a-z]/.test(attr.name)) {
          continue;
        } else {
          props[attr.name] = attr.value;
        }
      }
      return createElement.apply(void 0, [el.tagName.toLowerCase(), props].concat(children));
    }
    return null;
  }, [formatStyles]);
  var parseHtmlToReact = useCallback(function (stringToParse) {
    var domParser = new DOMParser();
    var doc = domParser.parseFromString(stringToParse, "text/html");
    return Array.from(doc.body.childNodes).map(domNodeToReact);
  }, [domNodeToReact]);
  var sanitizedHtml = useMemo(function () {
    var cleanedHtml = typeof htmlString === "string" ? htmlString.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ').trim() : htmlString;
    if (typeof htmlString !== "string" || !htmlString.trim().startsWith('<')) return "";
    return DOMPurify.sanitize(cleanedHtml);
  }, [htmlString]);
  var parsedHtml = useMemo(function () {
    return sanitizedHtml.length > 0 ? parseHtmlToReact(sanitizedHtml) : null;
  }, [sanitizedHtml, parseHtmlToReact]);
  return parsedHtml ? React.createElement("div", null, parsedHtml, " ") : null;
};

export { HtmlInjector };
//# sourceMappingURL=index.modern.js.map
