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