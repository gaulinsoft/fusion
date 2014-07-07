# [fusion](http://www.fusionlang.org/): A language framework and superset for JavaScript, HTML, and CSS

##### Framework
Fusion provides a simple and straightforward collection of functions to analyize JavaScript, HTML, and CSS.
A syntax highlighter along with other lexer-parser utilities for these languages are available in this framework.
The lexical analysis phase also provides an optional lightweight parser hack to allow for fast and efficient conversions while still offering language transitions and advanced detection of regexp and object literals.

##### Language
Fusion utilizes various language components of JavaScript, HTML, and CSS to provide more robust and maintainable code.
This superset aims for a very natural development platform that seamlessly transitions between each language.
It not only makes source code easier to understand and maintain, but can also remove the need for JavaScript libraries such as jQuery to construct DOM elements using document fragments and innerHTML.
Since it's designed to work natively with the DOM, Fusion can increase performance by assisting front-end libraries or sometimes eliminating the need for them altogether.
Otherwise, an optional lightweight DOM library (3KB, gzipped) is also provided to further simplify your code and make working with the DOM a little more intuitive by extending `Element` and `Array` objects.

> Fusion does not have any releases and is still a work in progress. Please feel free to create an issue if you'd like to propose any other language features.

A live demo is currently available at: http://www.fusionlang.org

## Contents
- [Features](#features)
	- [Syntax Highlighting](#syntax-highlighting)
	- [Lexical Analysis](#lexical-analysis)
		- [Arguments](#arguments)
	- [Converting Fusion to JavaScript](#converting-fusion-to-javascript)
- [Language Features](#language-features)
	- [Inline HTML](#inline-html)
	- [Template Strings](#template-strings)
	- [Attribute Template Strings](#template-strings-in-html-attributes)
	- [Inline CSS Styles](#inline-css-styles)
	- [Inline CSS Selectors](#inline-css-selectors)
	- [HTML Substitutions](#template-substitutions-in-html)
	- [CSS Style Substitutions](#template-substitutions-in-css-styles)
	- [CSS Selector Substitutions](#template-substitutions-in-css-selectors)
- [Setup](#setup)
	- [Node.js](#nodejs)
	- [Optional DOM Library](#dom-library-optional)
- [Reference](#reference)
- [Futures](#futures)

## Features

#### Syntax highlighting
```text
fusion.highlight(source [, language [, strict]])
```

_Returns:_ string of HTML

#### Lexical analysis

```text
fusion.tokenize(source [, language [, strict]])
```

_Returns:_ array of `{ type, start, end }` objects

#### Syntax + Semantic analysis

> Eventually...

##### Arguments

* _source_
	* string of source code
* _language_
	* string of source code language
	* supports `js`, `html`, `css`, and `fjs`
	* defaults to `fjs`
* _strict_
	* boolean for strict mode, which forces the `js`, `html`, and `css` languages to be context-free
	* removes `<script>` and `<style>` language transitions in `html`
	* removes template strings and advanced regexp and object literal detection in `js`
	* defaults to `false`

#### Converting Fusion to JavaScript
```text
fusion.transpile(source [, create [, find [, query [, attr [, html]]]]])
```

_Returns:_ string of JavaScript

##### Arguments

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

### Language Features

![Example](http://cdn.gaulinsoft.com/fusion/readme_example_01.png)

The following list outlines the various language features that are currently available in the fusion superset.
Each code snippet presents the output provided by the lexer for syntax highlighting and tokenization followed by that of the parser when transpiling fusion to JavaScript.

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

```text
npm install fusionlang
```

The following example configures Node.js to transpile files in the `/fjs` directory and cache them in memory when requested through the `/static` url:

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

## Reference
### JavaScript tokens
```text
JavaScriptIdentifier
JavaScriptReservedWord
JavaScriptPunctuator
JavaScriptNumber
JavaScriptDoubleQuotedString
JavaScriptSingleQuotedString
JavaScriptTemplateString
JavaScriptRegExp
JavaScriptBlockComment
JavaScriptLineComment
JavaScriptInvalidCharacter
JavaScriptWhitespace
```

### HTML tokens
```text
HTMLText
HTMLStartTagOpen
HTMLStartTagName
HTMLStartTagSolidus
HTMLStartTagWhitespace
HTMLStartTagClose
HTMLStartTagSelfClose
HTMLEndTagOpen
HTMLEndTagName
HTMLEndTagText
HTMLEndTagWhitespace
HTMLEndTagClose
HTMLCharacterReference
HTMLAttributeName
HTMLAttributeOperator
HTMLAttributeValue
HTMLAttributeDoubleQuotedValue
HTMLAttributeSingleQuotedValue
HTMLCommentOpen
HTMLCommentText
HTMLCommentClose
HTMLBogusCommentOpen
HTMLBogusCommentText
HTMLBogusCommentClose
HTMLDOCTYPEOpen
HTMLDOCTYPEString
HTMLDOCTYPEDoubleQuotedString
HTMLDOCTYPESingleQuotedString
HTMLDOCTYPEWhitespace
HTMLDOCTYPEClose
HTMLCDATAOpen
HTMLCDATAText
HTMLCDATAClose
```

### CSS tokens
```text
CSSIdentifier
CSSNumber
CSSDelimiter
CSSPunctuator
CSSDimension
CSSPercentage
CSSComma
CSSColon
CSSSemicolon
CSSDoubleQuotedString
CSSSingleQuotedString
CSSHash
CSSFunction
CSSAtKeyword
CSSMatch
CSSUrl
CSSColumn
CSSUnicodeRange
CSSComment
CSSWhitespace
```

### Fusion tokens
```text
FusionStartTagOpen
FusionStartTagClose
FusionStartTagSelfClose
FusionEndTagOpen
FusionEndTagClose
FusionProperty
FusionObject
FusionSelector
FusionAttributeTemplateString
FusionAttributeTemplateStringHead
FusionAttributeTemplateStringMiddle
FusionAttributeTemplateStringTail
FusionSubstitutionOpen
FusionSubstitutionClose
FusionObjectSubstitutionOpen
FusionObjectSubstitutionClose
FusionSelectorSubstitutionOpen
FusionSelectorSubstitutionClose
FusionStyleSubstitutionOpen
FusionStyleSubstitutionClose
```

## Futures
* editor plugins for syntax highlighting and eventually autocomplete functionality
* fusion view engines
