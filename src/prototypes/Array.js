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