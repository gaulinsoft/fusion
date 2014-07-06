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