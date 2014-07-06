# [fusion](http://www.fusionlang.org/): A modern web framework that brings together the JavaScript, HTML, CSS, and DOM specs.

Fusion brings together various language components of JavaScript, HTML, and CSS to provide more robust and maintainable code.
This superset provides a very natural development platform that seemlessly transitions between certain language features of JavaScript, HTML, and CSS.
It also has an optional lightweight DOM library (3KB, gzipped) that can be included to further simplify your code.

A HIGHLIGHT FUNCTION IS PROVIDED FOR JAVASCRIPT, HTML, CSS, AND THE FUSION SUPERSET
```text
fusion.highlight(source, language)
```
* source   = string
* language = fjs, js, html, css

RETURNS: a string of HTML

A TRANSPILE FUNCTION IS PROVIDED FOR CONVERSION FROM THE FUSION SUPERSET TO JAVASCRIPT
```text
fusion.transpile(source [, create [, find [, query [, attr [, html]]]]])
```
* source = string
* create = HTML document `createElement()` function name (defaults to `document.__create`)
* find   = HTML document `querySelector()` function name (defaults to `document.__find`)
* query  = HTML document `querySelectorAll()` function name (defaults to `document.__query`)
* attr   = HTML element `setAttribute()` function name (defaults to `__attr`)
* html   = HTML element `innerHTML` function name (defaults to `__html`)

RETURNS: a string of JavaScript

THE FUSION SUPERSET HAS THE FOLLOWING FEATURES:

#### Inline HTML
![Inline HTML](http://cdn.gaulinsoft.com/fusion/readme_html.png)

#### ECMAScript 6 template strings
![Template String](http://cdn.gaulinsoft.com/fusion/readme_templatestring.png)

#### ECMAScript 6 template strings in inline HTML attributes
![Template String in HTML Attribute](http://cdn.gaulinsoft.com/fusion/readme_html_templatestring.png)

#### Inline CSS styles
![Inline CSS Style](http://cdn.gaulinsoft.com/fusion/readme_css_object.png)

#### Inline CSS selectors
![Inline CSS Selectors](http://cdn.gaulinsoft.com/fusion/readme_css_selectors.png)

#### ECMAScript 6 template string substitutions in inline HTML
![Inline HTML Substitution](http://cdn.gaulinsoft.com/fusion/readme_html_substitution.png)

#### ECMAScript 6 template string substitutions in inline CSS styles
![Inline CSS Style Substitution](http://cdn.gaulinsoft.com/fusion/readme_css_object_substitution.png)

#### ECMAScript 6 template string substitutions in inline CSS selectors
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
It allows a seemless transition between arrays and elements.
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
