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

// ########## TRANSPILE() ##########
$_defineMethod('transpile', function($source, $create, $find, $query, $attr, $html)
{
    // for now this is just a rough outline that works with Lexer tokens until a Parser is ready

    var $lexer    = new Lexer($source, 'fjs'),
        $code     = '',
        $token    = null,
        $previous = null,
        $tags     = [],
        $camel    = function($0, $1){ return $1.toUpperCase(); };

    while ($token = $lexer.next())
    {
        if ($token.type == 'FusionSelector' || $token.type == 'FusionSelectorSubstitutionClose')
        {
            var $selector = "",
                $open     = $token.type == 'FusionSelector',
                $close    = true;

            while ($token = $lexer.next())
            {
                if ($token.type == 'FusionSelectorSubstitutionOpen')
                {
                    $selector += '".concat(';
                    $close     = false;

                    continue;
                }
                else if ($token.type == 'FusionSelectorSubstitutionClose')
                {
                    $selector += ')+"';
                    $close     = true;

                    continue;
                }
                else if (!$_startsWith($token.type, 'CSS'))
                    break;

                if ($_lexer_comment($token.type))
                    continue;

                $selector += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');

                $previous = $lexer.token;
            }

            var $exec = /^\(\s*(head|html|body)\s*\)$/i.exec($selector);

            if (!$exec)
            {
                $code += !$open ?
                         ')+"' :
                         $selector[0] == '[' ?
                         ($query || 'document.__query') + '("' :
                         ($find  || 'document.__find')  + '("';
                $code += $selector.substr($open ? 1 : 0, $selector.length - ($open && $close ? 2 : 1));

                if ($close)
                    $code += '")';
            }
            else
            {
                var $tag = $exec[1].toLowerCase();

                $code += 'document.' + ($tag == 'html' ? 'documentElement' : $tag);
            }
        }
        else if ($token.type == 'FusionObject' || $token.type == 'FusionObjectSubstitutionClose')
        {
            var $value = $token.type != 'FusionObject';

            if ($value)
                $code += ')+"';

            while ($token = $lexer.next())
            {
                if ($token.type == 'FusionObjectSubstitutionOpen')
                {
                    if ($previous && $previous.type == 'CSSColon')
                        $code += '"';

                    $code += '".concat(';

                    continue;
                }
                else if ($token.type == 'FusionObjectSubstitutionClose')
                {
                    $code += ')+"';

                    continue;
                }
                else if (!$_startsWith($token.type, 'CSS'))
                    break;

                if ($_lexer_comment($token.type))
                    continue;

                var $space = $_lexer_whitespace($token.type) ?
                             $token :
                             null;

                if ($space)
                {
                    $token = $lexer.next();

                    if (!$token)
                    {
                        $code += $space.text();

                        break;
                    }
                }

                if ($value)
                {
                    if ($token.type == 'CSSPunctuator' && $token.text() == '}' && $lexer.state == 'fjs')
                    {
                        if (!$previous || $previous.type != 'CSSSemicolon')
                            $code += '"';

                        if ($space)
                            $code += $space.text();

                        $code += $token.text();

                        continue;
                    }
                    else if ($token.type == 'CSSSemicolon')
                    {
                        $code += '"';
                        $value = false;

                        if ($space)
                            $code += $space.text();

                        $previous = $lexer.token;

                        continue;
                    }
                    else if ($space)
                        $code += $space.text().replace(/\n/g, '\\n\\\n');

                    if ($token.type == 'FusionObjectSubstitutionOpen')
                        $code += '".concat(';
                    else if ($token.type == 'FusionObjectSubstitutionClose')
                        $code += ')+"';
                    else
                        $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                }
                else if ($token.type == 'CSSIdentifier' && $previous && ($previous.type == 'CSSPunctuator' && $previous.text() == '{' || $previous.type == 'CSSSemicolon'))
                {
                    if ($previous.type == 'CSSSemicolon')
                        $code += ',';

                    if ($space)
                        $code += $space.text();

                    $code += '"';
                    $code += $token.text().replace(/^-+/, '').replace(/-+([a-z])/ig, $camel);
                    $code += '"';
                }
                else if ($token.type == 'CSSColon')
                {
                    if ($space)
                        $code += $space.text();

                    $code += $token.text();
                }
                else if ($token.type == 'CSSSemicolon')
                {
                    if ($space)
                        $code += $space.text();
                }
                else if ($previous && $previous.type == 'CSSColon')
                {
                    if ($space)
                        $code += $space.text();

                    $value = true;

                    if ($lexer.state != 'fjs')
                        $code += '"';

                    if ($token.type == 'FusionObjectSubstitutionOpen')
                        $code += '".concat(';
                    else if ($token.type == 'FusionObjectSubstitutionClose')
                        $code += ')+"';
                    else
                        $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                }
                else
                {
                    if ($space)
                        $code += $space.text();

                    $code += $token.text();
                }

                $previous = $lexer.token;
            }
        }

        if (!$token)
            break;

        if ($token.type == 'FusionProperty')
            $code += '.__' + $token.text().substr(1);
        else if ($token.type == 'FusionSubstitutionOpen' || $token.type == 'FusionStyleSubstitutionOpen')
            $code += '".concat(';
        else if ($token.type == 'FusionSubstitutionClose' || $token.type == 'FusionStyleSubstitutionClose')
            $code += ')+"';
        else if ($token.type == 'HTMLStartTagOpen')
        {
            if ($tags.length)
                $code += $token.text();
        }
        else if ($token.type == 'HTMLStartTagName')
        {
            var $tag = $token.text();

            $tags.push($tag);

            $tag = $tag.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

            $code += $tags.length > 1 ?
                     $tag :
                     ($create || 'document.__create') + '("' + $tag + '")';
        }
        else if ($tags.length)
        {
            if ($token.type == 'HTMLStartTagClose')
            {
                if ($previous && ($previous.type == 'HTMLAttributeName' || $previous.type == 'HTMLAttributeOperator'))
                    $code += '"")';
                else if ($previous && ($previous.type == 'JavaScriptTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateStringTail'))
                    $code += ')';

                var $tag = $tags[$tags.length - 1];

                if ($tag == 'area'
                 || $tag == 'base'
                 || $tag == 'br'
                 || $tag == 'col'
                 || $tag == 'embed'
                 || $tag == 'hr'
                 || $tag == 'img'
                 || $tag == 'input'
                 || $tag == 'keygen'
                 || $tag == 'link'
                 || $tag == 'menuitem'
                 || $tag == 'meta'
                 || $tag == 'param'
                 || $tag == 'source'
                 || $tag == 'track'
                 || $tag == 'wbr')
                {
                    $tags.pop();

                    if ($tags.length)
                        $code += $token.text();
                }
                else
                    $code += $tags.length > 1 ?
                             $token.text() :
                             '.' + ($html || '__html') + '("';
            }
            else if ($token.type == 'HTMLEndTagOpen')
                $code += $tags.length > 1 ?
                         $token.text() :
                         '")';
            else if ($token.type == 'HTMLEndTagName')
            {
                var $tag = $token.text();

                if ($tag != $tags[$tags.length - 1])
                    throw 'unmatched <' + $tags[$tags.length - 1] + '> tag';

                if ($tags.length > 1)
                    $code += $tag.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            }
            else if ($token.type == 'HTMLStartTagSelfClose' || $token.type == 'HTMLEndTagClose' || $token.type == 'HTMLEndTagSelfClose')
            {
                if ($token.type == 'HTMLStartTagSelfClose' && $previous && $previous.type == 'HTMLAttributeName')
                    $code += '"")';
                else if ($token.type == 'HTMLStartTagSelfClose' && $previous && ($previous.type == 'JavaScriptTemplateString'
                                                                              || $previous.type == 'FusionAttributeTemplateString'
                                                                              || $previous.type == 'FusionAttributeTemplateStringTail'))
                    $code += ')';

                $tags.pop();

                if ($tags.length)
                    $code += $token.text();
            }
            else if ($tags.length == 1 && $token.type == 'HTMLAttributeName')
            {
                if ($previous && $previous.type == 'HTMLAttributeName')
                    $code += '"")';
                else if ($previous && ($previous.type == 'JavaScriptTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateStringTail'))
                    $code += ')';

                $code += '.' + ($attr || '__attr') + '("';
                $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                $code += '",';
            }
            else if ($tags.length == 1 && ($token.type == 'HTMLAttributeValue'
                                        || $token.type == 'HTMLAttributeDoubleQuotedValue'
                                        || $token.type == 'HTMLAttributeSingleQuotedValue'))
            {
                var $substring = $token.text();

                if ($token.type != 'HTMLAttributeValue')
                    $substring = $substring.substr(1, $substring.length - 2);

                $code += '"';

                for (var $i = 0, $j = $substring.length; $i < $j;)
                {
                    var $character = $substring[$i];

                    if ($character == '&')
                    {
                        var $peek = $substring[$i + 1];

                        if ($peek == '#')
                        {
                            $peek = $substring[$i + 2];

                            if ($peek == 'x' || $peek == 'X')
                            {
                                $peek = $substring[$i + 3];

                                if ($_hexadecimal($peek))
                                {
                                    $i += 3;

                                    var $hex = '';

                                    do
                                    {
                                        $character = $substring[$i];

                                        if (!$_hexadecimal($character))
                                            break;

                                        $hex += $character;
                                    }
                                    while (++$i < $j);

                                    if ($substring[$i++] != ';')
                                        $i--;

                                    while ($hex.length < 4)
                                        $hex = '0' + $hex;

                                    $code += '\\u';
                                    $code += $hex;

                                    continue;
                                }
                            }
                            else if ($peek >= '0' && $peek <= '9')
                            {
                                $i += 2;

                                var $number = '';

                                do
                                {
                                    $character = $substring[$i];

                                    if ($character < '0' || $character > '9')
                                        break;

                                    $number += $character;
                                }
                                while (++$i < $j);

                                if ($substring[$i++] != ';')
                                    $i--;

                                var $hex = $__parseInt($number, 10).toString(16);

                                while ($hex.length < 4)
                                    $hex = '0' + $hex;

                                $code += '\\u';
                                $code += $hex;

                                continue;
                            }
                        }
                        else if ($_letter($peek))
                        {
                            $i++;

                            var $reference = '&';

                            do
                            {
                                $character = $substring[$i];

                                if (!$_alphanumeric($character))
                                    break;

                                $reference += $character;
                            }
                            while (++$i < $j);

                            if ($substring[$i++] != ';')
                                $i--;
                            else
                                $reference += ';';

                            var $lookup = $_const_entities[$reference.substr(1)];

                            if ($__array_isArray($lookup))
                                $lookup = '\\u' + $_zerofill($lookup[0], 4) + '\\u' + $_zerofill($lookup[1], 4);
                            else if ($lookup)
                                $lookup = '\\u' + $_zerofill($lookup, 4);

                            $code += $lookup ?
                                     $lookup :
                                     $reference;

                            continue;
                        }
                    }
                    else if ($character == '"')
                    {
                        $code += '\\"';

                        $i++;

                        continue;
                    }
                    else if ($character == '\n')
                    {
                        $code += '\\n\\\n';

                        $i++;

                        continue;
                    }
                    else if ($character == '\\')
                    {
                        $code += '\\\\';

                        $i++;

                        continue;
                    }

                    $code += $character;

                    $i++;
                }

                $code += '")';
            }
            else if ($tags.length == 1 && $token.type == 'HTMLStartTagSolidus')
            {
                if ($previous && $previous.type == 'HTMLAttributeName')
                    $code += '"")';
                else if ($previous && ($previous.type == 'JavaScriptTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateStringTail'))
                    $code += ')';
            }
            else if ($token.type == 'JavaScriptTemplateString'
                  || $token.type == 'FusionAttributeTemplateString'
                  || $token.type == 'FusionAttributeTemplateStringHead'
                  || $token.type == 'FusionAttributeTemplateStringMiddle'
                  || $token.type == 'FusionAttributeTemplateStringTail')
            {
                var $substring = $token.text(),
                    $head      = $substring[0] == '`',
                    $tail      = $substring[$substring.length - 1] == '`';

                $code += $head ?
                         '"' :
                         ')+"';
                $code += $substring.substr(1, $tail ? $substring.length - 2 : $substring.length - 3).replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');
                $code += $tail ?
                         '"' :
                         '".concat(';
            }
            else if ($token.type == 'HTMLText' || $_startsWith($token.type, 'CSS'))
                $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');
            else if ($token.type == 'HTMLStartTagWhitespace')
            {
                $code += !$previous || $previous.type != 'HTMLAttributeOperator' ?
                         $token.text().replace(/^[^\r\n]+/, '') :
                         $token.text();
            }
            else if ($tags.length > 1 || ($token.type != 'HTMLEndTagText'
                                       && $token.type != 'HTMLEndTagSolidus'
                                       && $token.type != 'HTMLAttributeOperator'))
                $code += $token.text();
        }
        else if ($token.type == 'JavaScriptTemplateString')
        {
            var $substring = $token.text(),
                $head      = $substring[0] == '`',
                $tail      = $substring[$substring.length - 1] == '`';

            $code += $head ?
                     '"' :
                     ')+"';
            $code += $substring.substr(1, $tail ? $substring.length - 2 : $substring.length - 3).replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');
            $code += $tail ?
                     '"' :
                     '".concat(';
        }
        else
            $code += $token.text();

        $previous = $lexer.token;
    }

    if ($tags.length)
        throw 'unmatched <' + $tags[$tags.length - 1] + '> tag';

    return $code;
});