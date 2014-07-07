# [fusion](http://www.fusionlang.org/): A language framework and superset for JavaScript, HTML, and CSS

Fusion utilizes various language features of JavaScript, HTML, and CSS to provide more robust and maintainable code.
This superset aims for a very natural development platform that seamlessly transitions between each language.
It not only makes source code easier to understand and maintain, but can also remove the need for JavaScript libraries to construct DOM elements using document fragments and innerHTML.
Fusion is also designed to work natively with the DOM, which can assist libraries such as jQuery or eliminate the need for them altogether.
To facilitate this transition, an optional lightweight DOM library (3KB, gzipped) is provided to further simplify your code.

> Fusion does not have any releases and is still currently in beta. Please feel free to create an issue if you'd like to propose any other language features.

## Features

#### Syntax highlighting
```text
fusion.highlight(source [, language])
```

* _source_
	* string of source code
* _language_
	* string of source code language
	* supports `js`, `html`, `css`, and `fjs`
	* defaults to `fjs`

_Returns:_ string of HTML

#### Converting Fusion to JavaScript
```text
fusion.transpile(source [, create [, find [, query [, attr [, html]]]]])
```
* _source_
	* string of fusion source code
* _create_
	* string for a function similar to `createElement()`
	* defaults to `document.__create`
* _find_
	* string for a function similar to `querySelector()`
	* defaults to `document.__find`
* _query_
	* string for a function similar to `querySelectorAll()`
	* defaults to `document.__query`
* _attr_
	* string for a function similar to `setAttribute()`
	* defaults to `__attr`
	* must return a reference to `this`
* _html_
	* string for a function similar to `innerHTML` property
	* defaults to `__html`
	* must return a reference to `this`

_Returns:_ string of JavaScript

### Language Features

#### Inline HTML
![Inline HTML](http://cdn.gaulinsoft.com/fusion/readme_html.png)

#### Template strings
![Template String](http://cdn.gaulinsoft.com/fusion/readme_templatestring.png)

#### Template strings in HTML attributes
![Template String in HTML Attribute](http://cdn.gaulinsoft.com/fusion/readme_html_templatestring.png)

#### Inline CSS styles
![Inline CSS Style](http://cdn.gaulinsoft.com/fusion/readme_css_object.png)

#### Inline CSS selectors
![Inline CSS Selectors](http://cdn.gaulinsoft.com/fusion/readme_css_selectors.png)

#### Template substitutions in HTML
![Inline HTML Substitution](http://cdn.gaulinsoft.com/fusion/readme_html_substitution.png)

#### Template substitutions in CSS styles
![Inline CSS Style Substitution](http://cdn.gaulinsoft.com/fusion/readme_css_object_substitution.png)

#### Template substitutions in CSS selectors
![Inline CSS Selector Substitution](http://cdn.gaulinsoft.com/fusion/readme_css_selector_substitution.png)

## Setup

If you'd like to natively use the DOM, the following `__attr()` and `__html()` functions must be assigned to `Element.prototype` for inline HTML and CSS:
```javascript
Element.prototype.__attr = function(n,v){this.setAttribute(n,v);return this};
Element.prototype.__html = function(c){this.innerHTML=c;return this};
```

The `transpile()` function can then be called with the first three optional arguments as follows:
```javascript
fusion.transpile(source, "document.createElement", "document.querySelector", "document.querySelectorAll")
```

Or they can be omitted if assigned to `Document.prototype`:
```javascript
Document.prototype.__create = Document.prototype.createElement;
Document.prototype.__find   = Document.prototype.querySelector;
Document.prototype.__query  = Document.prototype.querySelectorAll;
```

Otherwise, an optional lightweight DOM plugin (3KB, gzipped) can be included using `fusion-dom.js`.

### Node.js

The following example configures Node.js to transpile files in the `/fjs` directory and cache them in memory when requested through the `/static` URL:

```javascript
var http    = require('http'),
    through = require('through'),
    st      = require('st'),
    fusion  = require('fusion');

var mount  = st({ url:  '/static', path: __dirname + '/fjs' }),
    filter = through(function(data) { this.emit('data', fusion.transpile(data.toString())) });

http.createServer(function(req, res)
{
    res.filter = filter;

    if (mount(req, res))
        res.setHeader('content-type', 'application/javascript');
})
.listen(1337);

console.log('Server running on port 1337...');
```

This concept can also be applied with the `fusion.highlight()` function (and either a `text/plain` or `text/html` content-type) to serve up highlighted HTML of the source code.

> Settings for the `st()` function can be found here: https://github.com/isaacs/st

### DOM Library (optional)

The `fusion-dom.js` file can be included to extend the `Element`, `Array`, and `Document` prototypes.
This file does NOT require `fusion.js`, and the prototype assignments above are also not required when including this library since it already defines `__attr()` and `__html()` functions on the `Element` prototype and `__create()`, `__find()`, and `__query()` functions on the `Document` prototype.

These prototype functions can be accessed natively or using the `@` operator:
```text
@(div.container).__attr('title', null);
@(div.container)@attr('title', null);
```

This DOM library allows a seamless transition between arrays and elements.
The `__find()` function returns either an element or `null`, and the `__query()` function returns either an array of elements or an empty array.

Element
* after()
* append()
* attr()
* before()
* child()
* children()
* contains()
* find()
* first()
* html()
* last()
* matches()
* next()
* parent()
* prepend()
* prev()
* query()
* remove()
* replace()
* style()
* text()
* document
* length
* tag

Array
* attrs()
* children()
* filter()
* find()
* first()
* html()
* last()
* matches()
* next()
* not()
* parent()
* prev()
* query()
* remove()
* styles()
* text()

Document
* contains()
* create()
* find()
* query()

```text
[
	<div />,
	<div />,
	<pre />
]
@attrs("data-ready", Date.now())
@prependTo(element)
@style(@{
	-webkit-animation: slide ${duration / 1000}s ease-in-out;
});

document
	@query("span")
	@attrs("style", null)
	@first()
		@attr("data-ready", Date.now())
		@after(<span class="second" />);
```
