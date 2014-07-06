/*! ------------------------------------------------------------------------
//                                   Fusion
//  ------------------------------------------------------------------------
//
//                       Copyright 2014 Nicholas Gaulin
//
//       Licensed under the Apache License, Version 2.0 (the "License");
//      you may not use this file except in compliance with the License.
//                   You may obtain a copy of the License at
//
//                 http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//      distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//                       limitations under the License.
*/
(function(global, undefined)
{
    // Enable strict mode
    'use strict';

    // If no global object was provided, create a temporary global object
    if (!global)
        global = {};

// ########## BUILD ##########

// Create the build parameters
var $_minify  = false,
    $_version = '1.0.0b';

// ########## NATIVE CODE ##########

// Store references to native code functions and constants
var $__object               = Object,
    $__objectProto__        = $__object.prototype,
    $__create               = $__object.create,
    $__defineProperty       = $__object.defineProperty,
    $__freeze               = $__object.freeze,
    $__getPrototypeOf       = $__object.getPrototypeOf,
    $__isExtensible         = $__object.isExtensible,
    $__isFrozen             = $__object.isFrozen,
    $__isSealed             = $__object.isSealed,
    $__keys                 = $__object.keys,
    $__preventExtensions    = $__object.preventExtensions,
    $__propertyIsEnumerable = $__object.propertyIsEnumerable,
    $__seal                 = $__object.seal,
    $__hasOwnProperty__     = $__objectProto__.hasOwnProperty,
    $__isPrototypeOf__      = $__objectProto__.isPrototypeOf,
    $__toString__           = $__objectProto__.toString,
    $__valueOf__            = $__objectProto__.valueOf,

    // ---------- ARRAY ----------
    $__array         = Array,
    $__arrayProto__  = $__array.prototype,
    $__array_isArray = $__array.isArray,

    // ---------- DATE ----------
    $__date       = Date,
    $__date_now   = $__date.now,
    $__date_parse = $__date.parse,

    // ---------- ERROR ----------
    $__error = Error,

    // ---------- NUMBER ----------
    $__number     = Number,
    $__ceil       = Math.ceil,
    $__floor      = Math.floor,
    $__isFinite   = isFinite,
    $__isNaN      = isNaN,
    $__parseFloat = parseFloat,
    $__parseInt   = parseInt,
    $__random     = Math.random,

    // ---------- STRING ----------
    $__string        = String,
    $__stringProto__ = $__string.prototype;

// If any of the ECMAScript 5 native code methods are not found, throw an exception
if (!$__create || !$__defineProperty || !$__freeze || !$__getPrototypeOf || !$__preventExtensions || !$__seal || !$__array_isArray || !$__arrayProto__.forEach || !$__arrayProto__.indexOf || !$__stringProto__.trim)
    throw new $__error('JavaScript engine does not support ECMAScript 5.');

// ---------- WINDOW ----------
var $_window = typeof window != 'undefined' && window != null && window.window === window ?
               window :
               {};

// Get the native DOM references
var __Node       = Node,
    __Node__     = __Node ?
                   __Node.prototype :
                   null,
    __Element    = Element,
    __Element__  = __Element ?
                   __Element.prototype :
                   null,
    __Document   = Document,
    __Document__ = __Document ?
                   __Document.prototype :
                   null;

// Get the matches() method name
var __matches = __Element__ && typeof __Element__.matches == 'function' ?
                'matches' :
                __Element__ && typeof __Element__.matchesSelector == 'function' ?
                'matchesSelector' :
                null;

// If a matches() method name was not found
if (!__matches)
{
    // Check if a vendor matches() method is available
    'webkit moz ms o'.split(' ').forEach(function($v, $i, $a)
    {
        // If the vendor method is a function, get the matches() method name
        if (!__matches && typeof __Element__[$v + 'MatchesSelector'] == 'function')
            __matches = $v + 'MatchesSelector';
    });

    // If a matches() method name was not found, set the default matches() method name
    if (!__matches)
        __matches = 'matches';
}

// ########## HELPERS ##########

// --- OBJECT ---
var $_accessor = function($object, $key, $get, $set, $enumerable, $configurable)
{
    // Define the "accessor" property in the object
    $__defineProperty($object, $key,
    {
        'configurable': !!$configurable,
        'enumerable':   !!$enumerable,
        'get':          $get || undefined,
        'set':          $set || undefined
    });
};
var $_data     = function($object, $key, $value, $writable, $enumerable, $configurable)
{
    // Define the "data" property in the object
    $__defineProperty($object, $key,
    {
        'configurable': !!$configurable,
        'enumerable':   !!$enumerable,
        'value':        $value,
        'writable':     !!$writable
    });
};
var $_method   = function($object, $key, $value)
{
    // Define a writable, non-enumerable, and configurable "data" property in the object
    $_data($object, $key, $value, true, false, true);
};

// --- ELEMENT ---
var $_array = function($object, $instanceof)
{
    // If no array-like object was provided, return an empty array
    if (!$object || !$object.length)
        return [];

    // Create the array of elements
    var $array = new $__array($object.length);

    for (var $i = 0, $j = $array.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = $object[$i];

        // Set the element in the array if it's an instance of the object (or there's nothing to check)
        $array[$i] = !$instanceof || $item instanceof $instanceof ?
                     $item || null :
                     null;
    }

    return $array;
};
var $_find  = function($element, $selectors)
{
    // Check if the selectors are a simple tag lookup
    var $exec = /^\s*([a-z][_a-z0-9]*)\s*$/i.exec($selectors);

    // If the selectors are not a simple tag lookup, return the first element matching any of the selectors
    if (!$exec)
        return $element.querySelector($selectors);

    // Get the elements from the tags lookup
    var $elements = this.getElementsByTagName($exec[1]);

    // If any elements were found in the lookup, return the first element
    if ($elements && $elements.length > 0)
        return $elements[0];

    return null;
};
var $_query = function($element, $selectors)
{
    // Check if the selectors are a simple tag or classes lookup
    var $exec = /^\s*([a-z][_a-z0-9]*|(?:\.-?[_a-z]+[_a-z0-9\-]*\s*)+)\s*$/i.exec($selectors);

    // If the selectors are not a simple tag or classes lookup, return the elements matching any of the selectors
    if (!$exec)
        return $element.querySelectorAll($selectors);

    // Get the simple selector
    $exec = $exec[1];

    // If the simple selector is a collection of classes, return the elements from the classes lookup
    if ($exec[0] == '.')
        return $element.getElementsByClassName($exec.substr(1).replace(/\s*\./g, ' ').trim());

    // Return any elements from the tags lookup
    return $element.getElementsByTagName($exec);
};

// ########## ARRAY ##########
$_method($__arrayProto__, '__attrs',    function($name, $value)
{
    // If the attrs() method doesn't return this, return this
    if ($value === undefined && (typeof $name == 'string' || $name === undefined))
        return this;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Set the element attribute
        $item.__attr($name, $value);
    }

    return this;
});
$_method($__arrayProto__, '__children', function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    var $array = null;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element or doesn't have any children, continue
        if (!$item || !($item instanceof __Element) || !$item.childElementCount)
            continue;

        // If these are the first children, get all the children in the element matching any of the selectors
        if (!$array)
            $array = $selectors ?
                     $item.__children($selectors) :
                     $_array($item.children);
        else for (var $k = 0, $l = $item.childElementCount; $k < $l; $k++)
        {
            // Get the current child element
            var $child = $item.children[$k];

            // If the element matches any of the selectors, push it into the array of elements
            if (!$selectors || $child && $child[__matches]($selectors))
                $array.push($child);
        }
    }

    // If an array was created, return it
    if ($array)
        return $array;

    return [];
});
$_method($__arrayProto__, '__filter',   function($selectors)
{
    // If the selectors are not a primitive string, return an empty array
    if (!$selectors || typeof $selectors != 'string')
        return [];

    var $array = [];

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // If the element matches any of the selectors, push it into the array
        if ($item[__matches]($selectors))
            $array.push($item);
    }

    return $array;
});
$_method($__arrayProto__, '__find',     function($selectors)
{
    // If the selectors are not a primitive string, return null
    if (!$selectors || typeof $selectors != 'string')
        return null;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element or doesn't have any children, continue
        if (!$item || !($item instanceof __Element) || !$item.childElementCount)
            continue;

        // Find the first element in the element matching any of the selectors
        var $find = $_find($item, $selectors);

        // If an element was found, return it
        if ($find)
            return $find;
    }

    return null;
});
$_method($__arrayProto__, '__first',    function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // If the element matches any of the selectors, return it
        if (!$selectors || $item[__matches]($selectors))
            return $item;
    }

    return null;
});
$_method($__arrayProto__, '__html',     function($content)
{
    // If the html() method doesn't return this, return this
    if ($content === undefined)
        return this;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Set the element html
        $item.__html($content);
    }

    return this;
});
$_method($__arrayProto__, '__last',     function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    for (var $i = this.length - 1; $i >= 0; $i--)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // If the element matches any of the selectors, return it
        if (!$selectors || $item[__matches]($selectors))
            return $item;
    }

    return null;
});
$_method($__arrayProto__, '__matches',  function($selectors)
{
    // If the selectors are not a primitive string, return false
    if (!$selectors || typeof $selectors != 'string')
        return false;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // If the element matches any of the selectors, return true
        if ($item[__matches]($selectors))
            return true;
    }

    return false;
});
$_method($__arrayProto__, '__next',     function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    var $array = [];

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Get the next sibling of the element
        var $next = $item.nextElementSibling;

        // If there's no next sibling or selectors were provided and it doesn't match, continue
        if (!$next || $selectors && !$next[__matches]($selectors))
            continue;

        // Push the next sibling into the array
        $array.push($next);
    }

    return $array;
});
$_method($__arrayProto__, '__not',      function($selectors)
{
    // If the selectors are not a primitive string, return an empty array
    if (!$selectors || typeof $selectors != 'string')
        return [];

    var $array = [];

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // If the element doesn't match any of the selectors, push it into the array
        if (!$item[__matches]($selectors))
            $array.push($item);
    }

    return $array;
});
$_method($__arrayProto__, '__parent',   function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    var $array = [];

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Get the parent element of the element
        var $parent = $item.parentNode;

        // If the parent is an instance of an Element and matches any of the selectors, push it into the array
        if ($parent instanceof __Element && (!$selectors || $parent[__matches]($selectors)))
            $array.push($parent);
    }

    return $array;
});
$_method($__arrayProto__, '__prev',     function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    var $array = [];

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Get the previous sibling of the element
        var $prev = $item.previousElementSibling;

        // If there's no previous sibling or selectors were provided and it doesn't match, continue
        if (!$prev || $selectors && !$prev[__matches]($selectors))
            continue;

        // Push the previous sibling into the array
        $array.push($prev);
    }

    return $array;
});
$_method($__arrayProto__, '__query',    function($selectors)
{
    // If the selectors are not a primitive string, return an empty array
    if (!$selectors || typeof $selectors != 'string')
        return [];

    var $array = null;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element or doesn't have any children, continue
        if (!$item || !($item instanceof __Element) || !$item.childElementCount)
            continue;

        // Query all the elements in this element matching any of the selectors
        var $query = $_query($item, $selectors);

        // If no elements were found, continue
        if (!$query || !$query.length)
            continue;

        // If this is the first query, set the array of elements
        if (!$array)
            $array = $_array($query);
        // Push the queried elements into the array of elements
        else for (var $k = 0, $l = $query.length; $k < $l; $k++)
            $array.push($query[$k]);
    }

    // If an array was created, return it
    if ($array)
        return $array;

    return [];
});
$_method($__arrayProto__, '__remove',   function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    // Get the array of elements
    var $array = $selectors ?
                 this.__filter($selectors) :
                 this;

    for (var $i = 0, $j = $array.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = $array[$i];

        // If no selectors were provided and the current element isn't an instance of an element or it doesn't have a parent, continue
        if (!$selectors && !($item instanceof __Element) || !$item.parentNode)
            continue;

        // Remove the element from its parent
        $item.parentNode.removeChild($item);
    }

    return $array;
});
$_method($__arrayProto__, '__styles',   function($property, $value)
{
    // If the style() method doesn't return this, return this
    if ($value === undefined && (typeof $property == 'string' || $property === undefined))
        return this;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Set the element style
        $item.__style($property, $value);
    }

    return this;
});
$_method($__arrayProto__, '__text',     function($content)
{
    // If the text() method doesn't return this, return this
    if ($content === undefined)
        return this;

    for (var $i = 0, $j = this.length; $i < $j; $i++)
    {
        // Get the current element
        var $item = this[$i];

        // If the element isn't an instance of an Element, continue
        if (!$item || !($item instanceof __Element))
            continue;

        // Set the element text
        $item.__text($content);
    }

    return this;
});

// ########## DOCUMENT ##########
var $_document_div = null;

$_method(__Document__, '__contains', function($element)
{
    // If the argument is not an instance of an Element, return false
    if (!$element || !($element instanceof __Element))
        return false;

    // Return true if the document element contains the provided element
    return !!this.documentElement.contains($element);
});
$_method(__Document__, '__create',   function($tag)
{
    // If the tag is not a primitive string, return null
    if (!$tag || typeof $tag != 'string')
        return null;

    // If the tag is a document tag name, return a document fragment
    if ($tag == '#document')
        return this.createDocumentFragment();

    // If the tag can be directly created, return the created element
    if (/^[a-z][_a-z0-9]*$/i.test($tag))
        return this.createElement($tag);

    // If the tag is neither HTML nor a valid tag name, return null
    if (($tag[0] != '<' || $tag[$tag.length - 1] != '>') && !/^[a-z][^ >\/\t\r\n\f]*$/i.test($tag))
        return null;

    // If a `div` element has not been created, then create it within a document fragment
    if (!$_document_div)
        $_document_div = this.createDocumentFragment().appendChild(this.createElement('div'));

    // Set the HTML of the `div` element
    $_document_div.innerHTML = $tag[0] == '<' ?
                               $tag :
                             //$_void($tag) ?
                             //'<' + $tag + '/>' :
                               '<' + $tag + '></' + $tag + '>';

    // Get the return elements from the `div` element
    var $return = $tag[0] == '<' ?
                  $_array($_document_div.children) :
                  $_document_div.firstElementChild || null;

    // Remove all the children of the `div` element
    while ($_document_div.hasChildNodes())
        $_document_div.removeChild($_document_div.lastChild);
    
    return $return;
});
$_method(__Document__, '__find',     function($selectors)
{
    // If the selectors are not a primitive string, return null
    if (!$selectors || typeof $selectors != 'string')
        return null;

    // Check if the selectors are a simple tag or ID lookup
    var $exec = /^\s*([a-z][_a-z0-9]*|#[_a-z0-9\-]+)\s*$/i.exec($selectors);

    // If the selector isn't simple, return the first element matching any of the selectors
    if (!$exec)
        return this.querySelector($selectors) || null;

    // Get the simple selector
    $exec = $exec[1];

    // If the selector is an ID lookup, return the first element with the ID
    if ($exec[0] == '#')
        return this.getElementById($exec.substr(1)) || null;

    // Get the elements from the tags lookup
    var $elements = this.getElementsByTagName($exec);

    // If any elements were found in the lookup, return the first element
    if ($elements && $elements.length > 0)
        return $elements[0];

    return null;
});
$_method(__Document__, '__query',    function($selectors)
{
    // If the selectors are not a primitive string, return an empty array
    if (!$selectors || typeof $selectors != 'string')
        return [];

    // Return the queried elements matching any of the selectors
    return $_array($_query(this, $selectors));
});

// ########## ELEMENT ##########
$_method(__Element__, '__after',    function($element)
{
    // If the argument is not an instance of an Element or this element doesn't have a parent, return this
    if (!$element || !($element instanceof __Element) || !this.parentNode)
        return this;

    // Insert the element after this element
    this.parentNode.insertBefore($element, this.nextElementSibling);

    return this;
});
$_method(__Element__, '__append',   function($element)
{
    // If the argument is not an instance of an Element, return this
    if (!$element || !($element instanceof __Element))
        return this;

    // Append the element
    this.appendChild($element);

    return this;
});
$_method(__Element__, '__attr',     function($name, $value)
{
    // If the value isn't undefined
    if ($value !== undefined)
    {
        // If the name isn't a primitive string, return this
        if (typeof $name != 'string')
            return this;

        // If the value is either null or false, remove the attribute
        if ($value === null || $value === false)
            this.removeAttribute($name);
        // If the value is a primitive string, set the attribute
        else if (typeof $value == 'string')
            this.setAttribute($name, $value);
        // If the value is true, set the property
        else if ($value === true)
            this.setAttribute($name, $name);
        // If the value is a primitive number, set the attribute
        else if (typeof $value == 'number')
            this.setAttribute($name, $value.toString());

        return this;
    }

    // If the name is a primitive string
    if (typeof $name == 'string')
    {
        // If this element doesn't have the attribute, return null
        if (!this.hasAttribute($name))
            return null;

        // Get the attribute value from this element
        var $attr = this.getAttribute($name);

        // If the attribute value is a primitive string, return it
        if (typeof $attr == 'string')
            return $attr;

        // If the attribute value is a primitive number or boolean, return it as a string
        if (typeof $attr == 'number' || typeof $attr == 'boolean')
            return $attr.toString();

        return '';
    }
    // If the name is undefined
    else if ($name === undefined)
    {
        // If this element doesn't have any attributes, return an empty object
        if (!this.hasAttributes())
            return {};

        // Get the attributes
        var $attrs  = this.attributes,
            $object = {};

        for (var $i = 0, $j = $attrs.length; $i < $j; $i++)
        {
            // Get the current attribute
            var $attr = $attrs[$i];

            // If there is no attribute, continue
            if (!$attr)
                continue;

            // Get the attribute name and value
            var $attrName  = $attr.name,
                $attrValue = $attr.value;

            // If the attribute name isn't a primitive string, continue
            if (typeof $attrName != 'string')
                continue;

            // Set the attribute in the attributes object
            $object[$attrName] = typeof $attrValue == 'string' ?
                                 $attrValue :
                                 typeof $attrValue == 'number' || typeof $attrValue == 'boolean' ?
                                 $attrValue.toString() :
                                 '';
        }

        return $object;
    }
    // If the name is an object (and not any other built-in type), set each attribute in the object
    else if ($name && $__toString__.call($name) == '[object Object]')
        for (var $key in $name)
            this.__attr($key, $name[$key]);

    return this;
});
$_method(__Element__, '__before',   function($element)
{
    // If the argument is not an instance of an Element or this element doesn't have a parent, return this
    if (!$element || !($element instanceof __Element) || !this.parentNode)
        return this;

    // Insert the element before this element
    this.parentNode.insertBefore($element, this);

    return this;
});
$_method(__Element__, '__child',    function($index)
{
    // If the element has no children or the index is not a primitive number, return null
    if (!this.childElementCount || typeof $index != 'number')
        return null;

    // If the index is a negative offset, adjust it
    if ($index < 0)
        $index += this.childElementCount;

    // Return the child element at the index
    return this.children[$index] || null;
});
$_method(__Element__, '__children', function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    // Get all the child elements in this element
    var $array = new $__array(!$selectors ? this.childElementCount : 0);

    // If the element has no children, return an empty array
    if (!$selectors && !$array.length)
        return $array;

    for (var $i = 0, $j = this.childElementCount; $i < $j; $i++)
    {
        // Get the current child element
        var $item = this.children[$i];

        // If there are no selectors, set the element in the array
        if (!$selectors)
            $array[$i] = $item;
        // If the element matches any of the selectors, push it into the array
        else if ($item && $item[__matches]($selectors))
            $array.push($item);
    }

    return $array;
});
$_method(__Element__, '__contains', function($element)
{
    // If the argument is not an instance of an Element, return false
    if (!$element || !($element instanceof __Element))
        return false;

    // Return true if this element contains the element
    return !!this.contains($element);
});
$_method(__Element__, '__find',     function($selectors)
{
    // If the selectors are not a primitive string, return null
    if (!$selectors || typeof $selectors != 'string')
        return null;

    // Return the first element matching any of the selectors
    return $_find(this, $selectors) || null;
});
$_method(__Element__, '__first',    function($selectors)
{
    // If this element has no children, return null
    if (!this.childElementCount)
        return null;

    // If the selectors are not a primitive string, return the first child
    if (!$selectors || typeof $selectors != 'string')
        return this.firstElementChild || null;

    for (var $i = 0, $j = this.childElementCount; $i < $j; $i++)
    {
        // Get the current child element
        var $item = this.children[$i];

        // If the element matches any of the selectors, return it
        if ($item && $item[__matches]($selectors))
            return $item;
    }

    return null;
});
$_method(__Element__, '__html',     function($content)
{
    // If the content is undefined
    if ($content === undefined)
    {
        // Get the HTML of this element
        var $html = this.innerHTML;

        // If the HTML is a primitive string, return it
        if (typeof $html == 'string')
            return $html;

        return '';
    }

    // If the content is a primitive string, set the HTML of this element to the content string
    if (typeof $content == 'string')
        this.innerHTML = $content;
    // If the content is null, reset the HTML of this element
    else if ($content === null)
        this.innerHTML = '';
    // If the content is a primitive number or boolean, set the HTML of this element as the string value of the content
    else if (typeof $content == 'number' || typeof $content == 'boolean')
        this.innerHTML = $content.toString();

    return this;
});
$_method(__Element__, '__last',     function($selectors)
{
    // If this element has no children, return null
    if (!this.childElementCount)
        return null;

    // If the selectors are not a primitive string, return the last child
    if (!$selectors || typeof $selectors != 'string')
        return this.lastElementChild || null;

    for (var $i = this.childElementCount - 1; $i >= 0; $i--)
    {
        // Get the current child element
        var $item = this.children[$i];

        // If the element matches any of the selectors, return it
        if ($item && $item[__matches]($selectors))
            return $item;
    }

    return null;
});
$_method(__Element__, '__matches',  function($selectors)
{
    // If the selectors are not a primitive string, return false
    if (!$selectors || typeof $selectors != 'string')
        return false;

    // Return true if this element matches any of the selectors
    return !!this[__matches]($selectors);
});
$_method(__Element__, '__next',     function($selectors)
{
    // Get the next sibling
    var $next = this.nextElementSibling;

    // If this element doesn't have a next sibling, return null
    if (!$next)
        return null;

    // If the selectors are not a primitive string or the next sibling matches any of the selectors, return it
    if (!$selectors || typeof $selectors != 'string' || $next[__matches]($selectors))
        return $next;

    return null;
});
$_method(__Element__, '__parent',   function($selectors)
{
    // If the selectors are not a primitive string, reset the selectors
    if ($selectors != null && typeof $selectors != 'string')
        $selectors = '';

    // Get the parent element of this element
    var $parent = this.parentNode;

    // If the parent is an instance of an Element and matches any of the selectors, return it
    if ($parent instanceof __Element && (!$selectors || $parent[__matches]($selectors)))
        return $parent;

    return null;
});
$_method(__Element__, '__prepend',  function($element)
{
    // If the argument is not an instance of an Element, return this
    if (!$element || !($element instanceof __Element))
        return this;

    // Prepend the element
    this.insertBefore($element, this.firstChild);

    return this;
});
$_method(__Element__, '__prev',     function($selectors)
{
    // Get the previous sibling
    var $prev = this.previousElementSibling;

    // If this element doesn't have a previous sibling, return null
    if (!$prev)
        return null;

    // If the selectors are not a primitive string or the previous sibling matches any of the selectors, return it
    if (!$selectors || typeof $selectors != 'string' || $prev[__matches]($selectors))
        return $prev;

    return null;
});
$_method(__Element__, '__query',    function($selectors)
{
    // If the selectors are not a primitive string, return an empty array
    if (!$selectors || typeof $selectors != 'string')
        return [];

    // Return the queried elements matching any of the selectors
    return $_array($_query(this, $selectors));
});
$_method(__Element__, '__remove',   function()
{
    // If this element doesn't have a parent, return this
    if (!this.parentNode)
        return this;

    // Return the removed element
    return this.parentNode.removeChild(this) || this;
});
$_method(__Element__, '__replace',  function($element)
{
    // If the argument is not an instance of an Element or this element doesn't have a parent, return this
    if (!$element || !($element instanceof __Element) || !this.parentNode)
        return this;

    // Replace this element with the element
    this.parentNode.replaceChild($element, this);

    return this;
});
$_method(__Element__, '__style',    function($property, $value)
{
    // If the value isn't undefined
    if ($value !== undefined)
    {
        // If the property isn't a primitive string, return this
        if (typeof $property != 'string')
            return this;

        // If the value is null, remove the property
        if ($value === null)
            this.style.removeProperty($property);
        // If the value is a primitive string
        else if (typeof $value == 'string')
        {
            // Get the last index of the ! operator
            var $index = $value.lastIndexOf('!');

            // If the value ends with "!important", set the important property
            if ($index >= 0 && $value.substr($index + 1).trim().toLowerCase() == 'important')
                this.style.setProperty($property, $value.substr(0, $index).trim(), 'important');
            // Set the property
            else
                this.style.setProperty($property, $value);
        }
        // If the value is a primitive number or boolean, set the property
        else if (typeof $value == 'number' || typeof $value == 'boolean')
            this.style.setProperty($property, $value.toString());

        return this;
    }

    // If the property is a primitive string
    if (typeof $property == 'string')
    {
        // Get the computed style of this element
        var $style = $_window.getComputedStyle(this);

        // Get the property value from the computed style
        $style = $style.getPropertyValue($property);

        // If the property value is a primitive string, return it
        if (typeof $style == 'string')
            return $style;

        // If the property value is a primitive number or boolean, return it as a string
        if (typeof $style == 'number' || typeof $style == 'boolean')
            return $style.toString();

        return '';
    }
    // If the name is undefined
    else if ($property === undefined)
    {
        // Get the computed style of this element
        var $style  = $_window.getComputedStyle(this),
            $object = {};

        for (var $key in $style)
        {
            // Get the style value
            var $styleValue = $style.getPropertyValue($key);

            // If the style value is a primitive string, set the style in the styles object
            if (typeof $styleValue == 'string')
                $object[$key] = $styleValue;
            // If the style value is a primitive number or boolean, set the style value in the styles object as a string
            else if (typeof $styleValue == 'number' || typeof $styleValue == 'boolean')
                $object[$key] = $styleValue.toString();
        }

        return $object;
    }
    // If the name is an object (and not any other built-in type), set each property in the object
    else if ($property && $__toString__.call($property) == '[object Object]')
        for (var $key in $property)
            this.__style($key, $property[$key]);

    return this;
});
$_method(__Element__, '__text',     function($content)
{
    // If the content is undefined
    if ($content === undefined)
    {
        // Get the text of this element
        var $text = this.textContent;

        // If the text is a primitive string, return it
        if (typeof $text == 'string')
            return $text;

        return '';
    }

    // If the content is a primitive string, set the text of this element to the content string
    if (typeof $content == 'string')
        this.textContent = $content;
    // If the content is null, reset the text of this element
    else if ($content === null)
        this.textContent = '';
    // If the content is a primitive number or boolean, set the text of this element as the string value of the content
    else if (typeof $content == 'number' || typeof $content == 'boolean')
        this.textContent = $content.toString();

    return this;
});

$_accessor(__Element__, '__document', function()
{
    // Return the owner document of this element
    return this.ownerDocument || null;
}, null, false, true);
$_accessor(__Element__, '__length',   function()
{
    // Return the number of children in this element
    return this.childElementCount || 0;
}, null, false, true);
$_accessor(__Element__, '__tag',      function()
{
    // Return the tag name of this element
    return this.nodeName || '';
}, null, false, true);

})(this);