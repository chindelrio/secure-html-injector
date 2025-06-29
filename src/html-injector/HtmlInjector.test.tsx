import React from 'react';
import { render } from '@testing-library/react';
import HtmlInjector from './HtmlInjector';

describe('HtmlInjector', () => {
  test('should render', () => {
    const htmlString = '<p class="test-class" style="color: red; font-size: 16px;">Hello <strong>World</strong></p>';
    
    const { container } = render(<HtmlInjector htmlString={htmlString} />);
    
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.tagName).toBe('DIV');
    
    const paragraph = wrapper.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('test-class');
    expect(paragraph).toHaveStyle('color: red; font-size: 16px;');
    
    const strongElement = paragraph?.querySelector('strong');
    expect(strongElement).toBeInTheDocument();
    expect(strongElement).toHaveTextContent('World');
    
    expect(paragraph).toHaveTextContent('Hello World');
  });

  test('should convert kebab case to camel case styles for React Compatibility', () => {
    const htmlString = '<div style="background-color: blue; font-size: 14px; margin-top: 10px; border-radius: 5px;">Test</div>';
    
    const { container } = render(<HtmlInjector htmlString={htmlString} />);
    
    const wrapper = container.firstChild as HTMLElement;
    const divElement = wrapper.querySelector('div');
    
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveStyle('background-color: blue');
    expect(divElement).toHaveStyle('font-size: 14px');
    expect(divElement).toHaveStyle('margin-top: 10px');
    expect(divElement).toHaveStyle('border-radius: 5px');
  });

  test('should filter out event handler attributes', () => {
    const htmlString = '<button onclick="alert(\'XSS\')" onmouseover="console.log(\'hover\')" class="btn">Click me</button>';
    
    const { container } = render(<HtmlInjector htmlString={htmlString} />);
    
    const wrapper = container.firstChild as HTMLElement;
    const buttonElement = wrapper.querySelector('button');
    
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('btn');
    expect(buttonElement).toHaveTextContent('Click me');
    
    expect(buttonElement).not.toHaveAttribute('onclick');
    expect(buttonElement).not.toHaveAttribute('onmouseover');
  });

  test('should get classNames correctly', () => {
    const htmlString = '<div class="my-class another-class">Content</div>';
    
    const { container } = render(<HtmlInjector htmlString={htmlString} />);
    
    const wrapper = container.firstChild as HTMLElement;
    const divElement = wrapper.querySelector('div');
    
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveClass('my-class');
    expect(divElement).toHaveClass('another-class');
  });

  test('should return null for empty html string', () => {
    const { container: emptyContainer } = render(<HtmlInjector htmlString="" />);
    expect(emptyContainer.firstChild).toBeNull();
    
    const { container: whitespaceContainer } = render(<HtmlInjector htmlString="   " />);
    expect(whitespaceContainer.firstChild).toBeNull();
    
    const { container: tabsContainer } = render(<HtmlInjector htmlString="\t\n  " />);
    expect(tabsContainer.firstChild).toBeNull();
  });

  test('should handle malformed html gracefully', () => {
    const malformedHtmlCases = [
      '<div><p>Unclosed paragraph</div>',
      '<div class="test><p>Missing quote</p></div>',
      '<div><span>Nested <div>block in inline</div></span></div>',
      '<img src="test.jpg" alt="test"',
      '<div><p>Text</p><span>More text</div>',
      '<div style="color: red; background-color:">Incomplete style</div>',
      '<div><p>Text<strong>Bold</p></strong></div>'
    ];

    malformedHtmlCases.forEach((htmlString) => {
      expect(() => {
        const { container } = render(<HtmlInjector htmlString={htmlString} />);
        expect(container).toBeInTheDocument();
      }).not.toThrow();
    });
  });

  test('should_handle_malformed_css_styles', () => {
    const malformedStyleCases = [
      '<div style="color:; background-color: blue;">Missing color value</div>',
      '<div style=":red; font-size: 14px;">Missing property name</div>',
      '<div style="color red; background: blue;">Missing colon</div>',
      '<div style="color:; background-color:; font-size:;">All missing values</div>',
      '<div style=";;;;">Only semicolons</div>',
      '<div style="color: red;; background: blue;">Double semicolons</div>',
      '<div style="color: red; ; background: blue;">Empty property</div>',
      '<div style="margin-top">Missing colon and value</div>',
      '<div style="color: red; background-color">Incomplete last property</div>'
    ];

    malformedStyleCases.forEach((htmlString) => {
      expect(() => {
        const { container } = render(<HtmlInjector htmlString={htmlString} />);
        const wrapper = container.firstChild as HTMLElement;
        const divElement = wrapper.querySelector('div');
        
        expect(divElement).toBeInTheDocument();
        expect(wrapper).toBeInTheDocument();
      }).not.toThrow();
    });
  });
});