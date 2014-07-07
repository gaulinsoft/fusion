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

// ########## TOKENIZE() ##########
$_defineMethod('tokenize', function($source, $language, $strict)
{
    // Create the lexer, token, and tokens array
    var $lexer  = new Lexer($source, $language || 'fjs'),
        $token  = null,
        $tokens = [];

    // If the strict flag isn't set, hack the lexer
    if (!$strict)
        $lexer.hack();

    // Push each token from the lexer into the tokens array
    while ($token = $lexer.next())
        $tokens.push(
        {
            type:  $token.type,
            start: $token.start,
            end:   $token.end
        });

    return $tokens;
});