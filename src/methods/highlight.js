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
$_defineMethod('highlight', function($source, $language, $strict)
{
    // Create the highlighter, HTML string, and token
    var $highlighter = new Highlighter($source, $language || 'fjs'),
        $html        = '',
        $token       = null;

    // If the strict flag isn't set and the highlighter has a lexer, hack it
    if (!$strict && $highlighter.lexer)
        $highlighter.lexer.hack();

    // Append the HTML of each token to the HTML string
    while ($token = $highlighter.next())
        $html += $token.html();

    return $html;
});