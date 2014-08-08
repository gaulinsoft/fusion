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

// ########## HIGHLIGHTER ##########
var Highlighter   = function($source, $language)
{
    // If source code was provided, create the lexer
    if ($source)
        this.lexer = new Lexer($source, $language);
},
  __Highlighter__ = Highlighter.prototype = {};

// --- HELPERS ---
var $_highlighter_clone = function($v, $i, $a)
{
    // Return a clone of the value
    return $v.clone();
};

// --- PROTOTYPE ---
__Highlighter__._token   = null;
__Highlighter__.chain    = null;
__Highlighter__.lexer    = null;
__Highlighter__.previous = null;

$_data(__Highlighter__, 'clone',  function()
{
    // Create an empty highlighter
    var $highlighter = new Highlighter();

    // Copy the highlighter parameters
    $highlighter.chain =    this.chain ?
                            this.chain.map($_highlighter_clone) :
                            null;
    $highlighter.lexer    = this.lexer ?
                            this.lexer.clone() :
                            null;
    $highlighter.previous = this.previous ?
                            this.previous.clone() :
                            null;

    return $highlighter;
}, true);
$_data(__Highlighter__, 'equals', function($highlighter)
{
    // If the highlighters don't have matching lexers, return false
    if (!this.lexer != !$highlighter.lexer || this.lexer && !this.lexer.equals($highlighter.lexer))
        return false;

    // Get the scope chains
    var $chainHighlighter = $highlighter.chain,
        $chainThis        = this.chain;

    // If the highlighters don't have matching scope chain lengths, return false
    if (($chainThis && $chainThis.length || 0) != ($chainHighlighter && $chainHighlighter.length || 0))
        return false;

    // If the highlighters don't have matching previous tokens, return false
    if (!this.previous != !$highlighter.previous || this.previous && !this.previous.equals($highlighter.previous))
        return false;

    // If the highlighters have scope chains, return false if they are not equal
    if ($chainThis)
        for (var $i = 0, $j = $chainThis.length; $i < $j; $i++)
            if (!$chainThis[$i].equals($chainHighlighter[$i]))
                return false;

    return true;
}, true);
$_data(__Highlighter__, 'next',   function()
{
    // If there's no lexer, return null
    if (!this.lexer)
        return null;

    // Get the next token from the lexer
    var $lexer    = this.lexer,
        $token    = this._token || $lexer.next(),
        $chain    = this.chain,
        $previous = this.previous;

    // If there's no token, return null
    if (!$token)
        return null;

    // Set the previous token
    this.previous = $lexer.token;

    // Get the token type
    var $type = $token.type;

    // If the token opens a DOCTYPE
    if (!this._token && $type == 'HTMLDOCTYPEOpen')
    {
        // Create two copies of the token
        this._token = $token.clone();
        $token      = $token.clone();

        // Trim the first character from the cached token
        this._token.start++;
        this._token.type = 'HTMLDOCTYPEDeclaration';

        // Trim all but the first character from the copied token
        $token.end = $token.start + 1;
    }
    // If there's a cached token, remove it
    else if (this._token)
        this._token = null;

    // If the token isn't a CSS token, return it
    if (!$_startsWith($type, 'CSS'))
        return $token;

    // If this is the first CSS token, create the CSS scope chain
    if (!$chain)
        $chain = this.chain = [];

    // If there's no previous token or the previous token was neither a CSS token nor a fusion substitution closing token
    if (!$previous || !$_startsWith($previous.type, 'CSS') && $previous.type != 'FusionObjectSubstitutionClose'
                                                           && $previous.type != 'FusionSelectorSubstitutionClose'
                                                           && $previous.type != 'FusionStyleSubstitutionClose')
        // Unshift the selector state into the scope chain
        $chain.unshift('*');

    // If the token is either whitespace or a comment, return it
    if ($_lexer_whitespace($type) || $_lexer_comment($type))
        return $token;

    // Get the current context and CSS punctuator
    var $scope      = $chain[0],
        $group      = null,
        $punctuator = $type == 'CSSPunctuator' ?
                      $token.text() :
                      null;

    // If the current token is an opening brace
    if ($punctuator == '{')
    {
        // If the current context is neither a qualified rule or an at-rule
        if ($scope != '*' && $scope != '@')
        {
            // Unshift a qualified rule context into the scope chain
            $scope = '*{';
            $chain.unshift($scope);
        }
        // Append the current character to the current context
        else
            $scope += $chain[0] += $punctuator;
    }
    // If the current token is a closing brace
    else if ($punctuator == '}')
    {
        // If the current context is a qualified rule block
        if ($scope == '*{' || $scope == '*{:')
        {
            // If the current context isn't the top-level context
            if ($chain.length > 1)
            {
                // Shift the current context from the scope chain and get the parent context
                $chain.shift();
                $scope = $chain[0];
            }
            // Reset the current context
            else
                $scope = $chain[0] = '*';
        }
        // If the current context is an at-rule block
        else if ($scope == '@{' || $scope == '@{:')
        {
            // Shift the current context from the scope chain and get the parent context
            $chain.shift();
            $scope = $chain[0];
        }
    }
    // If the current token is a semi-colon
    else if ($type == 'CSSSemicolon')
    {
        // If the current context is an at-rule without a block
        if ($scope == '@')
        {
            // Shift the current context from the scope chain and get the parent context
            $chain.shift();
            $scope = $chain[0];
        }
        // If the current context is a declaration value, set the current context as a declaration name context
        else if ($scope == '*{:' || $scope == '@{:')
            $scope = $chain[0] = $scope[0] + '{';
    }
    // If the current token is a colon and the current context is a declaration name, append the current character to the current context
    else if ($type == 'CSSColon' && ($scope == '*{' || $scope == '@{'))
        $scope += $chain[0] += ':';
    else
    {
        // If the current token is an at-keyword and the current context opens an at-rule
        if ($type == 'CSSAtKeyword' && ($scope == '*'
                                     || $scope == '*{'
                                     || $scope == '@{'))
        {
            // Unshift an at-rule context into the scope chain
            $scope = '@';
            $chain.unshift($scope);
        }

        // Get the next token if the current context is an at-rule declaration name
        var $peek = $scope == '@{' && $type == 'CSSIdentifier' ?
                    $lexer.peek($token.end) :
                    null;

        // Get the group type from the tokens and context
        $group = $scope == '*{' && $type == 'CSSIdentifier' || $peek && $peek.type == 'CSSColon' ?
                 'CSSDeclarationName' :
                 $scope == '*{:' || $scope == '@{:' ?
                 'CSSDeclarationValue' :
                 $scope == '*' || $scope == '@{' ?
                 'CSSSelector' :
                 $scope == '@' ?
                 'CSSAtRule' :
                 null;

        // If the current context is a declaration value context
        if ($scope == '*{:' || $scope == '@{:')
        {
            // If the current token is the `!` delimiter
            if ($type == 'CSSDelimiter' && $token.text() == '!')
            {
                // Get the next token
                $peek = $lexer.peek($token.end);

                // If the next token is the `important` identifier
                if ($peek && $peek.type == 'CSSIdentifier' && $peek.text().toLowerCase() == 'important')
                {
                    // Get the next token
                    $peek = $lexer.peek($peek.end);

                    // If the next token is either a semi-colon or closing brace, set the important declaration group type
                    if ($peek && ($peek.type == 'CSSSemicolon' || $peek.type == 'CSSPunctuator' && $peek.text() == '}'))
                        $group = 'CSSDeclarationImportant';
                }
            }
            // If the previous token was the `!` delimiter and the current token is the `important` identifier
            else if ($previous && $previous.type == 'CSSDelimiter' && $previous.text() == '!' && $type == 'CSSIdentifier' && $token.text().toLowerCase() == 'important')
            {
                // Get the next token
                $peek = $lexer.peek($token.end);

                // If the next token is either a semi-colon or closing brace, set the important declaration group type
                if ($peek && ($peek.type == 'CSSSemicolon' || $peek.type == 'CSSPunctuator' && $peek.text() == '}'))
                    $group = 'CSSDeclarationImportant';
            }
        }
    }

    // If there isn't a group type, return the token
    if (!$group)
        return $token;

    // Create a clone of the token and set the group type
    $token = $token.clone();
    $token.type = $group;

    return $token;
}, true);
$_data(__Highlighter__, 'reset',  function()
{
    // Reset the chain and previous token
    this.chain    = null;
    this.previous = null;

    // If there's a lexer, reset it
    if (this.lexer)
        this.lexer.reset();
}, true);