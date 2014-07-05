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

// ########## TOKEN ##########
var Token   = function($type, $source, $start, $end)
{
    // Set the token parameters
    this.type   = $type;
    this.source = $source;
    this.start  = $start;
    this.end    = $end;
},
  __Token__ = Token.prototype = {};

// --- PROTOTYPE ---
__Token__.end    = 0;
__Token__.source = '';
__Token__.start  = 0;
__Token__.type   = '';

$_data(__Token__, 'clone',  function()
{
    // Return a copy of this token
    return new Token(this.type,
                     this.source,
                     this.start,
                     this.end);
}, true);
$_data(__Token__, 'equals', function($token)
{
    // Return true if the token has the same type and text
    return (this.type   === $token.type
         && this.text() === $token.text());
}, true);
$_data(__Token__, 'html',   function()
{
    // Create the HTML text of the token
    var $text = this.text().replace($_const_entity_search, $_entity);

    // If the token doesn't have a type or it is either whitespace or plain text, return the HTML text
    if (!this.type || $_lexer_whitespace(this.type) || $_lexer_text(this.type))
        return $text;

    // Return the HTML of the token
    return '<span class="' + $_const_class_prefix + this.type + '">' + $text + '</span>';
}, true);
$_data(__Token__, 'node',   function()
{
    // If the token doesn't have a type or it is either whitespace or plain text, return a text node of the token text
    if (!this.type || $_lexer_whitespace(this.type) || $_lexer_text(this.type))
        return document.createTextNode(this.text());

    // Create the element
    var $element = document.createElement('span');

    // If the token has a type, set the element class
    if (this.type)
        $element.setAttribute('class', $_const_class_prefix + this.type);

    // Set the element text
    $element.innerText = this.text();

    // Return the element
    return $element;
}, true);
$_data(__Token__, 'text',   function()
{
    // Return the token text from the source
    return this.source.substring(this.start, this.end);
}, true);