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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaulinsoft.Web.Fusion
{
    public static class Helpers
    {
        public static bool IsAlphanumeric(char character)
        {
            // Return true if the character is either a letter or number
            return (character >= 'a' && character <= 'z'
                 || character >= 'A' && character <= 'Z'
                 || character >= '0' && character <= '9');
        }

        public static bool IsBinary(char character)
        {
            // Return true if the character is either one or zero
            return character == '0' || character == '1';
        }

        public static bool IsHexadecimal(char character)
        {
            // Return true if the character is a hexadecimal letter or a number
            return (character >= 'a' && character <= 'f'
                 || character >= 'A' && character <= 'F'
                 || character >= '0' && character <= '9');
        }

        public static bool IsLetter(char character)
        {
            // Return true if the character is a letter
            return (character >= 'a' && character <= 'z'
                 || character >= 'A' && character <= 'Z');
        }

        public static bool IsNewline(char character)
        {
            // LINE TERMINATORS (11.3)
            return (character == '\r'
                 || character == '\n'
                 || character == '\u2028'
                 || character == '\u2029');
        }

        public static bool IsNumber(char character)
        {
            // Return true if the character is a number
            return character >= '0' && character <= '9';
        }

        public static bool IsOctal(char character)
        {
            // Return true if the character is an octal number
            return character >= '0' && character <= '7';
        }

        public static bool IsSpace(char character)
        {
            // COMMON PARSER IDIOMS (2.4.1)
            return (character == ' '
                 || character == '\r'
                 || character == '\n'
                 || character == '\t'
                 || character == '\f');
        }
        
        public static bool IsWhitespace(char character)
        {
            // WHITE SPACE (11.2)
            return (character == '\t'
                 || character == '\v'
                 || character == '\f'
                 || character == ' '
                 || character == '\u00A0'
                 || character == '\uFEFF');
        }
    }
}