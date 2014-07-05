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

// ########## HIGHLIGHT() ##########
$_defineMethod('highlight', function($source, $language)
{
    // Create the lexer, HTML string, tokens, and CSS scope chain
    var $lexer    = new Lexer($source, $language),
        $html     = '',
        $previous = null,
        $token    = null,
        $chain    = null;

    // Get the next token from the lexer
    while ($token = $lexer.next())
    {
        // If the token isn't a CSS token
        if (!$_startsWith($token.type, 'CSS'))
        {
            // Append the token HTML to the HTML string and set the previous token
            $html    += $token.html();
            $previous = $lexer.token;

            continue;
        }

        // If this is the first CSS token, create the CSS scope chain
        if ($chain == null)
            $chain = [];

        // If there's no previous token or the previous token was neither a CSS token nor a fusion substitution closing token
        if (!$previous || !$_startsWith($previous.type, 'CSS') && $previous.type != 'FusionObjectSubstitutionClose'
                                                               && $previous.type != 'FusionSelectorSubstitutionClose'
                                                               && $previous.type != 'FusionStyleSubstitutionClose')
            // Unshift the selector state into the scope chain
            $chain.unshift('*');

        // Get the token type
        var $type = $token.type;

        // If the token is whitespace
        if ($_lexer_whitespace($type))
        {
            // Append the token HTML to the HTML string
            $html += $token.html();

            continue;
        }

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

        // If a group type was set
        if ($group)
        {
            // Create a clone of the current token
            var $tokenGroup = $token.clone();

            // Set the cloned token type to the group type
            $tokenGroup.type = $group;

            // Append the cloned token HTML to the HTML string
            $html += $tokenGroup.html();
        }
        // Append the token HTML to the HTML string
        else
            $html += $token.html();

        // Set the lexer previous token as the previous token
        $previous = $lexer.token;
    }

    return $html;
});