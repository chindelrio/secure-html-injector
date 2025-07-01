# secure-html-injector

A lightweight React library for securely injecting HTML strings into your React components. This library uses DOMPurify to sanitize HTML content and converts it to React elements, preventing XSS attacks while maintaining the ability to render dynamic HTML content.

## Features

- 🔒 **Secure**: Uses DOMPurify to sanitize HTML and prevent XSS attacks
- ⚛️ **React-friendly**: Converts HTML strings to React elements
- 🎨 **Style support**: Handles inline styles and CSS classes
- 🚫 **Event filtering**: Automatically removes potentially dangerous event handlers
- 📦 **Lightweight**: Minimal dependencies and small bundle size

## Installation

```bash
npm install secure-html-injector
```

## Usage

### Basic Example

```tsx
import React from 'react';
import HtmlInjector from 'secure-html-injector';

const App = () => {
  const htmlString = `
    <div>
      <h1>Welcome to My App</h1>
      <p>This HTML content is <strong>safely injected</strong>!</p>
    </div>
  `;

  return (
    <div>
      <HtmlInjector htmlString={htmlString} />
    </div>
  );
};

export default App;
```

### Advanced Example with Styles

```tsx
import React from 'react';
import HtmlInjector from 'secure-html-injector';

const App = () => {
  const styledHtml = `
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333; margin-bottom: 16px;">Styled Content</h2>
      <p class="highlight" style="font-size: 16px; line-height: 1.5;">
        This content includes inline styles and CSS classes that are safely processed.
      </p>
      <ul style="margin-top: 12px;">
        <li>Secure HTML injection</li>
        <li>Style preservation</li>
        <li>XSS protection</li>
      </ul>
    </div>
  `;

  return (
    <div>
      <h1>My React App</h1>
      <HtmlInjector htmlString={styledHtml} />
    </div>
  );
};

export default App;
```

### Dynamic Content Example

```tsx
import React, { useState } from 'react';
import HtmlInjector from 'secure-html-injector';

const DynamicContent = () => {
  const [content, setContent] = useState(`
    <div>
      <h3>Dynamic HTML Content</h3>
      <p>This content can be updated dynamically!</p>
    </div>
  `);

  const updateContent = () => {
    const newContent = `
      <div style="border: 2px solid #007bff; padding: 15px;">
        <h3 style="color: #007bff;">Updated Content</h3>
        <p>The content has been <em>safely updated</em> at ${new Date().toLocaleTimeString()}!</p>
        <button onclick="alert('This will be removed for security')">Unsafe Button</button>
      </div>
    `;
    setContent(newContent);
  };

  return (
    <div>
      <button onClick={updateContent}>Update Content</button>
      <HtmlInjector htmlString={content} />
    </div>
  );
};

export default DynamicContent;
```

## API Reference

### HtmlInjector Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `htmlString` | `string` | Yes | The HTML string to be sanitized and injected |

## Security Features

- **XSS Prevention**: All HTML content is sanitized using DOMPurify
- **Event Handler Removal**: Potentially dangerous event handlers (onclick, onload, etc.) are automatically removed
- **Safe Attribute Handling**: Only safe HTML attributes are preserved
- **Style Sanitization**: Inline styles are parsed and converted to React-compatible format

## Browser Support

This library supports all modern browsers that support:
- React 16.8+
- ES6 features
- DOMParser API

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.