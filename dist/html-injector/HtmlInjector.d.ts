import React from 'react';
interface HtmlInjectorProps {
    htmlString: string;
}
declare const HtmlInjector: ({ htmlString }: HtmlInjectorProps) => React.JSX.Element | null;
export default HtmlInjector;
