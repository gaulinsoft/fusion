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