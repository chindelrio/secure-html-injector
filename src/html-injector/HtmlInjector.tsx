import React, { ReactNode, createElement, useCallback, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';

interface HtmlInjectorProps {
  htmlString: string;
}
const HtmlInjector = ({ htmlString }: HtmlInjectorProps) => {

  const positionRef = useRef(0);

  const formatStyles = useCallback((style: string) => {
    const _toCamelCase = (str: string) =>
      str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
    const formattedStyles: Record<string, string> = {};
    style.split(';').forEach((property) => {
      const [rawKey, rawValue] = property.split(':');
      if (!rawKey || !rawValue) return;
      const key = _toCamelCase(rawKey.trim());
      const value = rawValue.trim();
      if (key && value) {
        formattedStyles[key] = value;
      }
    });
    return formattedStyles;
  }, []);

  const domNodeToReact = useCallback((node: ChildNode): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const children = Array.from(el.childNodes).map(domNodeToReact);
      const props: Record<string, unknown> = {};
      props.key = positionRef.current;
      positionRef.current += 1;
      for (const attr of Array.from(el.attributes)) {
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
      return createElement(el.tagName.toLowerCase(), props, ...children);
    }
    return null;
  }, [formatStyles]);

  
  const parseHtmlToReact = useCallback((stringToParse: string): ReactNode => {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(stringToParse, "text/html");
    return Array.from(doc.body.childNodes).map(domNodeToReact);
  }, [domNodeToReact]);

  const sanitizedHtml = useMemo(() => {
    const cleanedHtml = typeof htmlString === "string" ? htmlString.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ').trim() : htmlString;
    if (typeof htmlString !== "string" || !htmlString.trim().startsWith('<') ) return "";
    return DOMPurify.sanitize(cleanedHtml);
  }, [htmlString]);

  const parsedHtml = useMemo(() =>
    sanitizedHtml.length > 0 ? parseHtmlToReact(sanitizedHtml) : null,
    [sanitizedHtml, parseHtmlToReact]
  );

  return parsedHtml ? <div>{parsedHtml} </div> : null
};

export default HtmlInjector;
