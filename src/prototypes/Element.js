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
            $array[$i] = $item || null;
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