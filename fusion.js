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
(function(global, undefined)
{
    // Enable strict mode
    'use strict';

    // If no global object was provided, create a temporary global object
    if (!global)
        global = {};

// ########## BUILD ##########

// Create the build parameters
var $_minify  = false,
    $_version = '1.0.0b';

// ########## NATIVE CODE ##########

// Store references to native code functions and constants
var $__object               = Object,
    $__objectProto__        = $__object.prototype,
    $__create               = $__object.create,
    $__defineProperty       = $__object.defineProperty,
    $__freeze               = $__object.freeze,
    $__getPrototypeOf       = $__object.getPrototypeOf,
    $__isExtensible         = $__object.isExtensible,
    $__isFrozen             = $__object.isFrozen,
    $__isSealed             = $__object.isSealed,
    $__keys                 = $__object.keys,
    $__preventExtensions    = $__object.preventExtensions,
    $__propertyIsEnumerable = $__object.propertyIsEnumerable,
    $__seal                 = $__object.seal,
    $__hasOwnProperty__     = $__objectProto__.hasOwnProperty,
    $__isPrototypeOf__      = $__objectProto__.isPrototypeOf,
    $__toString__           = $__objectProto__.toString,
    $__valueOf__            = $__objectProto__.valueOf,

    // ---------- ARRAY ----------
    $__array         = Array,
    $__arrayProto__  = $__array.prototype,
    $__array_isArray = $__array.isArray,

    // ---------- DATE ----------
    $__date       = Date,
    $__date_now   = $__date.now,
    $__date_parse = $__date.parse,

    // ---------- ERROR ----------
    $__error = Error,

    // ---------- NUMBER ----------
    $__number     = Number,
    $__ceil       = Math.ceil,
    $__floor      = Math.floor,
    $__isFinite   = isFinite,
    $__isNaN      = isNaN,
    $__parseFloat = parseFloat,
    $__parseInt   = parseInt,
    $__random     = Math.random,

    // ---------- STRING ----------
    $__string        = String,
    $__stringProto__ = $__string.prototype;

// If any of the ECMAScript 5 native code methods are not found, throw an exception
if (!$__create || !$__defineProperty || !$__freeze || !$__getPrototypeOf || !$__preventExtensions || !$__seal || !$__array_isArray || !$__arrayProto__.forEach || !$__arrayProto__.indexOf || !$__stringProto__.trim)
    throw new $__error('JavaScript engine does not support ECMAScript 5.');

// ---------- WINDOW ----------
var $_window = typeof window != 'undefined' && window != null && window.window === window ?
               window :
               {};

// ########## CONSTANTS ##########

// Create the internal constants
var $_const_class_prefix    = 'fusion_',
    $_const_entities        = {"Aacute":"C1","aacute":"E1","Acirc":"C2","acirc":"E2","acute":"B4","AElig":"C6","aelig":"E6","Agrave":"C0","agrave":"E0","amp":"26","AMP":"26","Aring":"C5","aring":"E5","Atilde":"C3","atilde":"E3","Auml":"C4","auml":"E4","brvbar":"A6","Ccedil":"C7","ccedil":"E7","cedil":"B8","cent":"A2","copy":"A9","COPY":"A9","curren":"A4","deg":"B0","divide":"F7","Eacute":"C9","eacute":"E9","Ecirc":"CA","ecirc":"EA","Egrave":"C8","egrave":"E8","ETH":"D0","eth":"F0","Euml":"CB","euml":"EB","frac12":"BD","frac14":"BC","frac34":"BE","gt":"3E","GT":"3E","Iacute":"CD","iacute":"ED","Icirc":"CE","icirc":"EE","iexcl":"A1","Igrave":"CC","igrave":"EC","iquest":"BF","Iuml":"CF","iuml":"EF","laquo":"AB","lt":"3C","LT":"3C","macr":"AF","micro":"B5","middot":"B7","nbsp":"A0","not":"AC","Ntilde":"D1","ntilde":"F1","Oacute":"D3","oacute":"F3","Ocirc":"D4","ocirc":"F4","Ograve":"D2","ograve":"F2","ordf":"AA","ordm":"BA","Oslash":"D8","oslash":"F8","Otilde":"D5","otilde":"F5","Ouml":"D6","ouml":"F6","para":"B6","plusmn":"B1","pound":"A3","quot":"22","QUOT":"22","raquo":"BB","reg":"AE","REG":"AE","sect":"A7","shy":"AD","sup1":"B9","sup2":"B2","sup3":"B3","szlig":"DF","THORN":"DE","thorn":"FE","times":"D7","Uacute":"DA","uacute":"FA","Ucirc":"DB","ucirc":"FB","Ugrave":"D9","ugrave":"F9","uml":"A8","Uuml":"DC","uuml":"FC","Yacute":"DD","yacute":"FD","yen":"A5","yuml":"FF"},
    $_const_entity_search   = /[<>&'"]/g,
    $_const_escape_replace  = '\\$&',
    $_const_escape_search   = /[-\/\\^$*+?.()|[\]{}]/g,
    $_const_format_search   = /(\{+)([0-9]+)(,([-+]?[0-9]+))?\}/g,
    $_const_int_max         = 9007199254740992,
    $_const_int_min         = -$_const_int_max;

    // Set the semi-colon entities in the HTML entities lookup
    $__keys($_const_entities).forEach(function($v, $i, $a)
    {
        // Set the semi-colon entity in the HTML entities lookup
        $_const_entities[$v + ';'] = $_const_entities[$v];
    });

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

// Create the arguments reference, characters string, and hashes object
var $_arguments  = null,
    $_characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    $_hashes     = $__create(null);

// Append the lowercase characters to the characters string
$_characters += $_characters.toLowerCase();

// --- STRING ---
var $_endsWith   = function($string, $search, $position)
{
    // If either string is empty or the search string is longer than the string, return false
    if (!$search || !$string || $search.length > $string.length)
        return false;

    // If a valid position was not provided, use the end of the string
    if (!$position || $position > $string.length)
        $position = $string.length;

    // Return true if the string ends with the search string
    return $search == $string.substr($position - $search.length);
};
var $_entity     = function($0)
{
    // Return the escaped HTML entity
    return '&#' + $0.charCodeAt(0) + ';';
};
var $_format     = function($0, $1, $2, $3, $4)
{
    // Get the number of opening-braces, argument index, and alignment length
    var $braces    = $1.length,
        $index     = $__parseInt($2, 10),
        $alignment = $4 ?
                     $__parseInt($4, 10) :
                     0;

    // If an even number of opening-braces was provided, the argument index exceeded the number of arguments, or the alignment length is out of range, return the match (with the escaped opening-braces)
    if ($braces % 2 == 0 || $index >= $_arguments.length || $alignment > $_const_int_max || $alignment < $_const_int_min)
        return $1.substr($braces / 2) + $2 + $3 + '}';

    // Get the argument string for the argument index (and pad the string if an alignment was provided)
    var $argument = $alignment > 0 ?
                    $_padLeft($_arguments[$index], $alignment) :
                    $alignment < 0 ?
                    $_padRight($_arguments[$index], -$alignment) :
                    $_arguments[$index];

    // If more than one opening-brace was provided, return the argument string (with the escaped opening-braces)
    if ($braces > 1)
        return $1.substr($__floor($braces / 2) + 1) + $argument;

    return $argument;
};
var $_generator  = function($length)
{
    // Create the hash reference
    var $hash = null;

    do
    {
        // Reset the hash
        $hash = '';

        // Append random characters to the hash
        for (var $i = 0, $j = $_characters.length; $i < $length; $i++)
            $hash += $_characters[$__floor($j * $__random())];
    }
    // Continue if the hash was already found in the hashes object
    while ($_hashes[$hash]);

    // Set the hash in the hashes object
    $_hashes[$hash] = $hash;

    // Return the hash
    return $hash;
};
var $_padLeft    = function($string, $length, $character)
{
    // If a character wasn't provided, use a space character
    if (!$character)
        $character = ' ';

    // Prepend the character to the string while it's shorter than the length
    while ($string.length < $length)
        $string = $character + $string;

    return $string;
};
var $_padRight   = function($string, $length, $character)
{
    // If a character wasn't provided, use a space character
    if (!$character)
        $character = ' ';

    // Append the character to the string while it's shorter than the length
    while ($string.length < $length)
        $string += $character;

    return $string;
};
var $_startsWith = function($string, $search, $position)
{
    // If either string is empty or the search string is longer than the string, return false
    if (!$search || !$string || $search.length > $string.length)
        return false;

    // If a valid position was not provided, use the start of the string
    if (!$position || $position < 0)
        $position = 0;

    // Return true if the string starts with the search string
    return $search == $string.substr($position, $search.length);
};
var $_zerofill   = function($string, $length)
{
    // Return the string left-padded to the given length with zeros
    return $_padLeft($string, $length, '0');
};

// --- CHARACTERS ---
var $_alphanumeric = function($character)
{
    // Return true if the character is either a letter or number
    return ($character >= 'a' && $character <= 'z'
         || $character >= 'A' && $character <= 'Z'
         || $character >= '0' && $character <= '9');
};
var $_binary       = function($character)
{
    // Return true if the character is either one or zero
    return $character == '0' || $character == '1';
};
var $_hexadecimal  = function($character)
{
    // Return true if the character is a hexadecimal letter or a number
    return ($character >= 'a' && $character <= 'f'
         || $character >= 'A' && $character <= 'F'
         || $character >= '0' && $character <= '9');
};
var $_letter       = function($character)
{
    // Return true if the character is a letter
    return ($character >= 'a' && $character <= 'z'
         || $character >= 'A' && $character <= 'Z');
};
var $_newline      = function($character)
{
    // LINE TERMINATORS (11.3)
    return ($character == '\r'
         || $character == '\n'
         || $character == '\u2028'
         || $character == '\u2029');
};
var $_number       = function($character)
{
    // Return true if the character is a number
    return $character >= '0' && $character <= '9';
};
var $_octal        = function($character)
{
    // Return true if the character is an octal number
    return $character >= '0' && $character <= '7';
};
var $_space        = function($character)
{
    // COMMON PARSER IDIOMS (2.4.1)
    return ($character == ' '
         || $character == '\r'
         || $character == '\n'
         || $character == '\t'
         || $character == '\f');
};
var $_whitespace   = function($character)
{
    // WHITE SPACE (11.2)
    return ($character == '\t'
         || $character == '\v'
         || $character == '\f'
         || $character == ' '
         || $character == '\u00A0'
         || $character == '\uFEFF');
};

// --- DEFINES ---
var $_defineField    = function($name, $field, $writable)
{
    // Define an enumerable field on the global namespace object
    $_data(fusion, $name, $field, $writable, true);
};
var $_defineMethod   = function($name, $method)
{
    // If the name contains a space
    if ($name.indexOf(' ') >= 0)
    {
        // Create the method names array
        var $names = $name.split(' ');

        // Define each method in the method names array
        for (var $i = 0, $j = $names.length; $i < $j; $i++)
            $_data(fusion, $names[$i], $method);
    }
    // Define a non-enumerable method on the global namespace object
    else
        $_data(fusion, $name, $method); 
};
var $_defineProperty = function($name, $getMethod, $setMethod)
{
    // If the name contains a space
    if ($name.indexOf(' ') >= 0)
    {
        // Create the property names array
        var $names = $name.split(' ');

        // Define each property in the property names array
        for (var $i = 0, $j = $names.length; $i < $j; $i++)
            $_accessor(fusion, $names[$i], $getMethod, $setMethod, true);
    }
    // Define an enumerable property on the global namespace object
    else
        $_accessor(fusion, $name, $getMethod, $setMethod, true);
};

// ########## MAIN ##########

// Create the global namespace
var fusion = function(){};

// Define the readonly fields on the global namespace
$_defineField('dev', !$_minify);
$_defineField('version', $_version);

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

// ########## SCOPE ##########
var Scope   = function($state)
{
    // Set the scope parameters
    this.state = $state || '';
},
  __Scope__ = Scope.prototype = {};

// --- PROTOTYPE ---
__Scope__.braces      = 0;
__Scope__.brackets    = 0;
__Scope__.parentheses = 0;
__Scope__.state       = '';
__Scope__.tag         = '';
__Scope__.tags        = 0;

$_data(__Scope__, 'clone',  function()
{
    // Create the scope
    var $scope = new Scope();

    // Copy the scope parameters
    $scope.braces      = this.braces;
    $scope.brackets    = this.brackets;
    $scope.parentheses = this.parentheses;
    $scope.state       = this.state;
    $scope.tag         = this.tag;
    $scope.tags        = this.tags;

    // Return the scope
    return $scope;
}, true);
$_data(__Scope__, 'equals', function($scope)
{
    // Return true if the scope has the same state and counts
    return (this.braces      === $scope.braces
         && this.brackets    === $scope.brackets
         && this.parentheses === $scope.parentheses
         && this.state       === $scope.state
         && this.tag         === $scope.tag
         && this.tags        === $scope.tags);
}, true);

// ########## LEXER ##########
var Lexer   = function($source, $language)
{
    // If source code was provided, set it
    if ($source)
        this.source = $source;

    // If a language wasn't provided, return
    if (!$language)
        return;

    // Set the language and create the scope chain
    this.language = $language;
    this.chain    = $language == 'html'
                 || $language == 'fhtml' ?
                    [new Scope('#document')] :
                    $language == 'js'
                 || $language == 'fjs'
                 || $language == 'fcss' ?
                    [] :
                    null;
},
  __Lexer__ = Lexer.prototype = {};

// --- HELPERS ---
var $_lexer_break      = function($source, $position, $tag, $current)
{
    // If a current character wasn't provided
    if (!$current)
    {
        // If the current at the provided position doesn't open an HTML end tag, return false
        if ($source[$position] != '<')
            return false;
    }
    // If the current character doesn't open an HTML end tag, return false
    else if ($current != '<')
        return false;

    // If the next character doesn't open an HTML end tag, return false
    if ($source[$position + 1] != '/')
        return false;

    // Return true if the following characters are a case insenitive match for the break tag
    return $source[$position + $tag.length + 2] == '>' && $source.substr($position + 2, $tag.length).toLowerCase() == $tag;
};
var $_lexer_clone      = function($v, $i, $a)
{
    // Return a clone of the value
    return $v.clone();
};
var $_lexer_comment    = function($state)
{
    // Return true if the state is a comment
    return ($state == 'JavaScriptBlockComment'
         || $state == 'JavaScriptLineComment'
         || $state == 'HTMLCommentOpen'
         || $state == 'HTMLCommentText'
         || $state == 'HTMLCommentClose'
         || $state == 'HTMLBogusCommentOpen'
         || $state == 'HTMLBogusCommentText'
         || $state == 'HTMLBogusCommentClose'
         || $state == 'CSSComment');
};
var $_lexer_count      = function($scope, $character)
{
    // If the character is either an opening or closing brace, adjust the braces count of the scope
    if ($character == '{' || $character == '}')
        $scope.braces += $character == '{' ?
                         1 :
                         $scope.braces ?
                         -1 :
                         0;
    // If the character is either an opening or closing parentheses, adjust the parentheses count of the scope
    else if ($character == '(' || $character == ')')
        $scope.parentheses += $character == '(' ?
                              1 :
                              $scope.parentheses ?
                              -1 :
                              0;
    // If the character is either an opening or closing bracket, adjust the brackets count of the scope
    else if ($character == '[' || $character == ']')
        $scope.brackets += $character == '[' ?
                           1 :
                           $scope.brackets ?
                           -1 :
                           0;
    // If the character is either an opening or closing tag, adjust the tags count of the scope
    else if ($character == '<' || $character == '>')
        $scope.tags += $character == '<' ?
                       1 :
                       $scope.tags ?
                       -1 :
                       0;
};
var $_lexer_regexp     = function($token, $expression)
{
    // If no token was provided, return true
    if (!$token)
        return true;

    // Get the token type
    var $type = $token.type;

    // If the token is a punctuator
    if ($type == 'JavaScriptPunctuator')
    {
        // Get the token text
        var $text = $token.text();

        // Return true if the punctuator cannot precede a division operator
        return (($text != ')' || $expression && ($expression == 'for()'
                                              || $expression == 'if()'
                                            //|| $expression == 'let()'
                                              || $expression == 'while()'
                                              || $expression == 'with()'))
             && ($text != '}' || !$expression || $expression != '{}')
             &&  $text != ']'
             &&  $text != '++'
             &&  $text != '--');
    }
    // If the token is a reserved word
    else if ($type == 'JavaScriptReservedWord')
    {
        // Get the token text
        var $text = $token.text();

        // Return true if the reserved word can precede an expression
        return ($text == 'case'
             || $text == 'delete'
             || $text == 'do'
             || $text == 'else'
             || $text == 'extends'
             || $text == 'in'
             || $text == 'instanceof'
             || $text == 'new'
             || $text == 'return'
             || $text == 'throw'
             || $text == 'typeof'
             || $text == 'void'
             || $text == 'yield');
    }
    // If the token is a template string, return true if the template string is a substitution head or middle
    else if ($type == 'JavaScriptTemplateString')
        return $token.source.substr($token.end - 1, 1) != '`';

    // Return true if the token is either a template string head, middle, or substitution open
    return ($type == 'FusionAttributeTemplateStringHead'
         || $type == 'FusionAttributeTemplateStringMiddle'
         || $type == 'FusionSubstitutionOpen'
         || $type == 'FusionObjectSubstitutionOpen'
         || $type == 'FusionSelectorSubstitutionOpen'
         || $type == 'FusionStyleSubstitutionOpen');
};
var $_lexer_text       = function($state)
{
    // Return true if the state is plain text
    return ($state == 'JavaScriptInvalidCharacter'
         || $state == 'HTMLText'
         || $state == 'HTMLEndTagText');
};
var $_lexer_void       = function($tag)
{
    // Return true if the tag is a void HTML element
    return ($tag == 'area'
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
         || $tag == 'wbr');
};
var $_lexer_whitespace = function($state)
{
    // Return true if the state is whitespace
    return ($state == 'JavaScriptWhitespace'
         || $state == 'HTMLStartTagWhitespace'
         || $state == 'HTMLEndTagWhitespace'
         || $state == 'HTMLDOCTYPEWhitespace'
         || $state == 'CSSWhitespace');
};

// --- PROTOTYPE ---
__Lexer__.chain      = null;
__Lexer__.expression = '';
__Lexer__.language   = '';
__Lexer__.position   = 0;
__Lexer__.source     = '';
__Lexer__.state      = '';
__Lexer__.token      = null;

$_data(__Lexer__, 'clone',  function()
{
    // Create a context-free lexer
    var $type  = typeof this._clone == 'function' && __Lexer__.isPrototypeOf(this._clone.prototype) ?
                 this._clone :
                 Lexer;
    var $lexer = new $type();

    // Copy the lexer parameters
    $lexer.chain      = this.chain ?
                        this.chain.map($_lexer_clone) :
                        null;
    $lexer.expression = this.expression;
    $lexer.language   = this.language;
    $lexer.position   = this.position;
    $lexer.source     = this.source;
    $lexer.state      = this.state;
    $lexer.token      = this.token ?
                        this.token.clone() :
                        null;

    // Return the lexer
    return $lexer;
}, true);
$_data(__Lexer__, 'equals', function($lexer)
{
    // If a lexer wasn't provided, return false
    if (!($lexer instanceof Lexer))
        return false;

    // If the lexers don't have matching languages, states, and previous expressions, return false
    if (this.expression !== $lexer.expression
     || this.language   !== $lexer.language
     || this.state      !== $lexer.state)
        return false;

    // Get the scope chains
    var $chainLexer = $lexer.chain,
        $chainThis  = this.chain;

    // If the lexers don't have matching scope chain lengths, return false
    if (($chainThis && $chainThis.length || 0) != ($chainLexer && $chainLexer.length || 0))
        return false;

    // If the lexers don't have matching previous tokens, return false
    if (!this.token != !$lexer.token || this.token && !this.token.equals($lexer.token))
        return false;

    // If the lexers have scope chains, return false if they are not equal
    if ($chainThis)
        for (var $i = 0, $j = $chainThis.length; $i < $j; $i++)
            if (!$chainThis[$i].equals($chainLexer[$i]))
                return false;

    return true;
}, true);
$_data(__Lexer__, 'hack',   function()
{
    // If a scope chain already exists, return false
    if (this.chain)
        return false;

    // Get the language
    var $language = this.language;

    // Create the scope chain
    this.chain = $language == 'html'
              || $language == 'fhtml' ?
                 [new Scope('#document')] :
                 $language == 'js'
              || $language == 'fjs'
              || $language == 'fcss' ?
                 [] :
                 null;

    // Return true if a scope chain was created
    return !!this.chain;
}, true);
$_data(__Lexer__, 'next',   function()
{
    // Get the current position, state, and scope
    var $source     = this.source,
        $length     = $source.length,
        $start      = this.position,
        $token      = this.token,
        $expression = this.expression,
        $language   = this.language,
        $position   = this.position,
        $state      = this.state || $language,
        $fusion     = $language == 'fjs'
                   || $language == 'fhtml'
                   || $language == 'fcss',
        $chain      = this.chain,
        $scopes     = $chain ?
                      $chain.length :
                      0,
        $scope      = $scopes ?
                      $chain[$scopes - 1] :
                      null;

    // If the position is invalid, return null
    if ($position < 0 || $position >= $length)
        return null;

    // Create the context parameters
    var $append  = '',
        $end     = false,
        $pop     = 0,
        $push    = null,
        $replace = '';

    switch ($state)
    {
        // ---------- JavaScript ----------
        case 'js':
        case 'fjs':
        case 'JavaScriptIdentifier':
        case 'JavaScriptReservedWord':
        case 'JavaScriptPunctuator':
        case 'JavaScriptNumber':
        case 'JavaScriptDoubleQuotedString':
        case 'JavaScriptSingleQuotedString':
        case 'JavaScriptTemplateString':
        case 'JavaScriptRegExp':
        case 'JavaScriptBlockComment':
        case 'JavaScriptLineComment':
        case 'JavaScriptInvalidCharacter':
        case 'JavaScriptWhitespace':
        case 'FusionStartTagOpen':
        case 'FusionEndTagOpen':
        case 'FusionDirectiveTagOpen':
        case 'FusionProperty':
        case 'FusionAttributeTemplateStringHead':
        case 'FusionAttributeTemplateStringMiddle':
        case 'FusionSubstitutionOpen':
        case 'FusionObjectClose':
        case 'FusionObjectSubstitutionOpen':
        case 'FusionSelectorClose':
        case 'FusionSelectorSubstitutionOpen':
        case 'FusionStyleSubstitutionOpen':

            // Get the current character from the source
            var $current = $source[$position];

            // NAMES AND KEYWORDS (11.6)
            // LITERALS (11.8)
            if ($_letter($current) || $current == '_'
                                   || $current == '$'
                                   || $current == '\\'
                                   || $current == '@' && $fusion && $token && ($token.type == 'JavaScriptIdentifier'
                                                                           || ($token.type == 'JavaScriptPunctuator' || $token.type == 'CSSPunctuator') && ($source[$token.start] == ')'
                                                                                                                                                         || $source[$token.start] == ']')))
            {
                // If the current character isn't an escape sequence, consume the current character
                if ($current != '\\')
                    $position++;

                // Set the state
                $state = $current == '@' ?
                         'FusionProperty' :
                         'JavaScriptIdentifier';

                do
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the current character is a valid identifier character
                    if ($_alphanumeric($current) || $current == '_'
                                                 || $current == '$'
                                                 || $current == '\u200C'
                                                 || $current == '\u200D')
                        // Consume the current character
                        continue;

                    // If the current character isn't an escape sequence, break (and don't consume it)
                    if ($current != '\\')
                        break;

                    // Get the next character from the source
                    var $peek = $source[$position + 1];

                    // If the current character isn't an escape sequence, break
                    if ($peek != 'u')
                        break;

                    // Get the next character from the source
                    $peek = $source[$position + 2];

                    // If the next character opens an ECMAScript 6 unicode escape sequence
                    if ($peek == '{')
                    {
                        // Create the character counter
                        var $characters = 0;

                        // Count the next hexadecimal characters
                        while ($_hexadecimal($source[$position + $characters + 3]))
                            $characters++;

                        // If there are any hexadecimal characters and the escape sequence is properly closed, consume the ECMAScript 6 unicode escape sequence
                        if ($characters && $source[$position + $characters + 3] == '}')
                            $position += $characters + 3;
                        else
                            break;
                    }
                    // If the following four characters are hexadecimal
                    else if ($_hexadecimal($peek) && $_hexadecimal($source[$position + 3])
                                                  && $_hexadecimal($source[$position + 4])
                                                  && $_hexadecimal($source[$position + 5]))
                        // Consume the unicode escape sequence
                        $position += 5;
                    else
                        break;
                }
                // Continue if the incremented position doesn't exceed the length
                while (++$position < $length);

                // If no characters were consumed
                if ($position == $start)
                {
                    // Consume the current character and set the state
                    $position++;
                    $state = 'JavaScriptInvalidCharacter';
                }
                // IDENTIFIER NAMES (11.6.1)
                else if ((!$token || $token.type != 'JavaScriptPunctuator' || $token.text() != '.') && (!$fusion || $state != 'FusionProperty'))
                {
                    // Get the identifier from the source
                    var $identifier = $source.substring($start, $position);

                    // If the previous token was a fusion markup tag and the current identifier opens a fusion context
                    if ($fusion && $token && ($token.type == 'FusionStartTagOpen' && ($identifier == 'break'
                                                                                   || $identifier == 'case'
                                                                                   || $identifier == 'continue'
                                                                                   || $identifier == 'default'
                                                                                   || $identifier == 'do'
                                                                                   || $identifier == 'else'
                                                                                   || $identifier == 'for'
                                                                                   || $identifier == 'if'
                                                                                   || $identifier == 'switch'
                                                                                   || $identifier == 'while')
                                           || $token.type == 'FusionEndTagOpen'   &&  $identifier == 'while'))
                    {
                        // Set the state and push a fusion context into the scope chain
                        $state = 'JavaScriptReservedWord';
                        $push  = new Scope($token.type == 'FusionEndTagOpen' ?
                                           '</@' + $identifier :
                                           '<@' + $identifier);
                    }
                    // RESERVED WORDS (11.6.2)
                    // NULL LITERALS (11.8.1)
                    // BOOLEAN LITERALS (11.8.2)
                    else if ($identifier == 'null'
                          || $identifier == 'false'
                          || $identifier == 'true'
                          || $identifier == 'break'
                          || $identifier == 'case'
                          || $identifier == 'catch'
                          || $identifier == 'class'
                          || $identifier == 'const'
                          || $identifier == 'continue'
                          || $identifier == 'debugger'
                          || $identifier == 'default'
                          || $identifier == 'delete'
                          || $identifier == 'do'
                          || $identifier == 'else'
                          || $identifier == 'enum'
                          || $identifier == 'export'
                          || $identifier == 'extends'
                          || $identifier == 'finally'
                          || $identifier == 'for'
                          || $identifier == 'function'
                          || $identifier == 'if'
                          || $identifier == 'implements'
                          || $identifier == 'import'
                          || $identifier == 'in'
                          || $identifier == 'instanceof'
                          || $identifier == 'interface'
                          || $identifier == 'let'
                          || $identifier == 'new'
                          || $identifier == 'package'
                          || $identifier == 'private'
                          || $identifier == 'protected'
                          || $identifier == 'public'
                          || $identifier == 'return'
                          || $identifier == 'static'
                          || $identifier == 'super'
                          || $identifier == 'switch'
                          || $identifier == 'this'
                          || $identifier == 'throw'
                          || $identifier == 'try'
                          || $identifier == 'typeof'
                          || $identifier == 'var'
                          || $identifier == 'void'
                          || $identifier == 'while'
                          || $identifier == 'with'
                          || $identifier == 'yield')
                    {
                        // Get the previous token text if it's a reserved word
                        var $text = $token && $token.type == 'JavaScriptReservedWord' ?
                                    $token.text() :
                                    null;

                        // If the previous token is neither the get nor set reserved word and the current context isn't an object key context, set the state
                        if ((!$text || $text != 'get' && $text != 'set') && (!$scope || $scope.state != '{'))
                            $state = 'JavaScriptReservedWord';

                        // If the previous token is the `else` reserved word and the identifier can be appended to the state of the current context
                        if ($fusion && $text == 'else' && $scope && $scope.state == '<@else' && ($identifier == 'do'
                                                                                              || $identifier == 'for'
                                                                                              || $identifier == 'if'
                                                                                              || $identifier == 'switch'
                                                                                              || $identifier == 'while'))
                            // Append the identifier to the state of the current context
                            $append = ' ' + $identifier;
                    }
                    // If the identifier is either `get` or `set` and the current context is an object key
                    else if (($identifier == 'get'
                           || $identifier == 'set') && $scope && $scope.state == '{')
                    {
                        // Get the next token and its type
                        var $peek = this.peek($position),
                            $type = $peek ?
                                    $peek.type :
                                    null;

                        // If the next token is either an identifier or reserved word
                        if ($type == 'JavaScriptIdentifier' || $type == 'JavaScriptReservedWord')
                        {
                            // Get the next token and its type
                            $peek = this.peek($peek.end),
                            $type = $peek ?
                                    $peek.type :
                                    null;

                            // If the next token is an opening parentheses
                            if ($type == 'JavaScriptPunctuator' && $source[$peek.start] == '(')
                            {
                                // Set the state and replace the state of the current context with an object value context
                                $state   = 'JavaScriptReservedWord';
                                $replace = '{:';
                            }
                        }
                    }
                }
            }
            // WHITE SPACE (11.2)
            // LINE TERMINATORS (11.3)
            else if ($_whitespace($current) || $_newline($current))
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptWhitespace';

                do
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the current character is neither whitespace nor a newline, break (and don't consume it)
                    if (!$_whitespace($current) && !$_newline($current))
                        break;
                }
                // Continue if the incremented position doesn't exceed the length
                while (++$position < $length);
            }
            // STRING LITERALS (11.8.4)
            // TEMPLATE LITERALS (11.8.6)
            else if ($current == '"'
                  || $current == "'"
                  || $current == '`' && $chain
                  || $current == '}' && $scope && $scope.braces == 0 && $_endsWith($scope.state, '`${'))
            {
                // Check if the template string is an attribute and get the break character
                var $attribute = $current == '}' && $scope.state == '=`${',
                    $break     = $current != '}' ?
                                 $current :
                                 '`';

                // Set the state
                $state = $attribute ?
                         'FusionAttributeTemplateStringTail' :
                         $break == '"' ?
                         'JavaScriptDoubleQuotedString' :
                         $break == "'" ?
                         'JavaScriptSingleQuotedString' :
                         'JavaScriptTemplateString';

                // If the template string is either a middle or tail substitution
                if ($current == '}')
                {
                    // Append the characters to the state of the current context and pop it from the scope chain
                    $append = $current + $break;
                    $pop++;
                }

                // Consume the current character
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the language is HTML and the current character opens a script end tag, break (and don't consume the current character)
                    if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'script', $current))
                        break;

                    // If the current character is an escape sequence
                    if ($current == '\\')
                    {
                        // Consume the escape character and if there isn't another character, break
                        if (++$position >= $length)
                            break;

                        // If the current character is a carriage return and the next character is a line break, consume the carriage return
                        if ($source[$position] == '\r' && $source[$position + 1] == '\n')
                            $position++;
                    }
                    // If the current character is the break character
                    else if ($current == $break)
                    {
                        // Consume the current character
                        $position++;

                        break;
                    }
                    // If the state is a template string
                    else if ($break == '`')
                    {
                        // If the current character opens a template substitution
                        if ($current == '$' && $source[$position + 1] == '{')
                        {
                            // Consume the `${` characters and push a substitution context into the scope chain
                            $position += 2;
                            $push      = new Scope($pop ?
                                                   $scope.state :
                                                   '`${');

                            // If the template string is an attribute, set the state
                            if ($attribute)
                                $state = 'FusionAttributeTemplateStringMiddle';

                            break;
                        }
                    }
                    // LINE TERMINATORS (11.3)
                    else if ($_newline($current))
                        break;
                }
            }
            // If the current character could be a comment, regular expression literal, or division punctuator (then prepare for some ambiguity)
            else if ($current == '/')
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // COMMENTS (11.4)
                if ($peek == '*')
                {
                    // Consume the `/` character and set the state
                    $position++;
                    $state = 'JavaScriptBlockComment';

                    // Consume the current character (and initially the `*` character)
                    while (++$position < $length)
                    {
                        // Get the current character from the source
                        $current = $source[$position];

                        // If the language is HTML and the current character opens a script end tag, break (and don't consume the current character)
                        if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'script', $current))
                            break;

                        // If the current characters close the comment
                        if ($current == '*' && $source[$position + 1] == '/')
                        {
                            // Consume the `*/` characters
                            $position += 2;

                            break;
                        }
                    }
                }
                // COMMENTS (11.4)
                else if ($peek == '/')
                {
                    // Consume the first `/` character and set the state
                    $position++;
                    $state = 'JavaScriptLineComment';

                    // Consume the current character (and initially the second `/` character)
                    while (++$position < $length)
                    {
                        // Get the current character from the source
                        $current = $source[$position];

                        // If the language is HTML and the current character opens a script end tag, break (and don't consume the current character)
                        if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'script', $current))
                            break;

                        // If the current character is a newline, break (and don't consume it)
                        if ($_newline($current))
                            break;
                    }
                }
                // If the current character is the self closing of a fusion start tag
                else if ($fusion && $peek == '>' && $scope && $_startsWith($scope.state, '<@') && ($scope.state == '<@break'
                                                                                                || $scope.state == '<@case'
                                                                                                || $scope.state == '<@continue'
                                                                                                || $scope.state == '<@default'
                                                                                                || $scope.state == '<@else'))
                {
                    // Consume the `/>` characters, set the state, append the characters to the state of the current context, and pop it from the scope chain
                    $position += 2;
                    $state     = 'FusionStartTagSelfClose';
                    $append    = $current + $peek;
                    $pop++;
                }
                else
                {
                    // REGULAR EXPRESSION LITERALS (11.8.5)
                    if ($_lexer_regexp($token, $expression))
                    {
                        // Set the state
                        $state = 'JavaScriptRegExp';

                        // Create the class flag
                        var $class = false;

                        // Consume the current character (and initially the `/` character)
                        while (++$position < $length)
                        {
                            // Get the current character from the source
                            $current = $source[$position];

                            // If the language is HTML and the current character opens a script end tag, break (and don't consume the current character)
                            if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'script', $current))
                                break;

                            // If the current character is an escape character
                            if ($current == '\\')
                            {
                                // Consume the escape character and if there isn't another character or the current character is a line terminator, break
                                if (++$position >= $length || $_newline($source[$position]))
                                    break;
                            }
                            // If the current character is the closing `/` character (and it's not inside a character class)
                            else if (!$class && $current == '/')
                            {
                                // Consume the closing `/`
                                $position++;

                                break;
                            }
                            // If the current character opens a character class (and it's not inside a character class), set the class flag
                            else if (!$class && $current == '[')
                                $class = true;
                            // If the current character closes a character class (and it's inside a character class), reset the class flag
                            else if ($class && $current == ']')
                                $class = false;
                            // LINE TERMINATORS (11.3)
                            else if ($_newline($current))
                                break;
                        }

                        // If the closing character was a `/`
                        if ($current == '/')
                        {
                            // Get the current character from the source
                            $current = $source[$position];

                            // If the current character starts an identifier
                            if ($_letter($current) || $current == '_' || $current == '$')
                            {
                                // Consume the current character
                                $position++;

                                do
                                {
                                    // Get the current character from the source
                                    $current = $source[$position];

                                    // If the current character isn't a valid identifier character
                                    if (!$_alphanumeric($current) && $current != '_'
                                                                  && $current != '$'
                                                                  && $current != '\u200C'
                                                                  && $current != '\u200D')
                                        // Don't consume the current character
                                        break;
                                }
                                // Continue if the incremented position doesn't exceed the length
                                while (++$position < $length);
                            }
                        }
                    }
                    else
                    {
                        // Consume the `/` character and set the state
                        $position++;
                        $state = 'JavaScriptPunctuator';

                        // If the punctuator is the division assignment operator, consume the `=` character
                        if ($source[$position] == '=')
                            $position++;
                    }
                }
            }
            // NUMERIC LITERALS (11.8.3)
            else if ($_number($current) || $current == '.' && $_number($source[$position + 1]))
            {
                // Set the state
                $state = 'JavaScriptNumber';

                // Get the next character from the source
                var $peek = $current == '0' ?
                            $source[$position + 1] :
                            null;

                // If the first character is non-zero or the zero is followed by a decimal point or exponential indicator
                if ($current != '0' || $peek == '.'
                                    || $peek == 'e'
                                    || $peek == 'E')
                {
                    // If the current character is not a decimal point
                    if ($current != '.')
                    {
                        // Consume the current character
                        $position++;

                        // Consume any other numeric characters
                        while ($_number($source[$position]))
                            $position++;

                        // Get the current character from the source
                        $current = $source[$position];
                    }

                    // If the current character is a decimal point
                    if ($current == '.')
                    {
                        // Consume the `.` character
                        $position++;

                        // Consume any other numeric characters
                        while ($_number($source[$position]))
                            $position++;

                        // Get the current character from the source
                        $current = $source[$position];
                    }

                    // Get the next character from the source
                    $peek = $source[$position + 1];

                    // If the current character is an exponential indicator and the next character is a numeric character (or it is preceded by a valid punctuator)
                    if (($current == 'e' || $current == 'E') && ($_number($peek) || ($peek == '+' || $peek == '-') && $_number($source[$position + 2])))
                    {
                        // Consume the current characters
                        $position += $peek == '+' || $peek == '-' ? 3 : 2;

                        // Consume any other numeric characters
                        while ($_number($source[$position]))
                            $position++;
                    }
                }
                else
                {
                    // Consume the `0` character
                    $position++;

                    // Get the helper function
                    var $helper = $peek == 'b' || $peek == 'B' ?
                                  $_binary :
                                  $peek == 'o' || $peek == 'O' ?
                                  $_octal :
                                  $peek == 'x' || $peek == 'X' ?
                                  $_hexadecimal :
                                  null;

                    // If the next character is in the range of the helper function
                    if ($helper && $helper($source[$position + 1]))
                    {
                        // Consume the flag character and the next character
                        $position += 2;

                        // Consume any other characters in the range of the helper function
                        while ($helper($source[$position]))
                            $position++;
                    }
                }
            }
            // PUNCTUATORS (11.7)
            else if ($current == '{')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If the lexer has a scope chain
                if ($chain)
                {
                    // Get the identifier if the previous token is a reserved word or the punctuator if it's a punctuator
                    var $identifier = $token && $token.type == 'JavaScriptReservedWord' ?
                                      $token.text() :
                                      null,
                        $punctuator = $token && $token.type == 'JavaScriptPunctuator' ?
                                      $token.text() :
                                      null;

                    // If the previous token is neither an identifier nor a punctuator that precedes a block
                    if ($identifier && $identifier != 'do'
                                    && $identifier != 'else'
                                    && $identifier != 'export'
                                    && $identifier != 'finally'
                                    && $identifier != 'import'
                                    && $identifier != 'try'
                     || $punctuator && $punctuator != '{'
                                    && $punctuator != ';'
                                    && $punctuator != '=>'
                                    && $punctuator != '}')
                    {
                        // If the previous token is a punctuator that precedes an object literal
                        if ($punctuator == '('
                         || $punctuator == '['
                         || $punctuator == ','
                         || $punctuator == '?'
                         || $punctuator == ':'
                         || $punctuator == '=')
                            // Push an object key context into the scope chain
                            $push = new Scope('{');
                        // If there is no previous expression or it doesn't precede a block
                        else if (!$expression || !$_endsWith($expression, '()'))
                        {
                            // Get the next token and its type
                            var $peek = this.peek($position),
                                $type = $peek ?
                                        $peek.type :
                                        null;

                            // If the next token is either an identifier, reserved word, or string literal
                            if ($type == 'JavaScriptIdentifier'
                             || $type == 'JavaScriptReservedWord'
                             || $type == 'JavaScriptDoubleQuotedString'
                             || $type == 'JavaScriptSingleQuotedString')
                            {
                                // Get the token text if it's an identifier
                                var $text = $type == 'JavaScriptIdentifier' ?
                                            $peek.text() :
                                            null;

                                // Get the next token and its type
                                $peek = this.peek($peek.end);
                                $type = $peek ?
                                        $peek.type :
                                        null;

                                // If the next token is the `:` punctuator, push an object key context into the scope chain
                                if ($type == 'JavaScriptPunctuator' && $peek.text() == ':')
                                    $push = new Scope('{');
                                // If the preceding identifier is either `get` or `set` and the next token is either an identifier or reserved word
                                else if (($text == 'get' || $text == 'set') && ($type == 'JavaScriptIdentifier' || $type == 'JavaScriptReservedWord'))
                                {
                                    // Get the next token and its type
                                    $peek = this.peek($peek.end);
                                    $type = $peek ?
                                            $peek.type :
                                            null;

                                    // If the next token is the `(` punctuator, push an object key context into the scope chain
                                    if ($type == 'JavaScriptPunctuator' && $source[$peek.start] == '(')
                                        $push = new Scope('{');
                                }
                            }
                        }
                    }

                    // If there's a current context and an object key context isn't being pushed into the scope chain, count the current character
                    if ($scope && !$push)
                        $_lexer_count($scope, $current);
                }
            }
            // PUNCTUATORS (11.7)
            else if ($current == '}')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If there's a current context
                if ($scope)
                {
                    // If the closing brace is unmatched
                    if ($scope.braces == 0)
                    {
                        // If the current character closes a fusion substitution context
                        if ($fusion && $_endsWith($scope.state, '${'))
                        {
                            // Set the state, append the current character to the state of the current context, and pop it from the scope chain
                            $state  = $scope.state == '<${' ?
                                      'FusionSubstitutionClose' :
                                      $scope.state == '@{:${' ?
                                      'FusionObjectSubstitutionClose' :
                                      $scope.state == '@(${' || $scope.state == '@[${' ?
                                      'FusionSelectorSubstitutionClose' :
                                      'FusionStyleSubstitutionClose';
                            $append = $current;
                            $pop++;
                        }
                        // If the current character closes either an object key or value context
                        else if ($scope.state == '{' || $scope.state == '{:')
                        {
                            // Replace the state of the current context with an object literal and pop it from the scope chain
                            $replace = '{}';
                            $pop++;
                        }
                    }

                    // If the current context isn't being popped from the scope chain, count the current character
                    if (!$pop)
                        $_lexer_count($scope, $current);
                }
            }
            // PUNCTUATORS (11.7)
            else if ($current == '(')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If the current context is a fusion context
                if ($fusion && $scope && ($_startsWith($scope.state, '<@')
                                       || $_startsWith($scope.state, '</@')))
                {
                    // Get the context of the scope
                    var $context = $scope.state;

                    // If the current character is the opening of a fusion reserved context
                    if ($context == '<@for'
                     || $context == '<@if'
                     || $context == '<@switch'
                     || $context == '<@while'
                     || $context == '<@else for'
                     || $context == '<@else if'
                     || $context == '<@else switch'
                     || $context == '<@else while'
                     || $context == '</@while')
                        // Append the current character to the state of the current context
                        $append = $current;
                }
                // If the lexer has a scope chain and the previous token is a reserved word
                else if ($chain && $token && $token.type == 'JavaScriptReservedWord')
                {
                    // Get the previous token text
                    var $text = $token.text();

                    // If the reserved word must be followed by parentheses
                    if ($text == 'catch'
                     || $text == 'function'
                     || $text == 'for'
                     || $text == 'if'
                   //|| $text == 'let'
                     || $text == 'switch'
                     || $text == 'while'
                     || $text == 'with')
                        // Push a reserved context into the scope chain
                        $push = new Scope($text + '(');
                }

                // If there's a current context and a reserved context isn't being pushed into the scope chain, count the current character
                if ($scope && !$push)
                    $_lexer_count($scope, $current);
            }
            // PUNCTUATORS (11.7)
            else if ($current == ')')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If the current context is a reserved context
                if ($scope && $_endsWith($scope.state, '('))
                {
                    // If the current context is a fusion context
                    if ($fusion && ($_startsWith($scope.state, '<@')
                                 || $_startsWith($scope.state, '</@')))
                    {
                        // If the current character is the closing of a fusion reserved context, append it to the state of the current context
                        if ($scope.parentheses == 1)
                            $append = $current;
                    }
                    // If the current character closes the reserved context
                    else if ($scope.parentheses == 0)
                    {
                        // Append the current character to the state of the current context, and pop it from the scope chain
                        $append = $current;
                        $pop++;
                    }
                }

                // If there's a current context and it isn't being popped from the scope chain, count the current character
                if ($scope && !$pop)
                    $_lexer_count($scope, $current);
            }
            // PUNCTUATORS (11.7)
            else if ($current == '[' || $current == ']')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If there's a current context in the scope chain, count the current character
                if ($scope)
                    $_lexer_count($scope, $current);
            }
            // PUNCTUATORS (11.7)
            else if ($current == ':')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If the current character opens an object value context, replace the state of the current context with it
                if ($scope && $scope.braces == 0 && $scope.state == '{')
                    $replace = '{:';
            }
            // PUNCTUATORS (11.7)
            else if ($current == ',')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';

                // If the current character opens an object key context, replace the state of the current context with it
                if ($scope && $scope.braces == 0 && $scope.state == '{:')
                    $replace = '{';
            }
            // PUNCTUATORS (11.7)
            else if ($current == ';'
                  || $current == '?'
                  || $current == '~')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptPunctuator';
            }
            // PUNCTUATORS (11.7)
            else if ($current == '=')
            {
                // Consume the `=` character, get the current character from the source, and set the state
                $current = $source[++$position];
                $state   = 'JavaScriptPunctuator';

                // If the punctuator is the equality operator
                if ($current == '=')
                {
                    // Consume the second `=` character and if the punctuator is the strict equality operator, consume the third `=` character
                    if ($source[++$position] == '=')
                        $position++;
                }
                // If the punctuator is an arrow function, consume the `>` character
                else if ($current == '>')
                    $position++;
            }
            // PUNCTUATORS (11.7)
            else if ($current == '&'
                  || $current == '|'
                  || $current == '+'
                  || $current == '-')
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // Consume the current character (and the next character if the punctuator is an assignment operator, increment/decrement operator, or a logical AND/OR)
                $position += $current == $peek || $peek == '=' ? 2 : 1;
                $state     = 'JavaScriptPunctuator';
            }
            // PUNCTUATORS (11.7)
            else if ($current == '!'
                  || $current == '*'
                  || $current == '^'
                  || $current == '%')
            {
                // Set the state
                $state = 'JavaScriptPunctuator';

                // If the punctuator is an assignment operator
                if ($source[$position + 1] == '=')
                {
                    // Consume both characters
                    $position += 2;

                    // If the punctuator is the strictly negated equality operator, consume the third `=` character
                    if ($current == '!' && $source[$position] == '=')
                        $position++;
                }
                // Consume the current character
                else
                    $position++;
            }
            // PUNCTUATORS (11.7)
            else if ($current == '<' || $current == '>')
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // If the punctuator is either a bitwise shift or a greater than or less than operator
                if ($current == $peek || $peek == '=')
                {
                    // Consume both characters and set the state
                    $position += 2;
                    $state     = 'JavaScriptPunctuator';

                    // If the punctuator is a bitwise shift
                    if ($current == $peek)
                    {
                        // Get the current character from the source
                        $current = $source[$position];

                        // If the punctuator is the zero-fill right shift, consume the current character and get the next character from the source
                        if ($peek == '>' && $current == '>')
                            $current = $source[++$position];

                        // If the punctuator is a bitwise assignment operator, consume the `=` character
                        if ($current == '=')
                            $position++;
                    }
                }
                else
                {
                    // Consume the current character and set the state
                    $position++;
                    $state = 'JavaScriptPunctuator';

                    // If the punctuator can open an HTML tag
                    if ($current == '<' && $scope)
                    {
                        var $index = -1;

                        // If the punctuator opens either a script end tag or an HTML comment
                        if ($peek == '/' && $_lexer_break($source, $position - 1, 'script', $current) || $peek == '!' && $source[$position + 1] == '-' && $source[$position + 2] == '-')
                        {
                            for (var $i = $scopes - 1; $i >= 0; $i--)
                            {
                                // If the current context is a script tag scope
                                if ($chain[$i].state == '<script')
                                {
                                    // Set the index of the closest script tag scope
                                    $index = $i;

                                    break;
                                }
                            }
                        }

                        // If current context is within a script tag scope
                        if ($index >= 0)
                        {
                            // If the tag is an HTML comment
                            if ($peek == '!')
                            {
                                // Consume the `!--` characters, set the state, and push an HTML comment context into the scope chain
                                $position += 3;
                                $state     = 'HTMLCommentOpen';
                                $push      = new Scope('<!--');
                            }
                            else
                            {
                                // Consume the `/` character, set the state, append the `>` character to the state of the current context and pop it from the scope chain
                                $position++;
                                $state  = 'HTMLEndTagOpen';
                                $append = '>';
                                $pop    = $scopes - $index;
                            }
                        }
                    }

                    // If fusion language components are supported and the punctuator doesn't open an HTML tag
                    if ($fusion && !$pop && !$push)
                    {
                        // If the current context is a fusion context
                        if ($current == '>' && $scope && ($_startsWith($scope.state, '<@')
                                                       || $_startsWith($scope.state, '</@')))
                        {
                            // If the current character is the self closing of a fusion start tag
                            if ($_endsWith($scope.state, '()') || $scope.state == '<@do'
                                                               || $scope.state == '<@else do')
                            {
                                // Set the state, append the current character to the state of the current context, and pop it from the scope chain
                                $state  = $_startsWith($scope.state, '</@') ?
                                          'FusionEndTagClose' :
                                          'FusionStartTagClose';
                                $append = $current;
                                $pop++;
                            }
                        }
                        // If the punctuator is a fusion end tag
                        else if ($current == '<' && $peek == '/' && $source[$position + 1] == '@' && $scope && $scope.state == '<@')
                        {
                            // Consume the `/@` characters and set the state
                            $position += 2;
                            $state     = 'FusionEndTagOpen';
                        }
                        // If the current character is the closing of a fusion start tag, set the state
                        else if ($current == '>' && $token && $token.type == 'FusionStartTagOpen')
                            $state = 'FusionStartTagClose';
                        // If the current character is the closing of a fusion end tag, set the state
                        else if ($current == '>' && $token && $token.type == 'FusionEndTagOpen')
                            $state = 'FusionEndTagClose';
                        // If the current characters and context declare an element
                        else if ($current == '<' && $_letter($peek) && $_lexer_regexp($token, $expression))
                        {
                            // Set the state and push the element context into the scope chain
                            $state = 'HTMLStartTagOpen';
                            $push  = new Scope('<');

                            // Count the opening tag in the element context
                            $_lexer_count($push, $current);
                        }
                    }
                }
            }
            // PUNCTUATORS (11.7)
            else if ($current == '.')
            {
                // Consume the `.` character, get the current character from the source, and set the state
                $current = $source[++$position];
                $state   = 'JavaScriptPunctuator';

                // If the punctuator is the spread operator, consume both `.` characters
                if ($current == '.' && $source[$position + 1] == '.')
                    $position += 2;
            }
            // If the current character opens a fusion context
            else if ($fusion && $current == '@')
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // Consume the current character and set the state
                $position++;
                $state = $peek == '{' ?
                         'FusionObjectOpen' :
                         $peek == '(' || $peek == '[' ?
                         'FusionSelectorOpen' :
                         'JavaScriptInvalidCharacter';

                // If the current character is either a fusion style or selector context
                if ($chain && ($peek == '{'
                            || $peek == '('
                            || $peek == '['))
                {
                    // Consume the punctuator character
                    $position++;

                    // If there's a scope chain
                    if ($chain)
                    {
                        // Push either a fusion style or selector context into the scope chain
                        $push = new Scope($current + $peek);
                        
                        // Count the punctuator in the style or selector context
                        $_lexer_count($push, $peek);
                    }
                }
            }
            else
            {
                // Consume the current character and set the state
                $position++;
                $state = 'JavaScriptInvalidCharacter';
            }

            break;

        // ---------- HTML ----------
        case 'html':
        case 'fhtml':
        case 'HTMLStartTagClose':
        case 'HTMLStartTagSelfClose':
        case 'HTMLEndTagClose':
        case 'HTMLCharacterReference':
        case 'HTMLCommentClose':
        case 'HTMLBogusCommentClose':
        case 'HTMLDOCTYPEClose':
        case 'HTMLCDATAClose':
        case 'FusionStartTagClose':
        case 'FusionStartTagSelfClose':
        case 'FusionEndTagClose':
        case 'FusionDirectiveTagClose':
        case 'FusionSubstitutionClose':

            // DATA STATE (12.2.4.1)
            $state = 'HTMLText';

        case 'HTMLText':

            // If the current tag is plaintext
            if ($scope && $scope.tag == 'plaintext')
            {
                // Move the position to the end of the source, append the `>` character to the current context, and pop it from the scope chain
                $position = $source.length;
                $append   = '>';
                $pop++;

                break;
            }

            do
            {
                // Get the current character from the source and check the RAWTEXT state
                var $current = $source[$position],
                    $rawtext = $scope && ($scope.state == '<iframe'
                                       || $scope.state == '<noembed'
                                       || $scope.state == '<noframes'
                                       || $scope.state == '<style'
                                       || $scope.state == '<xmp') ?
                               $scope.state.substr(1) :
                               null;

                // TAG OPEN STATE (12.2.4.8)
                if ($current == '<')
                {
                    // Get the next character from the source and check the CDATA and RCDATA state
                    var $peek    = $source[$position + 1],
                        $cdata   = $scope && ($scope.state == '<math'
                                           || $scope.state == '<svg') ?
                                   $scope.state.substr(1) :
                                   null,
                        $rcdata  = $scope && ($scope.state == '<textarea'
                                           || $scope.state == '<title') ?
                                   $scope.state.substr(1) :
                                   null;

                    // TAG NAME STATE (12.2.4.10)
                    if ($_letter($peek) && !$rawtext && !$rcdata)
                    {
                        // If these aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Consume the `<` character and set the state
                        $position++;
                        $state = 'HTMLStartTagOpen';

                        // If there's a current context in the scope chain, count the current character
                        if ($scope)
                            $_lexer_count($scope, $current);

                        break;
                    }
                    // END TAG OPEN STATE (12.2.4.9)
                    else if ($peek == '/')
                    {
                        // If `</` aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Get the next character from the source
                        $peek = $source[$position + 2];

                        // If the closing tag is a fusion end tag
                        if ($fusion && $peek == '@')
                        {
                            // Consume the `</@` characters and set the state
                            $position += 3;
                            $state     = 'FusionEndTagOpen';
                        }
                        // TAG NAME STATE (12.2.4.10)
                        else if ($_letter($peek) && (!$rawtext && !$rcdata || $_lexer_break($source, $position, $rawtext || $rcdata, $current)))
                        {
                            // Consume the `</` characters and set the state
                            $position += 2;
                            $state     = 'HTMLEndTagOpen';
                            
                            // RCDATA STATE (12.2.4.3)
                            // RAWTEXT STATE (12.2.4.5)
                            // CDATA SECTION STATE (12.2.4.68)
                            if ($rawtext || $rcdata || $cdata && $_lexer_break($source, $position - 2, $cdata, $current))
                            {
                                // Append the `>` character to the state of the current context and pop it from the scope chain
                                $append = '>';
                                $pop++;
                            }
                        }
                        // BOGUS COMMENT STATE (12.2.4.44)
                        else if (!$rawtext && !$rcdata)
                        {
                            // Consume the `</` characters and set the state
                            $position += 2;
                            $state     = 'HTMLBogusCommentOpen';
                        }
                        else
                            continue;

                        break;
                    }
                    // If the opening tag is a fusion start tag
                    else if ($fusion && $peek == '@')
                    {
                        // If `<@` aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Consume the `<@` characters and set the state
                        $position += 2;
                        $state     = 'FusionStartTagOpen';

                        break;
                    }
                    // MARKUP DECLARATION OPEN STATE (12.2.4.45)
                    else if ($peek == '!' && !$rawtext && !$rcdata)
                    {
                        // If `<!` aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Get the next character from the source
                        $peek = $source[$position + 2];

                        // DATA STATE (12.2.4.1)
                        if ($peek == '>')
                        {
                            // Consume the `<!` characters and set the state
                            $position += 2;
                            $state     = 'HTMLBogusCommentOpen';
                        }
                        // If the opening tag is a fusion directive tag
                        else if ($fusion && $peek == '@')
                        {
                            // Consume the `<!@` characters and set the state
                            $position += 3;
                            $state     = 'FusionDirectiveTagOpen';
                        }
                        // COMMENT START STATE (12.2.4.46)
                        else if ($peek == '-' && $source[$position + 3] == '-')
                        {
                            // Consume the `<!--` characters and set the state
                            $position += 4;
                            $state     = 'HTMLCommentOpen';
                        }
                        else
                        {
                            // Get the next string of seven characters
                            $peek = $source.substr($position + 2, 7);

                            // DOCTYPE STATE (12.2.4.52)
                            if ($peek == 'DOCTYPE')
                            {
                                // Consume the `<!DOCTYPE` characters and set the state
                                $position += 9;
                                $state     = 'HTMLDOCTYPEOpen';
                            }
                            // CDATA SECTION STATE (12.2.4.68)
                            else if ($peek == '[CDATA[' && $cdata)
                            {
                                // Consume the `<![CDATA[` characters and set the state
                                $position += 9;
                                $state     = 'HTMLCDATAOpen';
                            }
                            // BOGUS COMMENT STATE (12.2.4.44)
                            else
                            {
                                // Consume the `<!` characters and set the state
                                $position += 2;
                                $state     = 'HTMLBogusCommentOpen';
                            }
                        }

                        break;
                    }
                    // BOGUS COMMENT STATE (12.2.4.44)
                    else if ($peek == '?' && !$rawtext && !$rcdata)
                    {
                        // If `<?` aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Consume the `<?` characters and set the state
                        $position += 2;
                        $state     = 'HTMLBogusCommentOpen';

                        break;
                    }
                }
                // CHARACTER REFERENCE IN DATA STATE (12.2.4.2)
                else if ($current == '&' && !$rawtext)
                {
                    // Declare the helper function and get the next character from the source
                    var $helper = null,
                        $peek   = $source[$position + 1];

                    // If the character reference is a unicode character code
                    if ($peek == '#')
                    {
                        // Get the next character from the source
                        $peek = $source[$position + 2];

                        // If the character code is hexadecimal
                        if ($peek == 'x' || $peek == 'X')
                        {
                            // Get the next character from the source
                            $peek = $source[$position + 3];

                            // If the character code is hexadecimal
                            if ($_hexadecimal($peek))
                            {
                                // If these aren't the first characters, break (and don't consume them)
                                if ($position != $start)
                                    break;

                                // Consume the current characters and set the helper function
                                $position += 4;
                                $helper    = $_hexadecimal;
                            }
                        }
                        // If the character code is numeric
                        else if ($_number($peek))
                        {
                            // If these aren't the first characters, break (and don't consume them)
                            if ($position != $start)
                                break;

                            // Consume the current characters and set the helper function
                            $position += 3;
                            $helper    = $_number;
                        }
                    }
                    // If the character matches a named character reference
                    else if ($_letter($peek))
                    {
                        // If these aren't the first characters, break (and don't consume them)
                        if ($position != $start)
                            break;

                        // Consume the current characters and set the helper function
                        $position += 2;
                        $helper    = $_alphanumeric;
                    }

                    // If this isn't a character reference, continue (and consume the `&` character)
                    if (!$helper)
                        continue;

                    // Set the state
                    $state = 'HTMLCharacterReference';

                    // Consume any other characters in the range of the helper function
                    while ($helper($source[$position]))
                        $position++;

                    // If the next consumed character isn't a semi-colon, unconsume it
                    if ($source[$position++] != ';')
                        $position--;

                    break;
                }
                // If the current characters open a fusion substitution
                else if ($fusion && $current == '$' && $source[$position + 1] == '{')// && ($language == 'fhtml' || $scope && $scope.state == '<'))
                {
                    // If these aren't the first characters, break (and don't consume them)
                    if ($position != $start)
                        break;

                    // Consume the `${` characters, set the state, and push the substitution context into the scope chain
                    $position += 2;
                    $state     = 'FusionSubstitutionOpen';
                    $push      = new Scope('<${');

                    break;
                }
            }
            // Continue if the incremented position doesn't exceed the length
            while (++$position < $length);

            break;

        case 'HTMLStartTagOpen':
        case 'HTMLEndTagOpen':

            // TAG NAME STATE (12.2.4.10)
            if ($_letter($source[$position]))
            {
                // Set the state
                $state = $state != 'HTMLStartTagOpen' ?
                         'HTMLEndTagName' :
                         'HTMLStartTagName';

                // Consume the current character (and initially the first letter character)
                while (++$position < $length)
                {
                    // Get the current character from the source
                    var $current = $source[$position];

                    // If the current character isn't allowed in a tag name, break (and don't consume it)
                    if ($current == '>' || $current == '/' || $_space($current))
                        break;
                }

                // If there's a current context in the scope chain, set the current tag name
                if ($scope)
                    $scope.tag = $source.substring($start, $position).toLowerCase();

                break;
            }

        case 'HTMLEndTagName':
        case 'HTMLEndTagText':
        case 'HTMLEndTagWhitespace':

            // Set the end flag
            $end = $state != 'HTMLStartTagOpen';

        case 'HTMLStartTagName':
        case 'HTMLStartTagSolidus':
        case 'HTMLStartTagWhitespace':
        case 'HTMLAttributeName':
        case 'HTMLAttributeOperator':
        case 'HTMLAttributeValue':
        case 'HTMLAttributeDoubleQuotedValue':
        case 'HTMLAttributeSingleQuotedValue':
        case 'FusionAttributeTemplateString':
        case 'FusionAttributeTemplateStringTail':

            // Get the current character from the source
            var $current = $source[$position];

            // DATA STATE (12.2.4.1)
            if ($current == '>')
            {
                // Consume the `>` character and set the state
                $position++;
                $state = $end ?
                         'HTMLEndTagClose' :
                         'HTMLStartTagClose';

                // If there's a current context in the scope chain
                if ($scope)
                {
                    // If the tag is either an end tag or void tag, count the current character
                    if ($end || $_lexer_void($scope.tag))
                        $_lexer_count($scope, $current);

                    // If the tag being closed requires a context
                    if (!$end && ($scope.tag == 'script'
                               || $scope.tag == 'style'
                               || $scope.tag == 'iframe'
                               || $scope.tag == 'math'
                               || $scope.tag == 'noembed'
                               || $scope.tag == 'noframes'
                             //|| $scope.tag == 'noscript'
                               || $scope.tag == 'svg'
                               || $scope.tag == 'textarea'
                               || $scope.tag == 'title'
                               || $scope.tag == 'xmp'))
                        // Push a tag context into the scope chain
                        $push = new Scope('<' + $scope.tag);

                    // If the tag is not plaintext, reset the current tag name
                    if ($scope.tag != 'plaintext')
                        $scope.tag = '';
                }
            }
            // If the current character is whitespace
            else if ($_space($current))
            {
                // Consume the whitespace character and set the state
                $position++;
                $state = $end ?
                         'HTMLEndTagWhitespace' :
                         'HTMLStartTagWhitespace';

                // Consume any other whitespace characters
                while ($_space($source[$position]))
                    $position++;
            }
            // If the tag is an end tag
            else if ($end)
            {
                // Set the state
                $state = 'HTMLEndTagText';

                // Consume the current character
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the current character isn't allowed in an end tag text, break (and don't consume it)
                    if ($current == '>' || $_space($current))
                        break;
                }
            }
            // BEFORE ATTRIBUTE VALUE STATE (12.2.4.37)
            else if ($current == '=' && $token && $token.type == 'HTMLAttributeName')
            {
                // Consume the `=` character and set the state
                $position++;
                $state = 'HTMLAttributeOperator';
            }
            // ATTRIBUTE VALUE (DOUBLE-QUOTED/SINGLE-QUOTED/UNQUOTED) STATE (12.2.4.38/12.2.4.39/12.2.4.40)
            // CHARACTER REFERENCE IN ATTRIBUTE VALUE STATE (12.2.4.41)
            else if ($token && $token.type == 'HTMLAttributeOperator')
            {
                // Get the break character
                var $break = $current == '"'
                          || $current == "'"
                          || $current == '`' && $fusion ?// && ($language == 'fhtml' || $scope && $scope.state == '<') ?
                             $current :
                             null;

                // Set the state
                $state = $break == '`' ?
                         'FusionAttributeTemplateString' :
                         $break == '"' ?
                         'HTMLAttributeDoubleQuotedValue' :
                         $break == "'" ?
                         'HTMLAttributeSingleQuotedValue' :
                         'HTMLAttributeValue';

                // Consume the current character
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If a break character is set
                    if ($break)
                    {
                        // If the current character is an escape sequence
                        if ($break == '`' && $current == '\\')
                        {
                            // Consume the escape character and if there isn't another character, break
                            if (++$position >= $length)
                                break;

                            // If the current character is a carriage return and the next character is a line break, consume the carriage return
                            if ($source[$position] == '\r' && $source[$position + 1] == '\n')
                                $position++;
                        }
                        // If the current character is the break character
                        else if ($current == $break)
                        {
                            // Consume the break character
                            $position++;

                            break;
                        }
                        // If the state is a template string and the current character opens a template substitution
                        else if ($break == '`' && $current == '$' && $source[$position + 1] == '{')
                        {
                            // Consume the `${` characters, set the state, and push a substitution context into the scope chain
                            $position += 2;
                            $state     = 'FusionAttributeTemplateStringHead';
                            $push      = new Scope('=`${');

                            break;
                        }
                    }
                    // If the current character isn't allowed in an unquoted attribute value, break (and don't consume it)
                    else if ($current == '>' || $_space($current))
                        break;
                }
            }
            // SELF-CLOSING START TAG STATE (12.2.4.43)
            else if ($current == '/')
            {
                // Consume the `/` character, get the current character, and set the state
                $current = $source[++$position];
                $state   = 'HTMLStartTagSolidus';

                // DATA STATE (12.2.4.1)
                if ($current == '>')
                {
                    // Consume the `>` character and set the state
                    $position++;
                    $state = 'HTMLStartTagSelfClose';

                    // If there's a current context in the scope chain
                    if ($scope)
                    {
                        // Count the current character
                        $_lexer_count($scope, $current);

                        // Reset the current tag name
                        $scope.tag = '';
                    }
                }
                // Consume any other solidus characters
                else while ($current == '/')
                    $current = $source[++$position];
            }
            // ATTRIBUTE NAME STATE (12.2.4.35)
            // BEFORE/AFTER ATTRIBUTE NAME STATE (12.2.4.34/12.2.4.36)
            // AFTER ATTRIBUTE VALUE (QUOTED) STATE (12.2.4.42)
            else
            {
                // Set the state
                $state = 'HTMLAttributeName';

                // Consume the current character
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the current character isn't allowed in an attribute name, break (and don't consume it)
                    if ($current == '>' || $current == '/' || $current == '=' || $_space($current))
                        break;
                }
            }

            break;

        case 'HTMLCommentOpen':

            // COMMENT STATE (12.2.4.48)
            $state = 'HTMLCommentText';

        case 'HTMLCommentText':

            do
            {
                // Get the current character from the source
                var $current = $source[$position];

                // DATA STATE (12.2.4.1)
                if ($current == '>')
                {
                    // If `>` isn't the first character or the previous token did not open the comment, continue (and consume the `>` character)
                    if ($position != $start || !$token || $token.type != 'HTMLCommentOpen')
                        continue;

                    // Consume the `>` character and set the state
                    $position++;
                    $state = 'HTMLCommentClose';

                    break;
                }
                // COMMENT START/END DASH STATE (12.2.4.47/12.2.4.49)
                else if ($current == '-')
                {
                    // Get the next character from the source
                    var $peek = $source[$position + 1];

                    // DATA STATE (12.2.4.1)
                    if ($peek == '>')
                    {
                        // If `->` aren't the first characters or the previous token did not open the comment, continue (and consume the `-` character)
                        if ($position != $start || !$token || $token.type != 'HTMLCommentOpen')
                            continue;

                        // Consume the `->` characters and set the state
                        $position += 2;
                        $state     = 'HTMLCommentClose';

                        break;
                    }
                    // COMMENT END STATE (12.2.4.50)
                    else if ($peek == '-')
                    {
                        // Get the next character from the source
                        $peek = $source[$position + 2];

                        // DATA STATE (12.2.4.1)
                        // COMMENT END BANG STATE (12.2.4.51)
                        if ($peek == '>' || $peek == '!' && $source[$position + 3] == '>')
                        {
                            // If these aren't the first characters, break (and don't consume them)
                            if ($position != $start)
                                break;

                            // Consume the current characters and set the state
                            $position += $peek == '!' ? 4 : 3;
                            $state     = 'HTMLCommentClose';

                            break;
                        }
                    }
                }
            }
            // Continue if the incremented position doesn't exceed the length
            while (++$position < $length);

            // If the comment is being closed and the current context is a comment scope
            if ($state == 'HTMLCommentClose' && $scope && $scope.state == '<!--')
            {
                // Append the `>` character to the current context and pop it from the scope chain
                $append = '>';
                $pop++;
            }

            break;

        case 'HTMLBogusCommentOpen':

            // BOGUS COMMENT STATE (12.2.4.44)
            $state = 'HTMLBogusCommentText';

        case 'HTMLBogusCommentText':

            do
            {
                // DATA STATE (12.2.4.1)
                if ($source[$position] == '>')
                {
                    // If `>` isn't the first character, break (and don't consume it)
                    if ($position != $start)
                        break;

                    // Consume the `>` character and set the state
                    $position++;
                    $state = 'HTMLBogusCommentClose';

                    break;
                }
            }
            // Continue if the incremented position doesn't exceed the length
            while (++$position < $length);

            break;

        case 'HTMLDOCTYPEOpen':
        case 'HTMLDOCTYPEString':
        case 'HTMLDOCTYPEDoubleQuotedString':
        case 'HTMLDOCTYPESingleQuotedString':
        case 'HTMLDOCTYPEWhitespace':

            // Get the current character from the source
            var $current = $source[$position];

            // DATA STATE (12.2.4.1)
            if ($current == '>')
            {
                // Consume the `>` character and set the state
                $position++;
                $state = 'HTMLDOCTYPEClose';
            }
            // If the current character is whitespace
            else if ($_space($current))
            {
                // Consume the space character and set the state
                $position++;
                $state = 'HTMLDOCTYPEWhitespace';

                // Consume any other whitespace characters
                while ($_space($source[$position]))
                    $position++;
            }
            else
            {
                // Get the break character
                var $break = $current == '"' || $current == "'" ?
                             $current :
                             null;

                // Set the state
                $state = $current == '"' ?
                         'HTMLDOCTYPEDoubleQuotedString' :
                         $current == "'" ?
                         'HTMLDOCTYPESingleQuotedString' :
                         'HTMLDOCTYPEString';

                // Consume the current character
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If a break character is set
                    if ($break)
                    {
                        // If the current character is the break character
                        if ($current == $break)
                        {
                            // Consume the break character
                            $position++;

                            break;
                        }
                    }
                    // If the current character isn't allowed in a DOCTYPE string, break (and don't consume it)
                    else if ($current == '>' || $_space($current))
                        break;
                }
            }

            break;

        case 'HTMLCDATAOpen':

            // CDATA SECTION STATE (12.2.4.68)
            $state = 'HTMLCDATAText';

        case 'HTMLCDATAText':

            do
            {
                // DATA STATE (12.2.4.1)
                if ($source[$position] == ']' && $source[$position + 1] == ']' && $source[$position + 2] == '>')
                {
                    // If `]]>` aren't the first characters, break (and don't consume them)
                    if ($position != $start)
                        break;

                    // Consume the `]]>` characters and set the state
                    $position += 3;
                    $state     = 'HTMLCDATAClose';

                    break;
                }
            }
            // Continue if the incremented position doesn't exceed the length
            while (++$position < $length);

            break;

        // ---------- CSS ----------
        case 'css':
        case 'fcss':
        case 'CSSIdentifier':
        case 'CSSNumber':
        case 'CSSDelimiter':
        case 'CSSPunctuator':
        case 'CSSDimension':
        case 'CSSPercentage':
        case 'CSSComma':
        case 'CSSColon':
        case 'CSSSemicolon':
        case 'CSSDoubleQuotedString':
        case 'CSSSingleQuotedString':
        case 'CSSHash':
        case 'CSSFunction':
        case 'CSSAtKeyword':
        case 'CSSMatch':
        case 'CSSUrl':
        case 'CSSColumn':
        case 'CSSUnicodeRange':
        case 'CSSComment':
        case 'CSSWhitespace':
        case 'FusionObjectOpen':
        case 'FusionObjectSubstitutionClose':
        case 'FusionSelectorOpen':
        case 'FusionSelectorSubstitutionClose':
        case 'FusionStyleSubstitutionClose':

            // Get the current character from the source and check if it's numeric
            var $current = $source[$position],
                $numeric = $_number($current);

            // If the current character isn't a number but could be numeric
            if (!$numeric && ($current == '+'
                           || $current == '-'
                           || $current == '.'))
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // NUMBER (4.3.11)
                $numeric = $_number($peek) || $current != '.' && $peek == '.' && $_number($source[$position + 2]);
            }

            // NUMERIC (4.3.3)
            if ($numeric)
            {
                // Set the state
                $state = 'CSSNumber';

                // If the current character is not a decimal point
                if ($current != '.')
                {
                    // Consume the current character
                    $position++;

                    // Consume any other numeric characters
                    while ($_number($source[$position]))
                        $position++;

                    // Get the current character from the source
                    $current = $source[$position];
                }

                // If the current character is a decimal point
                if ($current == '.' && $_number($source[$position + 1]))
                {
                    // Consume the current characters
                    $position += 2;

                    // Consume any other numeric characters
                    while ($_number($source[$position]))
                        $position++;

                    // Get the current character from the source
                    $current = $source[$position];
                }

                // Get the next character from the source
                var $peek = $source[$position + 1];

                // If the current character is an exponential indicator and the next character is a numeric character (or it is preceded by a valid punctuator)
                if (($current == 'e' || $current == 'E') && ($_number($peek) || ($peek == '+' || $peek == '-') && $_number($source[$position + 2])))
                {
                    // Consume the current characters
                    $position += $peek == '+' || $peek == '-' ? 3 : 2;

                    // Consume any other numeric characters
                    while ($_number($source[$position]))
                        $position++;

                    // Get the current character from the source
                    $current = $source[$position];
                }

                // PERCENTAGE (4.3.3)
                if ($current == '%')
                {
                    // Consume the `%` character and set the state
                    $position++;
                    $state = 'CSSPercentage';

                    break;
                }
                // If the current character can't start an identifier
                else if (!$_letter($current) && $current != '_'
                                             && $current != '\\'
                                             && $current != '-'
                                             && $current <  '\u0080')
                    // Don't consume the current character
                    break;
            }

            // DIMENSION (4.3.3)
            // IDENT (4.3.10)
            if ($numeric || $_letter($current) || $current == '_'
                                               || $current == '\\'
                                               || $current == '#'
                                               || $current == '@'
                                               || $current == '-'
                                               || $current >= '\u0080')
            {
                // UNICODE-RANGE (4.3.7)
                if (!$numeric && ($current == 'u'
                               || $current == 'U') && $source[$position + 1] == '+' && ($_hexadecimal($source[$position + 2]) || $source[$position + 2] == '?'))
                {
                    // Consume the current characters and set the state
                    $position += 2;
                    $state = 'CSSUnicodeRange';

                    // Create the character count
                    var $count = 0;

                    // Count any six hexadecimal characters
                    while ($count < 6 && $_hexadecimal($source[$position + $count]))
                        $count++;

                    // Get the next character from the source
                    var $peek = $source[$position + $count];

                    // If the unicode range is a range
                    if ($peek == '-' && $_hexadecimal($source[$position + $count + 1]))
                    {
                        // Consume the counted hexadecimal characters along with the `-` character and reset the character count
                        $position += $count + 1;
                        $count     = 0;

                        // Count any six hexadecimal characters
                        while ($count < 6 && $_hexadecimal($source[$position + $count]))
                            $count++;
                    }
                    // If the unicode range is a 0-F range, count any six minus the character count `?` characters
                    else if ($peek == '?')
                        while ($count < 6 && $source[$position + $count] == '?')
                            $count++;

                    // Consume the counted characters
                    $position += $count;
                }
                // IDENT-LIKE (4.3.4)
                // HASH (4.3.12)
                // AT-KEYWORD (4.3.12)
                else
                {
                    // Set the state
                    $state = $numeric ?
                             'CSSDimension' :
                             $current == '#' ?
                             'CSSHash' :
                             $current == '@' ?
                             'CSSAtKeyword' :
                             'CSSIdentifier';

                    // If the current character is an escape character
                    if ($current == '\\')
                    {
                        // If the next character is a newline
                        if ($_newline($source[$position + 1]))
                        {
                            // If the identifier isn't numeric, consume the delimiter character
                            if (!$numeric)
                                $position++;

                            // Set the state
                            $state = $numeric ?
                                     'CSSNumber' :
                                     'CSSDelimiter';

                            break;
                        }

                        // Consume the escape character and if there is another character, consume it
                        if (++$position < $length)
                            $position++;
                    }
                    // If the current character is a delimiter character
                    else if ($current == '#'
                          || $current == '@'
                          || $current == '-')
                    {
                        // Get the next character from the source
                        var $peek = $source[$position + 1];

                        // If the next character isn't a valid starting identifier character
                        if (!$_letter($peek) &&  $peek != '_'
                                             &&  $peek != '-'
                                             && ($peek != '\\' || $_newline($source[$position + 2])) && $peek < '\u0080' && ($current != '#' || !$_number($peek)))
                        {
                            // If the identifier isn't numeric, consume the delimiter character
                            if (!$numeric)
                                $position++;

                            // Set the state
                            $state = $numeric ?
                                     'CSSNumber' :
                                     'CSSDelimiter';

                            break;
                        }
                        // If the current character is an at-keyword and the next character could be a delimiter
                        else if ($current == '@' && $peek == '-')
                        {
                            // Get the next character from the source
                            $peek = $source[$position + 2];

                            // If the next character isn't a valid starting identifier character
                            if (!$_letter($peek) &&  $peek != '_'
                                                 &&  $peek != '-'
                                                 && ($peek != '\\' || $_newline($source[$position + 3])) && $peek < '\u0080')
                            {
                                // Consume the delimiter character and set the state
                                $position++;
                                $state = 'CSSDelimiter';

                                break;
                            }

                            // Consume the current characters
                            $position += 3;
                        }
                        // Consume the current characters
                        else
                            $position += 2;
                    }
                    // Consume the current character
                    else
                        $position++;

                    do
                    {
                        // Get the current character from the source
                        $current = $source[$position];

                        // If the current character is an escape character
                        if ($current == '\\')
                        {
                            // If the next character is a newline, break (and don't consume the escape character)
                            if ($_newline($source[$position + 1]))
                                break;

                            // Consume the escape character and if there isn't another character, break
                            if (++$position >= $length)
                                break;
                        }
                        // If the current character isn't a valid identifier character
                        else if (!$_alphanumeric($current) && $current != '_'
                                                           && $current != '-'
                                                           && $current < '\u0080')
                            // Don't consume the current character
                            break;
                    }
                    // Continue if the incremented position doesn't exceed the length
                    while (++$position < $length);

                    // FUNCTION (4.3.4)
                    if ($current == '(' && $state == 'CSSIdentifier')
                    {
                        // Consume the `(` character and set the state
                        $position++;
                        $state = 'CSSFunction';

                        // If there's a current context, count the current character
                        if ($scope)
                            $_lexer_count($scope, $current);

                        // URL (4.3.4)
                        if ($position == $start + 4 && $source.substr($start, 3).toLowerCase() == 'url')
                        {
                            // Create the whitespace count
                            var $count = 0;

                            // Count any other whitespace characters
                            while ($_space($source[$position + $count]))
                                $count++;

                            // Get the next character from the source
                            var $peek = $source[$position + $count];

                            // If the next character isn't a string
                            if ($peek != '"' && $peek != "'")
                            {
                                // Consume the whitespace characters and set the state
                                $position += $count;
                                $state     = 'CSSUrl';

                                // If there isn't another character, break
                                if ($position >= $length)
                                    break;

                                do
                                {
                                    // Get the current character from the source
                                    $current = $source[$position];

                                    // If the language is HTML and the current character opens a style end tag, break (and don't consume the current character)
                                    if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'style', $current))
                                        break;

                                    // If the current character is a closing parentheses
                                    if ($current == ')')
                                    {
                                        // Consume the `)` character
                                        $position++;

                                        break;
                                    }
                                    // If the current character is an escape character, consume it and break if there isn't another character
                                    else if ($current == '\\' && ++$position >= $length)
                                        break;
                                }
                                // Continue if the incremented position doesn't exceed the length
                                while (++$position < $length);
                            }
                        }
                    }
                }
            }
            // COMMENTS (4.3.2)
            else if ($current == '/' && $source[$position + 1] == '*')
            {
                // Consume the `/` character and set the state
                $position++;
                $state = 'CSSComment';

                // Consume the current character (and initially the `*` character)
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the language is HTML and the current character opens a style end tag, break (and don't consume the current character)
                    if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'style', $current))
                        break;

                    // If the current characters close the comment
                    if ($current == '*' && $source[$position + 1] == '/')
                    {
                        // Consume the `*/` characters
                        $position += 2;

                        break;
                    }
                }
            }
            // WHITESPACE (4.3.1)
            else if ($_space($current))
            {
                // Consume the whitespace character and set the state
                $position++;
                $state = 'CSSWhitespace';

                // Consume any other whitespace characters
                while ($_space($source[$position]))
                    $position++;
            }
            // STRING (4.3.5)
            else if ($current == '"' || $current == "'")
            {
                // Get the break character
                var $break = $current;

                // Set the state
                $state = $break == '"' ?
                         'CSSDoubleQuotedString' :
                         'CSSSingleQuotedString';

                // Consume the current character (and initially the opening quotation mark)
                while (++$position < $length)
                {
                    // Get the current character from the source
                    $current = $source[$position];

                    // If the language is HTML and the current character opens a style end tag, break (and don't consume the current character)
                    if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'style', $current))
                        break;

                    // If the current character is an escape sequence
                    if ($current == '\\')
                    {
                        // Consume the escape character and if there isn't another character, break
                        if (++$position >= $length)
                            break;

                        // If the current character is a carriage return and the next character is a line break, consume the carriage return
                        if ($source[$position] == '\r' && $source[$position + 1] == '\n')
                            $position++;
                    }
                    // If the current character is the break character
                    else if ($current == $break)
                    {
                        // Consume the current character
                        $position++;

                        break;
                    }
                    // LINE TERMINATORS (11.3)
                    else if ($_newline($current))
                        break;
                }
            }
            // SUFFIX/SUBSTRING/PREFIX/DASH/INCLUDE MATCH (4.3.1)
            // COLUMN (4.3.1)
            else if ($current == '$'
                  || $current == '*'
                  || $current == '^'
                  || $current == '|'
                  || $current == '~')
            {
                // Get the next character from the source
                var $peek = $source[$position + 1];

                // If the current characters open a declaration substitution
                if ($fusion && $current == '$' && $peek == '{' && ($language == 'fcss' || $scope && ($scope.state == '@{:'
                                                                                                  || $scope.state == '@('
                                                                                                  || $scope.state == '@['
                                                                                                  || $scope.state == '<style')))
                {
                    // Consume the current characters, set the state, and push a declaration substitution context into the scope chain
                    $position += 2;
                    $state     = !$scope ?
                                 'FusionStyleSubstitutionOpen' :
                                 $scope.state == '@{:' ?
                                 'FusionObjectSubstitutionOpen' :
                                 $scope.state == '@(' || $scope.state == '@[' ?
                                 'FusionSelectorSubstitutionOpen' :
                                 'FusionStyleSubstitutionOpen';
                    $push      = new Scope($scope ?
                                           $scope.state + $current + $peek :
                                           $current + $peek);
                }
                // If the current character is a column
                else if ($current == '|' && $peek == '|')
                {
                    // Consume the current characters and set the state
                    $position += 2;
                    $state     = 'CSSColumn';
                }
                // If the current characters are a match
                else if ($peek == '=')
                {
                    // Consume the current characters and set the state
                    $position += 2;
                    $state     = 'CSSMatch';
                }
                else
                {
                    // Consume the current character and set the state
                    $position++;
                    $state = 'CSSDelimiter';
                }
            }
            // PARENTHESIS/BRACKET/CURLY BRACKET (4.3.1)
            else if ($current == '('
                  || $current == ')'
                  || $current == '['
                  || $current == ']'
                  || $current == '{'
                  || $current == '}')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'CSSPunctuator';

                // If there's a current context in the scope chain, count the current character
                if ($scope)
                    $_lexer_count($scope, $current);
            }
            // COMMA (4.3.1)
            else if ($current == ',')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'CSSComma';
            }
            // COLON (4.3.1)
            else if ($current == ':')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'CSSColon';

                // If the current context is a declaration name context, append the current character to make it a declaration value context
                if ($scope && $scope.state == '@{')
                    $append = $current;
            }
            // SEMICOLON (4.3.1)
            else if ($current == ';')
            {
                // Consume the current character and set the state
                $position++;
                $state = 'CSSSemicolon';

                // If the current context is a declaration value context, replace it with a declaration name context
                if ($scope && $scope.state == '@{:')
                    $replace = '@{';
            }
            // COMMENT (4.3.1)
            else if ($current == '<')
            {
                // Consume the `<` character, get the current character, and set the state
                $current = $source[++$position];
                $state   = 'CSSDelimiter';

                // If the current character opens a markup comment
                if ($current == '!' && $source[$position + 1] == '-' && $source[$position + 2] == '-' && $scope && $scope.state == '<style')
                {
                    // Consume the `!-` characters and set the state
                    $position += 2;
                    $state     = 'CSSComment';

                    // Consume the current character (and initially the second `-` character)
                    while (++$position < $length)
                    {
                        // Get the current character from the source
                        $current = $source[$position];

                        // If the language is HTML and the current character opens a style end tag, break (and don't consume the current character)
                        if (!$fusion && $language == 'html' && $_lexer_break($source, $position, 'style', $current))
                            break;

                        // If the current character closes the comment
                        if ($current == '-' && $source[$position + 1] == '-' && $source[$position + 2] == '>')
                        {
                            // Consume the `-->` characters
                            $position += 3;

                            break;
                        }
                    }
                }
                // If the punctuator is a markup end tag
                else if ($current == '/' && $scope && $scope.state == '<style' && $_lexer_break($source, $position - 1, 'style', '<'))
                {
                    // Consume the `/` character, set the state, append the `>` character to the state of the current context and pop it from the scope chain
                    $position++;
                    $state  = 'HTMLEndTagOpen';
                    $append = '>';
                    $pop++;
                }
            }
            else
            {
                // Consume the current character and set the state
                $position++;
                $state = 'CSSDelimiter';
            }

            break;

        default:

            return null;
    }

    // If either the style or selector states are being closed
    if ($fusion && $scope && (($scope.state == '@{'
                            || $scope.state == '@{:') && $scope.braces      == 0
                            || $scope.state == '@('   && $scope.parentheses == 0
                            || $scope.state == '@['   && $scope.brackets    == 0))
    {
        // Set the state, replace the state of the current context and pop it from the scope chain
        $state   = $scope.state == '@('
                || $scope.state == '@[' ?
                   'FusionSelectorClose' :
                   'FusionObjectClose';
        $replace = $scope.state == '@(' ?
                   '@()' :
                   $scope.state == '@[' ?
                   '@[]' :
                   '@{}';
        $pop++;
    }

    // Set the current position and state
    this.position = $position;
    this.state    = $state;

    // If the element state is being closed
    if ($fusion && $scope && $scope.state == '<' && $scope.tags == 0)
    {
        // Append the `>` character to the state of the current context and pop it from the scope chain
        $append = '>';
        $pop++;

        // Set the language state
        this.state = 'fjs';
    }
    // If a closing start tag is pushing a context into the scope chain
    else if ($push && $state == 'HTMLStartTagClose')
    {
        // If a script context is being pushed, set the language state
        if ($push.state == '<script')
            this.state = 'js';
        // If a style context is being pushed, set the language state
        else if ($push.state == '<style')
            this.state = 'css';
    }
    // If a closing comment tag is popping a context from the scope chain, set the language state
    else if ($pop && $state == 'HTMLCommentClose')
        this.state = 'js';

    // If there's a current context
    if ($scope)
    {
        // If there's a replacement string for the state, set the state of the current context
        if ($replace)
            $scope.state = $replace;

        // If there's an append string for the state, append the string to the state of the current context
        if ($append)
            $scope.state += $append;
    }

    // If there's a scope chain
    if ($chain)
    {
        // If a context should be pushed into the scope chain
        if ($push)
        {
            // If the pop flag is set and there are already contexts in the scope chain
            if ($pop && $scopes)
            {
                // If more than one context is being popped, pop all but the last popped context from the scope chain
                if ($pop > 1)
                    for (var $i = 1; $i < $pop; $i++)
                        $chain.pop();

                // Replace the last context
                $chain[$scopes - 1] = $push;
            }
            // Push the context into the scope chain
            else
                $chain.push($push);
        }
        // If the pop flag is set, pop the contexts from the scope chain
        else if ($pop)
            for (var $i = 1; $i <= $pop; $i++)
                $chain.pop();
    }

    // If no characters were consumed, return null
    if ($position == $start)
        return null;

    // Create the current token
    $token = new Token($state, $source, $start, $position);

    // If the state is neither whitespace nor a comment
    if (!$_lexer_whitespace($state) && !$_lexer_comment($state))
    {
        // Set the previous expression and token
        this.expression = $scope && $pop ?
                          $scope.state :
                          '';
        this.token      = $token.clone();
    }

    // Return the current token
    return $token;
}, true);
$_data(__Lexer__, 'peek',   function($position, $language)
{
    // Create a context-free lexer
    var $lexer = new Lexer();

    // Copy the lexer parameters
    $lexer.language = this.language;
    $lexer.position = $position || this.position;
    $lexer.source   = this.source;
    $lexer.state    = $language || this.state;

    // Get the next token
    var $peek = $lexer.next();

    while ($peek)
    {
        // Get the next token type
        var $type = $peek.type;

        // If the next token is neither whitespace nor a comment, break
        if (!$_lexer_whitespace($type) && !$_lexer_comment($type))
            break;

        // Get the next token
        $peek = $lexer.next();
    }

    // Return the next token
    return $peek;
}, true);
$_data(__Lexer__, 'reset',  function()
{
    // Reset the scope chain, expression, position, state, and previous token
    this.chain      = null;
    this.expression = '';
    this.position   = 0;
    this.state      = '';
    this.token      = null;
}, true);

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

// ########## HIGHLIGHT() ##########
$_defineMethod('highlight', function($source, $language, $strict)
{
    // Create the highlighter, HTML string, and token
    var $highlighter = new Highlighter($source, $language || 'fjs'),
        $html        = '',
        $token       = null;

    // If the strict flag isn't set, hack the highlighter
    if (!$strict)
        $highlighter.hack();

    // Append the HTML of each token to the HTML string
    while ($token = $highlighter.next())
        $html += $token.html();

    return $html;
});

// ########## PARSE() ##########
$_defineMethod('parse', function($source, $language, $strict)
{
    //
});

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
        if ($token.type == 'FusionSelectorOpen' || $token.type == 'FusionSelectorSubstitutionClose')
        {
            var $selector = '',
                $open     = $token.type == 'FusionSelectorOpen',
                $close    = true;

            do
            {
                if ($token.type == 'FusionSelectorSubstitutionOpen')
                {
                    var $peek = $lexer.peek();

                    if ($peek && $peek.type == 'JavaScriptPunctuator' && $peek.text() == '}')
                    {
                        $previous  = $lexer.token;

                        continue;
                    }

                    $selector += '"+(';
                    $close     = false;
                    $previous  = $lexer.token;

                    continue;
                }
                else if ($token.type == 'FusionSelectorSubstitutionClose')
                {
                    if ($previous && $previous.type == 'FusionSelectorSubstitutionOpen')
                    {
                        $previous  = $lexer.token;

                        continue;
                    }

                    $selector += ')+"';
                    $close     = true;
                    $previous  = $lexer.token;

                    continue;
                }
                else if (!$_startsWith($token.type, 'CSS') && $token.type != 'FusionSelectorOpen' && $token.type != 'FusionSelectorClose')
                    break;

                if ($_lexer_comment($token.type))
                    continue;

                var $text = $token.type == 'FusionSelectorOpen' ? $token.text().substr(1) : $token.text();

                $selector += $text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');
                $previous  = $lexer.token;
            }
            while ($token = $lexer.next());

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
        else if ($token.type == 'FusionObjectOpen' || $token.type == 'FusionObjectSubstitutionClose')
        {
            var $value = $token.type != 'FusionObjectOpen';

            do
            {
                if ($token.type == 'FusionObjectSubstitutionOpen')
                {
                    if ($previous && $previous.type == 'CSSColon')
                        $code += '"';

                    var $peek = $lexer.peek();

                    if ($peek && $peek.type == 'JavaScriptPunctuator' && $peek.text() == '}')
                    {
                        $previous  = $lexer.token;

                        continue;
                    }

                    $code    += '"+(';
                    $previous = $lexer.token;

                    continue;
                }
                else if ($token.type == 'FusionObjectSubstitutionClose')
                {
                    if ($previous && $previous.type == 'FusionObjectSubstitutionOpen')
                    {
                        $previous  = $lexer.token;

                        continue;
                    }

                    $code    += ')+"';
                    $previous = $lexer.token;

                    continue;
                }
                else if (!$_startsWith($token.type, 'CSS') && $token.type != 'FusionObjectOpen' && $token.type != 'FusionObjectClose')
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
                    if ($token.type == 'FusionObjectClose' && $lexer.state == 'fjs')
                    {
                        if (!$previous || $previous.type != 'CSSSemicolon')
                            $code += '"';

                        if ($space)
                            $code += $space.text();

                        $code    += $token.text();
                        $previous = $lexer.token;

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
                    {
                        var $peek = $lexer.peek();
                        
                        if (!$peek || $peek.type != 'JavaScriptPunctuator' || $peek.text() != '}')
                            $code += '"+(';
                    }
                    else if ($token.type == 'FusionObjectSubstitutionClose')
                    {
                        if (!$previous || $previous.type != 'FusionObjectSubstitutionOpen')
                            $code += ')+"';
                    }
                    else
                        $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                }
                else if ($token.type == 'CSSIdentifier' && $previous && ($previous.type == 'FusionObjectOpen' || $previous.type == 'CSSSemicolon'))
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
                    {
                        var $peek = $lexer.peek();
                        
                        if (!$peek || $peek.type != 'JavaScriptPunctuator' || $peek.text() != '}')
                            $code += '"+(';
                    }
                    else if ($token.type == 'FusionObjectSubstitutionClose')
                    {
                        if (!$previous || $previous.type != 'FusionObjectSubstitutionOpen')
                            $code += ')+"';
                    }
                    else
                        $code += $token.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                }
                else
                {
                    if ($space)
                        $code += $space.text();

                    $code += $token.type == 'FusionObjectOpen' ? $token.text().substr(1) : $token.text();
                }

                $previous = $lexer.token;
            }
            while ($token = $lexer.next());
        }

        if (!$token)
            break;

        if ($token.type == 'FusionProperty')
            $code += '.__' + $token.text().substr(1);
        else if ($token.type == 'FusionSubstitutionOpen' || $token.type == 'FusionStyleSubstitutionOpen')
            $code += '"+(';
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
                else if ($previous && ($previous.type == 'FusionAttributeTemplateString'
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
                else if ($token.type == 'HTMLStartTagSelfClose' && $previous && ($previous.type == 'FusionAttributeTemplateString'
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
                else if ($previous && ($previous.type == 'FusionAttributeTemplateString'
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
                else if ($previous && ($previous.type == 'FusionAttributeTemplateString'
                                    || $previous.type == 'FusionAttributeTemplateStringTail'))
                    $code += ')';
            }
            else if ($token.type == 'FusionAttributeTemplateString'
                  || $token.type == 'FusionAttributeTemplateStringHead'
                  || $token.type == 'FusionAttributeTemplateStringMiddle'
                  || $token.type == 'FusionAttributeTemplateStringTail')
            {
                var $substring = $token.text(),
                    $head      = $substring[0] == '`',
                    $tail      = $substring[$substring.length - 1] == '`';

                if ($head)
                    $code += '"';
                else if (!$previous || ($previous.type != 'FusionAttributeTemplateStringHead' && $previous.type != 'FusionAttributeTemplateStringMiddle') || $previous.source[$previous.end - 1] == '`')
                    $code += ')+"';

                $code += $substring.substr(1, $tail ? $substring.length - 2 : $substring.length - 3).replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');

                if (!$tail)
                {
                    var $peek = $lexer.peek();

                    if (!$peek || $peek.type != 'JavaScriptPunctuator' || $peek.text() != '}')
                        $code += '"+(';
                }
                else
                    $code += '"';
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

            if ($head && $previous && ($previous.type == 'JavaScriptIdentifier' || $previous.type == 'JavaScriptPunctuator' && ($previous.text() == ')' || $previous.text() == ']')))
            {
                // TO DO: TAGGED TEMPLATE LITERALS
            }

            if ($head)
                $code += '"';
            else if (!$previous || $previous.type != 'JavaScriptTemplateString' || $previous.source[$previous.end - 1] == '`')
                $code += ')+"';

            $code += $substring.substr(1, $tail ? $substring.length - 2 : $substring.length - 3).replace(/"/g, '\\"').replace(/\n/g, '\\n\\\n');

            if (!$tail)
            {
                var $peek = $lexer.peek();

                if (!$peek || $peek.type != 'JavaScriptPunctuator' || $peek.text() != '}')
                    $code += '"+(';
            }
            else
                $code += '"';
        }
        else
            $code += $token.text();

        $previous = $lexer.token;
    }

    if ($tags.length)
        throw 'unmatched <' + $tags[$tags.length - 1] + '> tag';

    return $code;
});

// If the AMD module pattern is being used, define the module
if (typeof define == 'function' && define.amd)
    define(function()
    {
        // Return the global namespace
        return fusion;
    });
// If the CommonJS module pattern is being used, set the module exports as the global namespace
else if (typeof module != 'undefined' && module != null && module.exports)
    module.exports = fusion;
// Define the global namespace
else
    (function($global)
    {
        // Get the global shorthand string and writable flag
        var $shorthand = global['f_Shorthand'],
            $writable  = global['f_Writable'];

        // If the global shorthand flag is not a string, set a default shorthand string if the flag is not false
        if (typeof $shorthand != 'string')
            $shorthand = $shorthand === true ? 'f' : '';

        // If the global writable flag is not a boolean, set a default value of true if intellisense is enabled
        if (typeof $writable != 'boolean')
            $writable = typeof global['intellisense'] != 'undefined';

        // If a global reference was not found or the global namespace has already been defined (and the global writable flag is not set), return
        if (!$global || $__hasOwnProperty__.call($global, 'fusion') && !$writable)
            return;

        // If the global shorthand string is set, define the shorthand reference
        if ($shorthand)
            $_data($global, $shorthand, fusion, $writable);

        // Define the global namespace
        $_data($global, 'fusion', fusion, $writable);
    })
    // If a window reference was found, use the window reference as the global reference
    ($_window.window === $_window ? $_window : global);

})(this);