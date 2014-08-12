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

// ########## PARSER ##########
var Parser   = function()
{
    // Call the base constructor
    Lexer.apply(this, arguments);

    // Hack the lexer
    this.hack();

    // Create the AST
    this.tree = [];
},
  __Parser__ = Parser.prototype = $__create(__Lexer__);

// --- HELPERS ---
var $_parser_clone = function($v, $i, $a)
{
    //
};

// --- PROTOTYPE ---
__Parser__._clone = Parser;
__Parser__.errors = null;
__Parser__.tree   = null;

$_data(__Parser__, 'build',  function()
{
    // Tokenize the source
    while (this.next());

    // Return the AST
    return this.tree;
}, true);
$_data(__Parser__, 'clone',  function()
{
    // Create a clone of the lexer as a parser
    var $parser = __Lexer__.clone.apply(this, arguments);

    // Copy the parser parameters
    $parser.errors = this.errors ?
                     this.errors.slice(0) :
                     null;
    $parser.tree   = this.tree.map($_parser_clone);

    return $parser;
}, true);
$_data(__Parser__, 'equals', function($parser)
{
    // If a parser wasn't provided, return false
    if (!($parser instanceof Parser))
        return false;

    // If the parsers don't have matching lexers, return false
    if (!__Lexer__.equals.apply(this, arguments))
        return false;

    //

    return true;
}, true);
$_data(__Parser__, 'next',   function()
{
    // Get the next token from the lexer
    var $token = __Lexer__.next.apply(this, arguments);

    // If there's no token, return null
    if (!$token)
        return null;

    // Get the token type
    var $type = $token.type;

    // 
}, true);
$_data(__Parser__, 'reset',  function()
{
    // Reset the lexer
    __Lexer__.reset.apply(this, arguments);

    // Hack the lexer
    this.hack();

    // Reset the errors array and AST
    this.errors = null;
    this.tree   = [];
}, true);