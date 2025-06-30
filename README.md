# secure-html-injector
Little library to inject html in a secure way in a React project.

Use in a React project, after nmp i:

`
import { HtmlInjector } from 'secure-html-injector';

const htmlExample="<div><h1>Example HTML string</h1><p>This is a library to inject code in a secure way</p></div>"
..

<htmlString={htmlExample} />

`

