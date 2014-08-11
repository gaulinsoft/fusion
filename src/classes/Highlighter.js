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
    // Call the base constructor
    Lexer.apply(this, arguments);

    // If a language wasn't provided, return
    if (!$language)
        return;

    // Create the CSS scope chain
    this.styleChain = $language == 'fjs'
                   || $language == 'fhtml'
                   || $language == 'fcss' ?
                      [] :
                      null;
},
  __Highlighter__ = Highlighter.prototype = $__create(__Lexer__);

// --- HELPERS ---
var $_highlighter_clone = function($v, $i, $a)
{
    // Return a clone of the value
    return $v.clone();
};

// --- PROTOTYPE ---
__Highlighter__._clone     = Highlighter;
__Highlighter__._token     = null;
__Highlighter__.styleChain = null;

$_data(__Highlighter__, 'clone',  function()
{
    // Create a clone of the lexer as a highlighter
    var $highlighter = __Lexer__.clone.apply(this, arguments);

    // Copy the highlighter parameters
    $highlighter._token     = this._token ?
                              this._token.clone() :
                              null;
    $highlighter.styleChain = this.styleChain ?
                              this.styleChain.map($_highlighter_clone) :
                              null;

    return $highlighter;
}, true);
$_data(__Highlighter__, 'equals', function($highlighter)
{
    // If a highlighter wasn't provided, return false
    if (!($highlighter instanceof Highlighter))
        return false;

    // If the highlighters don't have matching lexers, return false
    if (!__Lexer__.equals.apply(this, arguments))
        return false;

    // Get the CSS scope chains
    var $chainHighlighter = $highlighter.styleChain,
        $chainThis        = this.styleChain;

    // If the highlighters don't have matching CSS scope chain lengths, return false
    if (($chainThis && $chainThis.length || 0) != ($chainHighlighter && $chainHighlighter.length || 0))
        return false;

    // If the highlighters don't have matching cached tokens, return false
    if (!this._token != !$highlighter._token || this._token && !this._token.equals($highlighter._token))
        return false;

    // If the highlighters have CSS scope chains, return false if they are not equal
    if ($chainThis)
        for (var $i = 0, $j = $chainThis.length; $i < $j; $i++)
            if (!$chainThis[$i].equals($chainHighlighter[$i]))
                return false;

    return true;
}, true);
$_data(__Highlighter__, 'hack',   function()
{
    // If a CSS scope chain already exists, return false
    if (this.styleChain)
        return false;

    // Hack the lexer
    __Lexer__.hack.apply(this, arguments);

    // Get the language
    var $language = this.language;

    // Create the CSS scope chain
    this.styleChain = $language == 'fjs'
                   || $language == 'html'
                   || $language == 'fhtml'
                   || $language == 'css'
                   || $language == 'fcss' ?
                      [] :
                      null;

    // Return true if a CSS scope chain was created
    return !!this.styleChain;
}, true);
$_data(__Highlighter__, 'next',   function()
{
    // Get the next token from the lexer
    var $previous = this.token,
        $token    = this._token || __Lexer__.next.apply(this, arguments),
        $chain    = this.styleChain;

    // If there's no token, return null
    if (!$token)
        return null;

    // Get the token type
    var $type = $token.type;

    // If the token opens a DOCTYPE
    if (!this._token && $type == 'HTMLDOCTYPEOpen')
    {
         // Create a cached copy of the token
        this._token = $token.clone();

        // Trim the first character from the cached token
        this._token.start++;
        this._token.type = 'HTMLDOCTYPEDeclaration';

        // Trim all but the first character from the token
        $token.end = $token.start + 1;
    }
    // If there's a cached token, remove it
    else if (this._token)
        this._token = null;

    // If the highlighter doesn't have a CSS scope chain, return the token
    if (!$chain)
        return $token;

    // If the token isn't a CSS token
    if (!$_startsWith($type, 'CSS'))
    {
        // If there's no previous token, the previous token was not a CSS token, or the current token is a fusion substitution opening token
        if (!$previous || !$_startsWith($previous.type, 'CSS') || $type == "FusionObjectSubstitutionOpen"
                                                               || $type == "FusionSelectorSubstitutionOpen"
                                                               || $type == "FusionStyleSubstitutionOpen")
            return $token;
        
        var $last = null;

        do
        {
            // If the CSS scope chain is empty, break
            if (!$chain.length)
                break;

            // Pop the last scope from the chain
            $last = $chain.pop();
        }
        // Continue if the removed scope wasn't a selector context
        while ($last && $last != '*');

        return $token;
    }

    // If the token is either whitespace or a comment, return it
    if ($_lexer_whitespace($type) || $_lexer_comment($type))
        return $token;

    // If there's no previous token or the previous token was neither a CSS token nor a fusion substitution closing token
    if (!$previous || !$_startsWith($previous.type, 'CSS') && $previous.type != 'FusionObjectSubstitutionClose'
                                                           && $previous.type != 'FusionSelectorSubstitutionClose'
                                                           && $previous.type != 'FusionStyleSubstitutionClose')
        // Push the selector context into the scope chain
        $chain.push('*');

    // If the previous token was a fusion object opening punctuator, push a qualified rule context into the scope chain
    if ($previous && $previous.type == 'FusionObjectOpen')
        $chain.push('*{');

    // Get the current context and CSS punctuator
    var $current    = $chain.length - 1,
        $scope      = $current >= 0 ?
                      $chain[$current] :
                      null,
        $punctuator = $type == 'CSSPunctuator' ?
                      $token.text() :
                      null;

    // If the current token is an opening brace
    if ($punctuator == '{')
    {
        // If the current context is an at-rule scope, set the scope as an at-rule block
        if ($scope == '@')
            $chain[$current] = $scope + '{';
        // Push a qualified rule context into the scope chain
        else
            $chain.push('*{');
    }
    // If the current token is a closing brace
    else if ($punctuator == '}')
    {
        // If the current context isn't a selector context, pop it from the scope chain
        if ($scope && $scope != '*')
            $chain.pop();
    }
    // If the current token is a semi-colon
    else if ($type == 'CSSSemicolon')
    {
        // If the current context is a declaration value, set the current context as a declaration name context
        if ($scope == '*{:' || $scope == '@{:')
            $chain[$current] = $scope[0] + '{';
        // If the current context is an at-rule without a block, pop it from the scope chain
        else if ($scope == '@')
            $chain.pop();
    }
    // If the current token is a colon and the current context is a declaration name, append the current character to the current context
    else if ($type == 'CSSColon' && ($scope == '*{' || $scope == '@{'))
        $chain[$current] = $scope + ':';
    else
    {
        // Get the next token if the current context is an at-rule declaration name
        var $peek = $scope == '@{' && $type == 'CSSIdentifier' ?
                    this.peek($token.end) :
                    null;

        // If the current token is an at-keyword and the current context can open an at-rule
        if ($type == 'CSSAtKeyword' && ($scope == '*'
                                     || $scope == '*{'
                                     || $scope == '@{'))
        {
            // Push an at-rule context into the scope chain
            $chain.push('@');

            // Set the token type
            $token.type = 'CSSAtRule';
        }
        // Set the token type from the tokens and current context
        else
            $token.type = $scope == '*{' && $type == 'CSSIdentifier' || $peek && $peek.type == 'CSSColon' ?
                          'CSSDeclarationName' :
                          $scope == '*{:' || $scope == '@{:' ?
                          'CSSDeclarationValue' :
                          $scope == '*' || $scope == '@{' ?
                          'CSSSelector' :
                          $scope == '@' ?
                          'CSSAtRule' :
                          'CSSInvalidCharacters';

        // If the current context is a declaration value context
        if ($scope == '*{:' || $scope == '@{:')
        {
            // If the current token is the `!` delimiter
            if ($type == 'CSSDelimiter' && $token.text() == '!')
            {
                // Get the next token
                $peek = this.peek($token.end);

                // If the next token is the `important` identifier
                if ($peek && $peek.type == 'CSSIdentifier' && $peek.text().toLowerCase() == 'important')
                {
                    // Get the next token
                    $peek = this.peek($peek.end);

                    // If the next token is either a semi-colon or closing brace, set the important declaration type
                    if ($peek && ($peek.type == 'CSSSemicolon' || $peek.type == 'CSSPunctuator' && $peek.text() == '}'))
                        $token.type = 'CSSDeclarationImportant';
                }
            }
            // If the previous token was the `!` delimiter and the current token is the `important` identifier
            else if ($previous && $previous.type == 'CSSDelimiter' && $previous.text() == '!' && $type == 'CSSIdentifier' && $token.text().toLowerCase() == 'important')
            {
                // Get the next token
                $peek = this.peek($token.end);

                // If the next token is either a semi-colon or closing brace, set the important declaration type
                if ($peek && ($peek.type == 'CSSSemicolon' || $peek.type == 'CSSPunctuator' && $peek.text() == '}'))
                    $token.type = 'CSSDeclarationImportant';
            }
        }
    }

    return $token;
}, true);
$_data(__Highlighter__, 'reset',  function()
{
    // Reset the lexer
    __Lexer__.reset.apply(this, arguments);

    // Reset the CSS scope chain and cached token
    this._token     = null;
    this.styleChain = null;
}, true);