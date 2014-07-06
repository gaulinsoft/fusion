# [fusion](http://www.fusionlang.org/): A language superset that brings together JavaScript, HTML, and CSS

Fusion utilizes various language components of JavaScript, HTML, and CSS to provide more robust and maintainable code.
This superset provides a very natural development platform that seamlessly transitions between JavaScript, HTML, and CSS.
It also has an optional lightweight DOM library (3KB, gzipped) that can be included to further simplify your code.

## Features

#### Syntax highlighting
```text
fusion.highlight(source, language)
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

REQUIRES THE FOLLOWING SIMPLE DEFINITIONS FOR INLINE HTML AND CSS
```javascript
Element.prototype.__attr = function(n,v){this.setAttribute(n,v);return this};
Element.prototype.__html = function(c){this.innerHTML=c;return this};

Document.prototype.__create = Document.prototype.createElement;
Document.prototype.__find   = Document.prototype.querySelector;
Document.prototype.__query  = Document.prototype.querySelectorAll;
```

THE FOLLOWING CALL WILL REMOVE THE NEED FOR THE THREE `Document.prototype` ASSIGNMENTS:
```javascript
fusion.transpile(source, "document.createElement", "document.querySelector", "document.querySelectorAll")
```

OTHERWISE, IT HAS AN OPTIONAL LIGHTWEIGHT DOM PLUGIN (3KB GZIPPED, 10 KB)
WHICH CAN BE ACCESSED NATIVELY OR USING THE FUSION SUPERSET
```text
@(div.blah).__append(<span />);
@(div.blah)@append(<span />);
```

*** `fusion-dom.js` does NOT require `fusion.js`, it's a runtime component that also provides the base functionality of the simple `Element.prototype` and `Document.prototype` definitions above.

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

This DOM library extends the `Element`, `Array`, and `Document` prototypes.
It allows a seamless transition between arrays and elements.
The `find()` function returns either an element or `null`, and the `query()` function returns either an array of elements or an empty array.


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
