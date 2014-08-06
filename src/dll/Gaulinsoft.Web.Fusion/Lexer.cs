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
    public class Lexer
    {
        public Lexer(string source = null, string language = null)
        {
            // If source code was provided, set it
            if (!String.IsNullOrEmpty(source))
                this.Source = source;

            // If a language wasn't provided, return
            if (String.IsNullOrEmpty(language))
                return;

            // Set the language and create the scope chain
            this.Language = language;
            this.Chain    = language == "fhtml" ?
                            new List<Scope>(new Scope[] { new Scope() }) :
                            language == "fjs"
                         || language == "fcss" ?
                            new List<Scope>() :
                            null;
        }

        protected void CountPunctuator(Scope scope, char character)
        {
            // If the character is either an opening or closing brace, adjust the braces count of the scope
            if (character == '{' || character == '}')
                scope.Braces += character == '{' ?
                                1 :
                                scope.Braces != 0 ?
                                -1 :
                                0;
            // If the character is either an opening or closing parentheses, adjust the parentheses count of the scope
            else if (character == '(' || character == ')')
                scope.Parentheses += character == '(' ?
                                     1 :
                                     scope.Parentheses != 0 ?
                                     -1 :
                                     0;
            // If the character is either an opening or closing bracket, adjust the brackets count of the scope
            else if (character == '[' || character == ']')
                scope.Brackets += character == '[' ?
                                  1 :
                                  scope.Brackets != 0 ?
                                  -1 :
                                  0;
            // If the character is either an opening or closing tag, adjust the tags count of the scope
            else if (character == '<' || character == '>')
                scope.Tags += character == '<' ?
                              1 :
                              scope.Tags != 0 ?
                              -1 :
                              0;
        }

        public static bool IsComment(string state)
        {
            // Return true if the state is a comment
            return (state == Token.JavaScriptBlockComment
                 || state == Token.JavaScriptLineComment
                 || state == Token.HTMLCommentOpen
                 || state == Token.HTMLCommentText
                 || state == Token.HTMLCommentClose
                 || state == Token.HTMLBogusCommentOpen
                 || state == Token.HTMLBogusCommentText
                 || state == Token.HTMLBogusCommentClose
                 || state == Token.CSSComment);
        }

        protected static bool IsRegExp(Token token, string expression = null)
        {
            // If no token was provided, return true
            if (token == null)
                return true;

            // Get the token type
            string type = token.Type;

            // If the token is a punctuator
            if (type == Token.JavaScriptPunctuator)
            {
                // Get the token text
                string text = token.Text();

                // Return true if the punctuator cannot preceed a division operator
                return ((text != ")" || !String.IsNullOrEmpty(expression) && (expression == "for()"
                                                                           || expression == "if()"
                                                                         //|| expression == "let()"
                                                                           || expression == "while()"
                                                                           || expression == "with()"))
                     && (text != "}" || String.IsNullOrEmpty(expression)   || expression != "{}")
                     &&  text != "]"
                     &&  text != "++"
                     &&  text != "--");
            }
            // If the token is a reserved word
            else if (type == Token.JavaScriptReservedWord)
            {
                // Get the token text
                string text = token.Text();

                // Return true if the reserved word can preceed an expression
                return (text == "case"
                     || text == "delete"
                     || text == "do"
                     || text == "else"
                     || text == "extends"
                     || text == "in"
                     || text == "instanceof"
                     || text == "new"
                     || text == "return"
                     || text == "throw"
                     || text == "typeof"
                     || text == "void"
                     || text == "yield");
            }
            // If the token is a template string, return true if the template string is a substitution head or middle
            else if (type == Token.JavaScriptTemplateString)
                return !token.Source.EndsWith("`");

            // Return true if the token is either a template string head, middle, or substitution open
            return (type == Token.FusionAttributeTemplateStringHead
                 || type == Token.FusionAttributeTemplateStringMiddle
                 || type == Token.FusionSubstitutionOpen
                 || type == Token.FusionObjectSubstitutionOpen
                 || type == Token.FusionSelectorSubstitutionOpen
                 || type == Token.FusionStyleSubstitutionOpen);
        }

        public static bool IsText(string state)
        {
            // Return true if the state is plain text
            return (state == Token.JavaScriptInvalidCharacter
                 || state == Token.HTMLText
                 || state == Token.HTMLEndTagText);
        }

        public static bool IsVoid(string tag)
        {
            // Return true if the tag is a void HTML element
            return (tag == "area"
                 || tag == "base"
                 || tag == "br"
                 || tag == "col"
                 || tag == "embed"
                 || tag == "hr"
                 || tag == "img"
                 || tag == "input"
                 || tag == "keygen"
                 || tag == "link"
                 || tag == "menuitem"
                 || tag == "meta"
                 || tag == "param"
                 || tag == "source"
                 || tag == "track"
                 || tag == "wbr");
        }

        public static bool IsWhitespace(string state)
        {
            // Return true if the state is whitespace
            return (state == Token.JavaScriptWhitespace
                 || state == Token.HTMLStartTagWhitespace
                 || state == Token.HTMLEndTagWhitespace
                 || state == Token.HTMLDOCTYPEWhitespace
                 || state == Token.CSSWhitespace);
        }

        public string Language   { get; set; }
        public string Source     { get; set; }
        public string State      { get; set; }
        public string Expression { get; set; }
        public int    Position   { get; set; }
        
        public Token       Token { get; set; }
        public List<Scope> Chain { get; set; }

        public Lexer Clone()
        {
            // Create a context-free lexer
            var lexer = new Lexer();

            // Copy the lexer parameters
            lexer.Chain      = this.Chain != null ?
                               this.Chain.Select(s => s.Clone()).ToList() :
                               null;
            lexer.Expression = this.Expression;
            lexer.Language   = this.Language;
            lexer.Position   = this.Position;
            lexer.Source     = this.Source;
            lexer.State      = this.State;
            lexer.Token      = this.Token != null ?
                               this.Token.Clone() :
                               null;

            // Return the lexer
            return lexer;
        }

        public bool Equals(Lexer lexer)
        {
            // If a lexer wasn't provided, return false
            if (lexer == null)
                return false;

            // Get the scope chains
            var chainLexer = lexer.Chain;
            var chainThis  = this.Chain;

            // If the lexers don't have matching scope chain lengths, return false
            if ((chainThis != null ? chainThis.Count : 0) != (chainLexer != null ? chainLexer.Count : 0))
                return false;

            // If the lexers have scope chains, return false if they are not equal
            if (chainThis != null)
                for (int i = 0, j = chainThis.Count; i < j; i++)
                    if (!chainThis[i].Equals(chainLexer[i]))
                        return false;

            // If the lexers don't have matching previous tokens, return false
            if ((this.Token == null) != (lexer.Token == null) || this.Token != null && !this.Token.Equals(lexer.Token))
                return false;

            // Return true if the lexer has the same previous expression, language, and state
            return (this.Expression == lexer.Expression
                 && this.Language   == lexer.Language
                 && this.State      == lexer.State);
        }

        public bool Hack()
        {
            // If a scope chain already exists, return false
            if (this.Chain != null)
                return false;

            // Get the language
            var language = this.Language;

            // Create the scope chain
            this.Chain = language == "html"
                      || language == "fhtml" ?
                         new List<Scope>(new Scope[] { new Scope() }) :
                         language == "js"
                      || language == "fjs"
                      || language == "fcss" ?
                         new List<Scope>() :
                         null;

            // Return true if a scope chain was created
            return this.Chain != null;
        }

        public Token Next()
        {
            // Get the current position, state, and scope
            string source     = this.Source;
            int    length     = source.Length;
            int    start      = this.Position;
            var    token      = this.Token;
            string expression = this.Expression;
            string language   = this.Language;
            int    position   = this.Position;
            string state      = !String.IsNullOrEmpty(this.State) ?
                                this.State :
                                language;
            bool   fusion     = language == "fjs"
                             || language == "fhtml"
                             || language == "fcss";
            var    chain      = this.Chain;
            int    scopes     = chain != null ?
                                chain.Count :
                                0;
            var    scope      = scopes > 0 ?
                                chain[scopes - 1] :
                                null;

            // If the position is invalid, return null
            if (position < 0 || position >= length)
                return null;

            // Create the context parameters
            string append  = "";
            char   current = '\0';
            bool   end     = false;
            bool   pop     = false;
            Scope  push    = null;
            string replace = "";

            switch (state)
            {
                // ---------- JavaScript ----------
                case "js":
                case "fjs":
                case Token.JavaScriptIdentifier:
                case Token.JavaScriptReservedWord:
                case Token.JavaScriptPunctuator:
                case Token.JavaScriptNumber:
                case Token.JavaScriptDoubleQuotedString:
                case Token.JavaScriptSingleQuotedString:
                case Token.JavaScriptTemplateString:
                case Token.JavaScriptRegExp:
                case Token.JavaScriptBlockComment:
                case Token.JavaScriptLineComment:
                case Token.JavaScriptInvalidCharacter:
                case Token.JavaScriptWhitespace:
                case Token.FusionStartTagOpen:
                case Token.FusionEndTagOpen:
              //case Token.FusionDirectiveTagOpen:
                case Token.FusionProperty:
                case Token.FusionAttributeTemplateStringHead:
                case Token.FusionAttributeTemplateStringMiddle:
                case Token.FusionSubstitutionOpen:
                case Token.FusionObjectSubstitutionOpen:
                case Token.FusionSelectorSubstitutionOpen:
                case Token.FusionStyleSubstitutionOpen:

                    // Get the current character from the source
                    current = source[position];

                    // NAMES AND KEYWORDS (11.6)
                    // LITERALS (11.8)
                    if (Helpers.IsLetter(current) || current == '_'
                                                  || current == '$'
                                                  || current == '\\'
                                                  || current == '@' && fusion && token != null && (token.Type == Token.JavaScriptIdentifier
                                                                                               || (token.Type == Token.JavaScriptPunctuator || token.Type == Token.CSSPunctuator) && (source[token.Start] == ')'
                                                                                                                                                                                   || source[token.Start] == ']')))
                    {
                        // If the current character isn't an escape sequence, consume the current character
                        if (current != '\\')
                            position++;

                        // Set the state
                        state = current == '@' ?
                                Token.FusionProperty :
                                Token.JavaScriptIdentifier;

                        do
                        {
                            // Get the current character from the source
                            current = source.ElementAtOrDefault(position);

                            // If the current character is a valid identifier character
                            if (Helpers.IsAlphanumeric(current) || current == '_'
                                                                || current == '$'
                                                                || current == '\u200C'
                                                                || current == '\u200D')
                                // Consume the current character
                                continue;

                            // If the current character isn't an escape sequence, break (and don't consume it)
                            if (current != '\\')
                                break;

                            // Get the next character from the source
                            char peek = source.ElementAtOrDefault(position + 1);

                            // If the current character isn't an escape sequence, break
                            if (peek != 'u')
                                break;

                            // Get the next character from the source
                            peek = source.ElementAtOrDefault(position + 2);

                            // If the next character opens an ECMAScript 6 unicode escape sequence
                            if (peek == '{')
                            {
                                // Create the character counter
                                int characters = 0;

                                // Count the next hexadecimal characters
                                while (Helpers.IsHexadecimal(source.ElementAtOrDefault(position + characters + 3)))
                                    characters++;

                                // If there are any hexadecimal characters and the escape sequence is properly closed, consume the ECMAScript 6 unicode escape sequence
                                if (characters > 0 && source.ElementAtOrDefault(position + characters + 3) == '}')
                                    position += characters + 3;
                                else
                                    break;
                            }
                            // If the following four characters are hexadecimal
                            else if (Helpers.IsHexadecimal(peek) && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + 3))
                                                                 && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + 4))
                                                                 && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + 5)))
                                // Consume the unicode escape sequence
                                position += 5;
                            else
                                break;
                        }
                        // Continue if the incremented position doesn't exceed the length
                        while (++position < length);

                        // If no characters were consumed
                        if (position == start)
                        {
                            // Consume the current character and set the state
                            position++;
                            state = Token.JavaScriptInvalidCharacter;
                        }
                        // IDENTIFIER NAMES (11.6.1)
                        else if ((token == null || token.Type != Token.JavaScriptPunctuator || token.Text() != ".") && (!fusion || state != Token.FusionProperty))
                        {
                            // Get the identifier from the source
                            string identifier = source.Substring(start, position - start);

                            // If the previous token was a fusion markup tag and the current identifier opens a fusion context
                            if (fusion && token != null && (token.Type == Token.FusionStartTagOpen && (identifier == "break"
                                                                                                    || identifier == "case"
                                                                                                    || identifier == "continue"
                                                                                                    || identifier == "default"
                                                                                                    || identifier == "do"
                                                                                                    || identifier == "else"
                                                                                                    || identifier == "for"
                                                                                                    || identifier == "if"
                                                                                                    || identifier == "switch"
                                                                                                    || identifier == "while")
                                                         || token.Type == Token.FusionEndTagOpen   &&  identifier == "while"))
                            {
                                // Set the state and push a fusion context into the scope chain
                                state = Token.JavaScriptReservedWord;
                                push  = new Scope(token.Type == Token.FusionEndTagOpen ?
                                                  "</@" + identifier :
                                                  "<@"  + identifier);
                            }
                            // RESERVED WORDS (11.6.2)
                            // NULL LITERALS (11.8.1)
                            // BOOLEAN LITERALS (11.8.2)
                            else if (identifier == "null"
                                  || identifier == "false"
                                  || identifier == "true"
                                  || identifier == "break"
                                  || identifier == "case"
                                  || identifier == "catch"
                                  || identifier == "class"
                                  || identifier == "const"
                                  || identifier == "continue"
                                  || identifier == "debugger"
                                  || identifier == "default"
                                  || identifier == "delete"
                                  || identifier == "do"
                                  || identifier == "else"
                                  || identifier == "enum"
                                  || identifier == "export"
                                  || identifier == "extends"
                                  || identifier == "finally"
                                  || identifier == "for"
                                  || identifier == "function"
                                  || identifier == "if"
                                  || identifier == "implements"
                                  || identifier == "import"
                                  || identifier == "in"
                                  || identifier == "instanceof"
                                  || identifier == "interface"
                                  || identifier == "let"
                                  || identifier == "new"
                                  || identifier == "package"
                                  || identifier == "private"
                                  || identifier == "protected"
                                  || identifier == "public"
                                  || identifier == "return"
                                  || identifier == "static"
                                  || identifier == "super"
                                  || identifier == "switch"
                                  || identifier == "this"
                                  || identifier == "throw"
                                  || identifier == "try"
                                  || identifier == "typeof"
                                  || identifier == "var"
                                  || identifier == "void"
                                  || identifier == "while"
                                  || identifier == "with"
                                  || identifier == "yield")
                            {
                                // Get the previous token text if it's a reserved word
                                string text = token != null && token.Type == Token.JavaScriptReservedWord ?
                                              token.Text() :
                                              null;

                                // If the previous token is neither the get nor set reserved word and the current context isn't an object key context, set the state
                                if ((String.IsNullOrEmpty(text) || text != "get" && text != "set") && (scope == null || scope.State != "{"))
                                    state = Token.JavaScriptReservedWord;

                                // If the previous token is the `else` reserved word and the identifier can be appended to the state of the current context
                                if (fusion && text == "else" && scope != null && scope.State == "<@else" && (identifier == "do"
                                                                                                          || identifier == "for"
                                                                                                          || identifier == "if"
                                                                                                          || identifier == "switch"
                                                                                                          || identifier == "while"))
                                    // Append the identifier to the state of the current context
                                    append = " " + identifier;
                            }
                            // If the identifier is either `get` or `set` and the current context is an object key
                            else if ((identifier == "get"
                                   || identifier == "set") && scope != null && scope.State == "{")
                            {
                                // Get the next token and its type
                                var    peek = this.Peek(position);
                                string type = peek != null ?
                                              peek.Type :
                                              null;

                                // If the next token is either an identifier or reserved word
                                if (type == Token.JavaScriptIdentifier || type == Token.JavaScriptReservedWord)
                                {
                                    // Get the next token and its type
                                    peek = this.Peek(peek.End);
                                    type = peek != null ?
                                           peek.Type :
                                           null;

                                    // If the next token is an opening parentheses
                                    if (type == Token.JavaScriptPunctuator && source[peek.Start] == '(')
                                    {
                                        // Set the state and replace the state of the current context with an object value context
                                        state   = Token.JavaScriptReservedWord;
                                        replace = "{:";
                                    }
                                }
                            }
                        }
                    }
                    // WHITE SPACE (11.2)
                    // LINE TERMINATORS (11.3)
                    else if (Helpers.IsWhitespace(current) || Helpers.IsNewline(current))
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptWhitespace;

                        do
                        {
                            // Get the current character from the source
                            current = source.ElementAtOrDefault(position);

                            // If the current character is neither whitespace nor a newline, break (and don't consume it)
                            if (!Helpers.IsWhitespace(current) && !Helpers.IsNewline(current))
                                break;
                        }
                        // Continue if the incremented position doesn't exceed the length
                        while (++position < length);
                    }
                    // STRING LITERALS (11.8.4)
                    // TEMPLATE LITERALS (11.8.6)
                    else if (current == '"'
                          || current == '\''
                          || current == '`' && chain != null
                          || current == '}' && scope != null && scope.Braces == 0 && scope.State.EndsWith("`${"))
                    {
                        // Check if the template string is an attribute and get the break character
                        bool attribute = current == '}' && scope.State == "=`${";
                        char @break    = current != '}' ?
                                         current :
                                         '`';

                        // Set the state
                        state = attribute ?
                                Token.FusionAttributeTemplateStringTail :
                                @break == '"' ?
                                Token.JavaScriptDoubleQuotedString :
                                @break == '\'' ?
                                Token.JavaScriptSingleQuotedString :
                                Token.JavaScriptTemplateString;

                        // If the template string is either a middle or tail substitution
                        if (current == '}')
                        {
                            // Append the characters to the state of the current context and pop it from the scope chain
                            append = current + "" + @break;
                            pop    = true;
                        }

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If the current character is an escape sequence
                            if (current == '\\')
                            {
                                // Consume the escape character and if there isn't another character, break
                                if (++position >= length)
                                    break;

                                // If the current character is a carriage return and the next character is a line break, consume the carriage return
                                if (source[position] == '\r' && source.ElementAtOrDefault(position + 1) == '\n')
                                    position++;
                            }
                            // If the current character is the break character
                            else if (current == @break)
                            {
                                // Consume the current character
                                position++;

                                break;
                            }
                            // If the state is a template string
                            else if (@break == '`')
                            {
                                // If the current character opens a template substitution
                                if (current == '$' && source.ElementAtOrDefault(position + 1) == '{')
                                {
                                    // Consume the `${` characters and push a substitution context into the scope chain
                                    position += 2;
                                    push      = new Scope(pop ?
                                                          scope.State :
                                                          "`${");

                                    // If the template string is an attribute, set the state
                                    if (attribute)
                                        state = Token.FusionAttributeTemplateStringMiddle;

                                    break;
                                }
                            }
                            // LINE TERMINATORS (11.3)
                            else if (Helpers.IsNewline(current))
                                break;
                        }
                    }
                    // If the current character could be a comment, regular expression literal, or division punctuator (then prepare for some ambiguity)
                    else if (current == '/')
                    {
                        // Get the next character from the source
                        var peek = source.ElementAtOrDefault(position + 1);

                        // COMMENTS (11.4)
                        if (peek == '*')
                        {
                            // Consume the `/` character and set the state
                            position++;
                            state = Token.JavaScriptBlockComment;

                            // Consume the current character (and initially the `*` character)
                            while (++position < length)
                            {
                                // If the current characters close the comment
                                if (source[position] == '*' && source.ElementAtOrDefault(position + 1) == '/')
                                {
                                    // Consume the `*/` characters
                                    position += 2;

                                    break;
                                }
                            }
                        }
                        // COMMENTS (11.4)
                        else if (peek == '/')
                        {
                            // Consume the first `/` character and set the state
                            position++;
                            state = Token.JavaScriptLineComment;

                            // Consume the current character (and initially the second `/` character)
                            while (++position < length)
                            {
                                // If the current character is a newline, break (and don't consume it)
                                if (Helpers.IsNewline(source[position]))
                                    break;
                            }
                        }
                        // If the current character is the self closing of a fusion start tag
                        else if (fusion && peek == '>' && scope != null && scope.State.StartsWith("<@") && (scope.State == "<@break"
                                                                                                         || scope.State == "<@case"
                                                                                                         || scope.State == "<@continue"
                                                                                                         || scope.State == "<@default"
                                                                                                         || scope.State == "<@else"))
                        {
                            // Consume the `/>` characters, set the state, append the characters to the state of the current context, and pop it from the scope chain
                            position += 2;
                            state     = Token.FusionStartTagSelfClose;
                            append    = current + "" + peek;
                            pop       = true;
                        }
                        else
                        {
                            // REGULAR EXPRESSION LITERALS (11.8.5)
                            if (IsRegExp(token, expression))
                            {
                                // Set the state
                                state = Token.JavaScriptRegExp;

                                // Create the class flag
                                bool @class = false;

                                // Consume the current character (and initially the `/` character)
                                while (++position < length)
                                {
                                    // Get the current character from the source
                                    current = source[position];

                                    // If the current character is an escape character
                                    if (current == '\\')
                                    {
                                        // Consume the escape character and if there isn't another character or the current character is a line terminator, break
                                        if (++position >= length || Helpers.IsNewline(source[position]))
                                            break;
                                    }
                                    // If the current character is the closing `/` character (and it's not inside a character class)
                                    else if (!@class && current == '/')
                                    {
                                        // Consume the closing `/`
                                        position++;

                                        break;
                                    }
                                    // If the current character opens a character class (and it's not inside a character class), set the class flag
                                    else if (!@class && current == '[')
                                        @class = true;
                                    // If the current character closes a character class (and it's inside a character class), reset the class flag
                                    else if (@class && current == ']')
                                        @class = false;
                                    // LINE TERMINATORS (11.3)
                                    else if (Helpers.IsNewline(current))
                                        break;
                                }

                                // If the closing character was a `/`
                                if (current == '/')
                                {
                                    // Get the current character from the source
                                    current = source.ElementAtOrDefault(position);

                                    // If the current character starts an identifier
                                    if (Helpers.IsLetter(current) || current == '_' || current == '$')
                                    {
                                        // Consume the current character
                                        position++;

                                        do
                                        {
                                            // Get the current character from the source
                                            current = source.ElementAtOrDefault(position);

                                            // If the current character isn't a valid identifier character
                                            if (!Helpers.IsAlphanumeric(current) && current != '_'
                                                                                 && current != '$'
                                                                                 && current != '\u200C'
                                                                                 && current != '\u200D')
                                                // Don't consume the current character
                                                break;
                                        }
                                        // Continue if the incremented position doesn't exceed the length
                                        while (++position < length);
                                    }
                                }
                            }
                            else
                            {
                                // Consume the `/` character and set the state
                                position++;
                                state = Token.JavaScriptPunctuator;

                                // If the punctuator is the division assignment operator, consume the `=` character
                                if (source.ElementAtOrDefault(position) == '=')
                                    position++;
                            }
                        }
                    }
                    // NUMERIC LITERALS (11.8.3)
                    else if (Helpers.IsNumber(current) || current == '.' && Helpers.IsNumber(source.ElementAtOrDefault(position + 1)))
                    {
                        // Set the state
                        state = Token.JavaScriptNumber;

                        // Get the next character from the source
                        var peek = current == '0' ?
                                   source.ElementAtOrDefault(position + 1) :
                                   '\0';

                        // If the first character is non-zero or the zero is followed by a decimal point or exponential indicator
                        if (current != '0' || peek == '.'
                                           || peek == 'e'
                                           || peek == 'E')
                        {
                            // If the current character is not a decimal point
                            if (current != '.')
                            {
                                // Consume the current character
                                position++;

                                // Consume any other numeric characters
                                while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                    position++;

                                // Get the current character from the source
                                current = source.ElementAtOrDefault(position);
                            }

                            // If the current character is a decimal point
                            if (current == '.')
                            {
                                // Consume the `.` character
                                position++;

                                // Consume any other numeric characters
                                while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                    position++;

                                // Get the current character from the source
                                current = source.ElementAtOrDefault(position);
                            }

                            // Get the next character from the source
                            peek = source.ElementAtOrDefault(position + 1);

                            // If the current character is an exponential indicator and the next character is a numeric character (or it is preceded by a valid punctuator)
                            if ((current == 'e' || current == 'E') && (Helpers.IsNumber(peek) || (peek == '+' || peek == '-') && Helpers.IsNumber(source.ElementAtOrDefault(position + 2))))
                            {
                                // Consume the current characters
                                position += peek == '+' || peek == '-' ? 3 : 2;

                                // Consume any other numeric characters
                                while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                    position++;
                            }
                        }
                        else
                        {
                            // Consume the `0` character
                            position++;

                            // Get the helper function
                            var helper = peek == 'b' || peek == 'B' ?
                                         Helpers.IsBinary :
                                         peek == 'o' || peek == 'O' ?
                                         Helpers.IsOctal :
                                         peek == 'x' || peek == 'X' ?
                                         Helpers.IsHexadecimal :
                                         (Func<char, bool>)null;

                            // If the next character is in the range of the helper function
                            if (helper != null && helper(source.ElementAtOrDefault(position + 1)))
                            {
                                // Consume the flag character and the next character
                                position += 2;

                                // Consume any other characters in the range of the helper function
                                while (helper(source.ElementAtOrDefault(position)))
                                    position++;
                            }
                        }
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '{')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If the lexer has a scope chain
                        if (chain != null)
                        {
                            // Get the identifier if the previous token is a reserved word or the punctuator if it's a punctuator
                            string identifier = token != null && token.Type == Token.JavaScriptReservedWord ?
                                                token.Text() :
                                                null;
                            string punctuator = token != null && token.Type == Token.JavaScriptPunctuator ?
                                                token.Text() :
                                                null;

                            // If the previous token is neither an identifier nor a punctuator that preceeds a block
                            if (identifier != null && identifier != "do"
                                                   && identifier != "else"
                                                   && identifier != "export"
                                                   && identifier != "finally"
                                                   && identifier != "import"
                                                   && identifier != "try"
                             || punctuator != null && punctuator != "{"
                                                   && punctuator != ";"
                                                   && punctuator != "=>"
                                                   && punctuator != "}")
                            {
                                // If the previous token is a punctuator that preceeds an object literal
                                if (punctuator == "("
                                 || punctuator == "["
                                 || punctuator == ","
                                 || punctuator == "?"
                                 || punctuator == ":"
                                 || punctuator == "=")
                                    // Push an object key context into the scope chain
                                    push = new Scope("{");
                                // If there is no previous expression or it doesn't preceed a block
                                else if (expression == null || !expression.EndsWith("()"))
                                {
                                    // Get the next token and its type
                                    var    peek = this.Peek(position);
                                    string type = peek != null ?
                                                  peek.Type :
                                                  null;

                                    // If the next token is either an identifier, reserved word, or string literal
                                    if (type == Token.JavaScriptIdentifier
                                     || type == Token.JavaScriptReservedWord
                                     || type == Token.JavaScriptDoubleQuotedString
                                     || type == Token.JavaScriptSingleQuotedString)
                                    {
                                        // Get the token text if it's an identifier
                                        string text = type == Token.JavaScriptIdentifier ?
                                                      peek.Text() :
                                                      null;

                                        // Get the next token and its type
                                        peek = this.Peek(peek.End);
                                        type = peek != null ?
                                               peek.Type :
                                               null;

                                        // If the next token is the `:` punctuator, push an object key context into the scope chain
                                        if (type == Token.JavaScriptPunctuator && peek.Text() == ":")
                                            push = new Scope("{");
                                        // If the preceeding identifier is either `get` or `set` and the next token is either an identifier or reserved word
                                        else if ((text == "get" || text == "set") && (type == Token.JavaScriptIdentifier || type == Token.JavaScriptReservedWord))
                                        {
                                            // Get the next token and its type
                                            peek = this.Peek(peek.End);
                                            type = peek != null ?
                                                   peek.Type :
                                                   null;

                                            // If the next token is the `(` punctuator, push an object key context into the scope chain
                                            if (type == Token.JavaScriptPunctuator && source[peek.Start] == '(')
                                                push = new Scope("{");
                                        }
                                    }
                                }
                            }

                            // If there's a current context and an object key context isn't being pushed into the scope chain, count the current character
                            if (scope != null && push == null)
                                CountPunctuator(scope, current);
                        }
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '}')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If there's a current context
                        if (scope != null)
                        {
                            // If the closing brace is unmatched
                            if (scope.Braces == 0)
                            {
                                // If the current character closes a fusion substitution context
                                if (fusion && scope.State.EndsWith("${"))
                                {
                                    // Set the state, append the current character to the state of the current context, and pop it from the scope chain
                                    state  = scope.State == "<${" ?
                                             Token.FusionSubstitutionClose :
                                             scope.State == "@{:${" ?
                                             Token.FusionObjectSubstitutionClose :
                                             scope.State == "@(${" || scope.State == "@[${" ?
                                             Token.FusionSelectorSubstitutionClose :
                                             Token.FusionStyleSubstitutionClose;
                                    append = current + "";
                                    pop    = true;
                                }
                                // If the current character closes either an object key or value context
                                else if (scope.State == "{" || scope.State == "{:")
                                {
                                    // Replace the state of the current context with an object literal and pop it from the scope chain
                                    replace = "{}";
                                    pop     = true;
                                }
                            }

                            // If the current context isn't being popped from the scope chain, count the current character
                            if (!pop)
                                CountPunctuator(scope, current);
                        }
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '(')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If the current context is a fusion context
                        if (fusion && scope != null && (scope.State.StartsWith("<@")
                                                     || scope.State.StartsWith("</@")))
                        {
                            // If the current character is the opening of a fusion reserved context
                            if (scope.State == "<@for"
                             || scope.State == "<@if"
                             || scope.State == "<@switch"
                             || scope.State == "<@while"
                             || scope.State == "<@else for"
                             || scope.State == "<@else if"
                             || scope.State == "<@else switch"
                             || scope.State == "<@else while"
                             || scope.State == "</@while")
                                // Append the current character to the state of the current context
                                append = current + "";
                        }
                        // If the lexer has a scope chain and the previous token is a reserved word
                        else if (chain != null && token != null && token.Type == Token.JavaScriptReservedWord)
                        {
                            // Get the previous token text
                            string text = token.Text();

                            // If the reserved word must be followed by parentheses
                            if (text == "catch"
                             || text == "function"
                             || text == "for"
                             || text == "if"
                           //|| text == "let"
                             || text == "switch"
                             || text == "while"
                             || text == "with")
                                // Push a reserved context into the scope chain
                                push = new Scope(text + "(");
                        }

                        // If there's a current context and a reserved context isn't being pushed into the scope chain, count the current character
                        if (scope != null && push == null)
                            CountPunctuator(scope, current);
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == ')')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If the current context is a reserved context
                        if (scope != null && scope.State.EndsWith("("))
                        {
                            // If the current context is a fusion context
                            if (fusion && (scope.State.StartsWith("<@")
                                        || scope.State.StartsWith("</@")))
                            {
                                // If the current character is the closing of a fusion reserved context, append it to the state of the current context
                                if (scope.Parentheses == 1)
                                    append = current + "";
                            }
                            // If the current character closes the reserved context
                            else if (scope.Parentheses == 0)
                            {
                                // Append the current character to the state of the current context, and pop it from the scope chain
                                append = current + "";
                                pop    = true;
                            }
                        }

                        // If there's a current context and it isn't being popped from the scope chain, count the current character
                        if (scope != null && !pop)
                            CountPunctuator(scope, current);
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '[' || current == ']')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If there's a current context in the scope chain, count the current character
                        if (scope != null)
                            CountPunctuator(scope, current);
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == ':')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If the current character opens an object value context, replace the state of the current context with it
                        if (scope != null && scope.Braces == 0 && scope.State == "{")
                            replace = "{:";
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == ',')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;

                        // If the current character opens an object key context, replace the state of the current context with it
                        if (scope != null && scope.Braces == 0 && scope.State == "{:")
                            replace = "{";
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == ';'
                          || current == '?'
                          || current == '~')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptPunctuator;
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '=')
                    {
                        // Consume the `=` character, get the current character from the source, and set the state
                        current = source.ElementAtOrDefault(++position);
                        state   = Token.JavaScriptPunctuator;

                        // If the punctuator is the equality operator
                        if (current == '=')
                        {
                            // Consume the second `=` character and if the punctuator is the strict equality operator, consume the third `=` character
                            if (source.ElementAtOrDefault(++position) == '=')
                                position++;
                        }
                        // If the punctuator is an arrow function, consume the `>` character
                        else if (current == '>')
                            position++;
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '&'
                          || current == '|'
                          || current == '+'
                          || current == '-')
                    {
                        // Get the next character from the source
                        var peek = source.ElementAtOrDefault(position + 1);

                        // Consume the current character (and the next character if the punctuator is an assignment operator, increment/decrement operator, or a logical AND/OR)
                        position += current == peek || peek == '=' ? 2 : 1;
                        state     = Token.JavaScriptPunctuator;
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '!'
                          || current == '*'
                          || current == '^'
                          || current == '%')
                    {
                        // Set the state
                        state = Token.JavaScriptPunctuator;

                        // If the punctuator is an assignment operator
                        if (source.ElementAtOrDefault(position + 1) == '=')
                        {
                            // Consume both characters
                            position += 2;

                            // If the punctuator is the strictly negated equality operator, consume the third `=` character
                            if (current == '!' && source.ElementAtOrDefault(position) == '=')
                                position++;
                        }
                        // Consume the current character
                        else
                            position++;
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '<' || current == '>')
                    {
                        // Get the next character from the source
                        var peek = source.ElementAtOrDefault(position + 1);

                        // If the punctuator is either a bitwise shift or a greater than or less than operator
                        if (current == peek || peek == '=')
                        {
                            // Consume both characters and set the state
                            position += 2;
                            state     = Token.JavaScriptPunctuator;

                            // If the punctuator is a bitwise shift
                            if (current == peek)
                            {
                                // Get the current character from the source
                                current = source.ElementAtOrDefault(position);

                                // If the punctuator is the zero-fill right shift, consume the current character and get the next character from the source
                                if (peek == '>' && current == '>')
                                    current = source.ElementAtOrDefault(++position);

                                // If the punctuator is a bitwise assignment operator, consume the `=` character
                                if (current == '=')
                                    position++;
                            }
                        }
                        else
                        {
                            // Consume the current character and set the state
                            position++;
                            state = Token.JavaScriptPunctuator;

                            // If fusion language components are supported
                            if (fusion)
                            {
                                // If the current context is a fusion context
                                if (current == '>' && scope != null && (scope.State.StartsWith("<@")
                                                                     || scope.State.StartsWith("</@")))
                                {
                                    // If the current character is the self closing of a fusion start tag
                                    if (scope.State.EndsWith("()") || scope.State == "<@do"
                                                                   || scope.State == "<@else do")
                                    {
                                        // Set the state, append the current character to the state of the current context, and pop it from the scope chain
                                        state  = scope.State.StartsWith("</@") ?
                                                 Token.FusionEndTagClose :
                                                 Token.FusionStartTagClose;
                                        append = current + "";
                                        pop    = true;
                                    }
                                }
                                // If the punctuator is a fusion end tag
                                else if (current == '<' && peek == '/' && source.ElementAtOrDefault(position + 1) == '@' && scope != null && scope.State == "<@")
                                {
                                    // Consume the `/@` characters and set the state
                                    position += 2;
                                    state     = Token.FusionEndTagOpen;
                                }
                                // If the current character is the closing of a fusion start tag, set the state
                                else if (current == '>' && token != null && token.Type == Token.FusionStartTagOpen)
                                    state = Token.FusionStartTagClose;
                                // If the current character is the closing of a fusion end tag, set the state
                                else if (current == '>' && token != null && token.Type == Token.FusionEndTagOpen)
                                    state = Token.FusionEndTagClose;
                                // If the current characters and context declare an element
                                else if (current == '<' && Helpers.IsLetter(peek) && IsRegExp(token, expression))
                                {
                                    // Set the state and push the element context into the scope chain
                                    state = Token.HTMLStartTagOpen;
                                    push  = new Scope("<");

                                    // Count the opening tag in the element context
                                    CountPunctuator(push, current);
                                }
                            }
                            // If the punctuator opens a script end tag
                            else if (current == '<' && peek == '/' && position + 7 <= length && source.Substring(position + 1, 6) == "script" && scope != null && scope.State == "<script")
                            {
                                // Consume the `/` character, set the state, append the `>` character to the state of the current context and pop it from the scope chain
                                position++;
                                state  = Token.HTMLEndTagOpen;
                                append = ">";
                                pop    = true;
                            }
                        }
                    }
                    // PUNCTUATORS (11.7)
                    else if (current == '.')
                    {
                        // Consume the `.` character, get the current character from the source, and set the state
                        current = source.ElementAtOrDefault(++position);
                        state   = Token.JavaScriptPunctuator;

                        // If the punctuator is the spread operator, consume both `.` characters
                        if (current == '.' && source.ElementAtOrDefault(position + 1) == '.')
                            position += 2;
                    }
                    // If the current character opens a fusion context
                    else if (fusion && current == '@')
                    {
                        // Get the next character from the source
                        var peek = source.ElementAtOrDefault(position + 1);

                        // Consume the current character and set the state
                        position++;
                        state = peek == '{' ?
                                Token.FusionObject :
                                peek == '(' || peek == '[' ?
                                Token.FusionSelector :
                                Token.JavaScriptInvalidCharacter;

                        // If the current character is either a fusion style or selector context
                        if (chain != null && (peek == '{'
                                           || peek == '('
                                           || peek == '['))
                            // Push either a fusion style or selector context into the scope chain
                            push = new Scope(current + "" + peek);
                    }
                    else
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.JavaScriptInvalidCharacter;
                    }

                    break;

                // ---------- HTML ----------
                case "html":
                case "fhtml":
                case Token.HTMLStartTagClose:
                case Token.HTMLStartTagSelfClose:
                case Token.HTMLEndTagClose:
                case Token.HTMLCharacterReference:
                case Token.HTMLCommentClose:
                case Token.HTMLBogusCommentClose:
                case Token.HTMLDOCTYPEClose:
                case Token.HTMLCDATAClose:
                case Token.FusionStartTagClose:
                case Token.FusionStartTagSelfClose:
                case Token.FusionEndTagClose:
              //case Token.FusionDirectiveTagClose:
                case Token.FusionSubstitutionClose:

                    // DATA STATE (12.2.4.1)
                    state = Token.HTMLText;
                    
                    // Fall through to the next case
                    goto case Token.HTMLText;

                case Token.HTMLText:

                    do
                    {
                        // Get the current character from the source
                        current = source[position];

                        // TAG OPEN STATE (12.2.4.8)
                        if (current == '<')
                        {
                            // Get the next character from the source
                            char peek = source.ElementAtOrDefault(position + 1);

                            // TAG NAME STATE (12.2.4.10)
                            if (Helpers.IsLetter(peek))
                            {
                                // If these aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Consume the `<` character and set the state
                                position++;
                                state = Token.HTMLStartTagOpen;

                                // If there's a current context in the scope chain, count the current character
                                if (scope != null)
                                    CountPunctuator(scope, current);

                                break;
                            }
                            // END TAG OPEN STATE (12.2.4.9)
                            else if (peek == '/')
                            {
                                // If `</` aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Get the next character from the source
                                peek = source.ElementAtOrDefault(position + 2);

                                // If the closing tag is a fusion end tag
                                if (fusion && peek == '@')
                                {
                                    // Consume the `</@` characters and set the state
                                    position += 3;
                                    state     = Token.FusionEndTagOpen;
                                }
                                // TAG NAME STATE (12.2.4.10)
                                else if (Helpers.IsLetter(peek))
                                {
                                    // Consume the `</` characters and set the state
                                    position += 2;
                                    state     = Token.HTMLEndTagOpen;
                                }
                                // BOGUS COMMENT STATE (12.2.4.44)
                                else
                                {
                                    // Consume the `</` characters and set the state
                                    position += 2;
                                    state     = Token.HTMLBogusCommentOpen;
                                }

                                break;
                            }
                            // If the opening tag is a fusion start tag
                            else if (fusion && peek == '@')
                            {
                                // If `<@` aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Consume the `<@` characters and set the state
                                position += 2;
                                state     = Token.FusionStartTagOpen;

                                break;
                            }
                            // MARKUP DECLARATION OPEN STATE (12.2.4.45)
                            else if (peek == '!')
                            {
                                // If `<!` aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Get the next character from the source
                                peek = source.ElementAtOrDefault(position + 2);

                                // DATA STATE (12.2.4.1)
                                if (peek == '>')
                                {
                                    // Consume the `<!` characters and set the state
                                    position += 2;
                                    state     = Token.HTMLBogusCommentOpen;
                                }
                                // If the opening tag is a fusion directive tag
                              //else if (fusion && peek == '@')
                              //{
                              //    // Consume the `<!@` characters and set the state
                              //    position += 3;
                              //    state     = Token.FusionDirectiveTagOpen;
                              //}
                                // COMMENT START STATE (12.2.4.46)
                                else if (peek == '-' && source.ElementAtOrDefault(position + 3) == '-')
                                {
                                    // Consume the `<!--` characters and set the state
                                    position += 4;
                                    state     = Token.HTMLCommentOpen;
                                }
                                else
                                {
                                    // Get the next string of seven characters
                                    string peekString = position + 9 <= length ?
                                                        source.Substring(position + 2, 7) :
                                                        null;

                                    // DOCTYPE STATE (12.2.4.52)
                                    if (peekString == "DOCTYPE")
                                    {
                                        // Consume the `<!DOCTYPE` characters and set the state
                                        position += 9;
                                        state     = Token.HTMLDOCTYPEOpen;
                                    }
                                    // CDATA SECTION STATE (12.2.4.68)
                                    else if (peekString == "[CDATA[")
                                    {
                                        // Consume the `<![CDATA[` characters and set the state
                                        position += 9;
                                        state     = Token.HTMLCDATAOpen;
                                    }
                                    // BOGUS COMMENT STATE (12.2.4.44)
                                    else
                                    {
                                        // Consume the `<!` characters and set the state
                                        position += 2;
                                        state     = Token.HTMLBogusCommentOpen;
                                    }
                                }

                                break;
                            }
                            // BOGUS COMMENT STATE (12.2.4.44)
                            else if (peek == '?')
                            {
                                // If `<?` aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Consume the `<?` characters and set the state
                                position += 2;
                                state     = Token.HTMLBogusCommentOpen;

                                break;
                            }
                        }
                        // CHARACTER REFERENCE IN DATA STATE (12.2.4.2)
                        else if (current == '&')
                        {
                            // Declare the helper function and get the next character from the source
                            Func<char, bool> helper = null;
                            char             peek   = source.ElementAtOrDefault(position + 1);

                            // If the character reference is a unicode character code
                            if (peek == '#')
                            {
                                // Get the next character from the source
                                peek = source.ElementAtOrDefault(position + 2);

                                // If the character code is hexadecimal
                                if (peek == 'x' || peek == 'X')
                                {
                                    // Get the next character from the source
                                    peek = source.ElementAtOrDefault(position + 3);

                                    // If the character code is hexadecimal
                                    if (Helpers.IsHexadecimal(peek))
                                    {
                                        // If these aren't the first characters, break (and don't consume them)
                                        if (position != start)
                                            break;

                                        // Consume the current characters and set the helper function
                                        position += 4;
                                        helper    = Helpers.IsHexadecimal;
                                    }
                                }
                                // If the character code is numeric
                                else if (Helpers.IsNumber(peek))
                                {
                                    // If these aren't the first characters, break (and don't consume them)
                                    if (position != start)
                                        break;

                                    // Consume the current characters and set the helper function
                                    position += 3;
                                    helper    = Helpers.IsNumber;
                                }
                            }
                            // If the character matches a named character reference
                            else if (Helpers.IsLetter(peek))
                            {
                                // If these aren't the first characters, break (and don't consume them)
                                if (position != start)
                                    break;

                                // Consume the current characters and set the helper function
                                position += 2;
                                helper    = Helpers.IsAlphanumeric;
                            }

                            // If this isn't a character reference, continue (and consume the `&` character)
                            if (helper == null)
                                continue;

                            // Set the state
                            state = Token.HTMLCharacterReference;

                            // Consume any other characters in the range of the helper function
                            while (helper(source.ElementAtOrDefault(position)))
                                position++;

                            // If the next consumed character isn't a semi-colon, unconsume it
                            if (source.ElementAtOrDefault(position++) != ';')
                                position--;

                            break;
                        }
                        // If the current characters open a fusion substitution
                        else if (fusion && current == '$' && source.ElementAtOrDefault(position + 1) == '{' && scope != null && scope.State == "<")
                        {
                            // If these aren't the first characters, break (and don't consume them)
                            if (position != start)
                                break;

                            // Consume the `${` characters, set the state, and push the substitution context into the scope chain
                            position += 2;
                            state     = Token.FusionSubstitutionOpen;
                            push      = new Scope("<${");

                            break;
                        }
                    }
                    // Continue if the incremented position doesn't exceed the length
                    while (++position < length);

                    break;

                case Token.HTMLStartTagOpen:
                case Token.HTMLEndTagOpen:

                    // TAG NAME STATE (12.2.4.10)
                    if (Helpers.IsLetter(source[position]))
                    {
                        // Set the state
                        state = state != Token.HTMLStartTagOpen ?
                                Token.HTMLEndTagName :
                                Token.HTMLStartTagName;

                        // Consume the current character (and initially the first letter character)
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If the current character isn't allowed in a tag name, break (and don't consume it)
                            if (current == '>' || current == '/' || Helpers.IsSpace(current))
                                break;
                        }

                        // If there's a current context in the scope chain, set the current tag name
                        if (scope != null)
                            scope.Tag = source.Substring(start, position - start);

                        break;
                    }

                    // Fall through to the next case
                    goto case Token.HTMLEndTagName;

                case Token.HTMLEndTagName:
                case Token.HTMLEndTagText:
                case Token.HTMLEndTagWhitespace:

                    // Set the end flag
                    end = state != Token.HTMLStartTagOpen;

                    // Fall through to the next case
                    goto case Token.HTMLStartTagName;

                case Token.HTMLStartTagName:
                case Token.HTMLStartTagSolidus:
                case Token.HTMLStartTagWhitespace:
                case Token.HTMLAttributeName:
                case Token.HTMLAttributeOperator:
                case Token.HTMLAttributeValue:
                case Token.HTMLAttributeDoubleQuotedValue:
                case Token.HTMLAttributeSingleQuotedValue:
                case Token.FusionAttributeTemplateString:
                case Token.FusionAttributeTemplateStringTail:

                    // Get the current character from the source
                    current = source[position];

                    // DATA STATE (12.2.4.1)
                    if (current == '>')
                    {
                        // Consume the `>` character and set the state
                        position++;
                        state = end ?
                                Token.HTMLEndTagClose :
                                Token.HTMLStartTagClose;

                        // If there's a current context in the scope chain
                        if (scope != null)
                        {
                            // If the tag is either an end tag or void tag, count the current character
                            if (end || IsVoid(scope.Tag))
                                CountPunctuator(scope, current);

                            // If the tag being closed is either a script or style tag, push either a script or style context into the scope chain
                            if (!end && (!fusion && scope.Tag == "script" || scope.Tag == "style"))
                                push = new Scope("<" + scope.Tag);

                            // Reset the current tag name
                            scope.Tag = "";
                        }
                    }
                    // If the current character is whitespace
                    else if (Helpers.IsSpace(current))
                    {
                        // Consume the whitespace character and set the state
                        position++;
                        state = end ?
                                Token.HTMLEndTagWhitespace :
                                Token.HTMLStartTagWhitespace;

                        // Consume any other whitespace characters
                        while (Helpers.IsSpace(source.ElementAtOrDefault(position)))
                            position++;
                    }
                    // If the tag is an end tag
                    else if (end)
                    {
                        // Set the state
                        state = Token.HTMLEndTagText;

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If the current character isn't allowed in an end tag text, break (and don't consume it)
                            if (current == '>' || Helpers.IsSpace(current))
                                break;
                        }
                    }
                    // BEFORE ATTRIBUTE VALUE STATE (12.2.4.37)
                    else if (current == '=' && token != null && token.Type == Token.HTMLAttributeName)
                    {
                        // Consume the `=` character and set the state
                        position++;
                        state = Token.HTMLAttributeOperator;
                    }
                    // ATTRIBUTE VALUE (DOUBLE-QUOTED/SINGLE-QUOTED/UNQUOTED) STATE (12.2.4.38/12.2.4.39/12.2.4.40)
                    else if (token != null && token.Type == Token.HTMLAttributeOperator)
                    {
                        // Get the break character
                        char @break = current == '"'
                                   || current == '\''
                                   || current == '`' && fusion && scope != null && scope.State == "<" ?
                                      current :
                                      '\0';

                        // Set the state
                        state = @break == '`' ?
                                Token.FusionAttributeTemplateString :
                                @break == '"' ?
                                Token.HTMLAttributeDoubleQuotedValue :
                                @break == '\'' ?
                                Token.HTMLAttributeSingleQuotedValue :
                                Token.HTMLAttributeValue;

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If a break character is set
                            if (@break != '\0')
                            {
                                // If the current character is the break character
                                if (current == @break)
                                {
                                    // Consume the break character
                                    position++;

                                    break;
                                }
                                // If the state is a template string and the current character opens a template substitution
                                else if (@break == '`' && current == '$' && source.ElementAtOrDefault(position + 1) == '{')
                                {
                                    // Consume the `${` characters, set the state, and push a substitution context into the scope chain
                                    position += 2;
                                    state     = Token.FusionAttributeTemplateStringHead;
                                    push      = new Scope("=`${");

                                    break;
                                }
                            }
                            // If the current character isn't allowed in an unquoted attribute value, break (and don't consume it)
                            else if (current == '>' || Helpers.IsSpace(current))
                                break;
                        }
                    }
                    // SELF-CLOSING START TAG STATE (12.2.4.43)
                    else if (current == '/')
                    {
                        // Consume the `/` character, get the current character, and set the state
                        current = source.ElementAtOrDefault(++position);
                        state   = Token.HTMLStartTagSolidus;

                        // DATA STATE (12.2.4.1)
                        if (current == '>')
                        {
                            // Consume the `>` character and set the state
                            position++;
                            state = Token.HTMLStartTagSelfClose;

                            // If there's a current context in the scope chain
                            if (scope != null)
                            {
                                // Count the current character
                                CountPunctuator(scope, current);

                                // Reset the current tag name
                                scope.Tag = "";
                            }
                        }
                        // Consume any other solidus characters
                        else while (current == '/')
                            current = source.ElementAtOrDefault(++position);
                    }
                    // ATTRIBUTE NAME STATE (12.2.4.35)
                    // BEFORE/AFTER ATTRIBUTE NAME STATE (12.2.4.34/12.2.4.36)
                    // CHARACTER REFERENCE IN ATTRIBUTE VALUE STATE (12.2.4.41)
                    // AFTER ATTRIBUTE VALUE (QUOTED) STATE (12.2.4.42)
                    else
                    {
                        // Set the state
                        state = Token.HTMLAttributeName;

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If the current character isn't allowed in an attribute name, break (and don't consume it)
                            if (current == '>' || current == '/' || current == '=' || Helpers.IsSpace(current))
                                break;
                        }
                    }

                    break;

                case Token.HTMLCommentOpen:

                    // COMMENT STATE (12.2.4.48)
                    state = Token.HTMLCommentText;

                    // Fall through to the next case
                    goto case Token.HTMLCommentText;

                case Token.HTMLCommentText:

                    do
                    {
                        // Get the current character from the source
                        current = source[position];

                        // DATA STATE (12.2.4.1)
                        if (current == '>')
                        {
                            // If `>` isn't the first character or the previous token did not open the comment, continue (and consume the `>` character)
                            if (position != start || token == null || token.Type != Token.HTMLCommentOpen)
                                continue;

                            // Consume the `>` character and set the state
                            position++;
                            state = Token.HTMLCommentClose;

                            break;
                        }
                        // COMMENT START/END DASH STATE (12.2.4.47/12.2.4.49)
                        else if (current == '-')
                        {
                            // Get the next character from the source
                            char peek = source.ElementAtOrDefault(position + 1);

                            // DATA STATE (12.2.4.1)
                            if (peek == '>')
                            {
                                // If `->` aren't the first characters or the previous token did not open the comment, continue (and consume the `-` character)
                                if (position != start || token == null || token.Type != Token.HTMLCommentOpen)
                                    continue;

                                // Consume the `->` characters and set the state
                                position += 2;
                                state     = Token.HTMLCommentClose;

                                break;
                            }
                            // COMMENT END STATE (12.2.4.50)
                            else if (peek == '-')
                            {
                                // Get the next character from the source
                                peek = source.ElementAtOrDefault(position + 2);

                                // DATA STATE (12.2.4.1)
                                // COMMENT END BANG STATE (12.2.4.51)
                                if (peek == '>' || peek == '!' && source.ElementAtOrDefault(position + 3) == '>')
                                {
                                    // If these aren't the first characters, break (and don't consume them)
                                    if (position != start)
                                        break;

                                    // Consume the current characters and set the state
                                    position += peek == '!' ? 4 : 3;
                                    state     = Token.HTMLCommentClose;

                                    break;
                                }
                            }
                        }
                    }
                    // Continue if the incremented position doesn't exceed the length
                    while (++position < length);

                    break;

                case Token.HTMLBogusCommentOpen:

                    // BOGUS COMMENT STATE (12.2.4.44)
                    state = Token.HTMLBogusCommentText;

                    // Fall through to the next case
                    goto case Token.HTMLBogusCommentText;

                case Token.HTMLBogusCommentText:

                    do
                    {
                        // DATA STATE (12.2.4.1)
                        if (source[position] == '>')
                        {
                            // If `>` isn't the first character, break (and don't consume it)
                            if (position != start)
                                break;

                            // Consume the `>` character and set the state
                            position++;
                            state = Token.HTMLBogusCommentClose;

                            break;
                        }
                    }
                    // Continue if the incremented position doesn't exceed the length
                    while (++position < length);

                    break;

                case Token.HTMLDOCTYPEOpen:
                case Token.HTMLDOCTYPEString:
                case Token.HTMLDOCTYPEDoubleQuotedString:
                case Token.HTMLDOCTYPESingleQuotedString:
                case Token.HTMLDOCTYPEWhitespace:

                    // Get the current character from the source
                    current = source[position];

                    // DATA STATE (12.2.4.1)
                    if (current == '>')
                    {
                        // Consume the `>` character and set the state
                        position++;
                        state = Token.HTMLDOCTYPEClose;
                    }
                    // If the current character is whitespace
                    else if (Helpers.IsSpace(current))
                    {
                        // Consume the space character and set the state
                        position++;
                        state = Token.HTMLDOCTYPEWhitespace;

                        // Consume any other whitespace characters
                        while (Helpers.IsSpace(source.ElementAtOrDefault(position)))
                            position++;
                    }
                    else
                    {
                        // Get the break character
                        char @break = current == '"' || current == '\'' ?
                                      current :
                                      '\0';

                        // Set the state
                        state = current == '"' ?
                                Token.HTMLDOCTYPEDoubleQuotedString :
                                current == '\'' ?
                                Token.HTMLDOCTYPESingleQuotedString :
                                Token.HTMLDOCTYPEString;

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If a break character is set
                            if (@break != '\0')
                            {
                                // If the current character is the break character
                                if (current == @break)
                                {
                                    // Consume the break character
                                    position++;

                                    break;
                                }
                            }
                            // If the current character isn't allowed in a DOCTYPE string, break (and don't consume it)
                            else if (current == '>' || Helpers.IsSpace(current))
                                break;
                        }
                    }

                    break;

                case Token.HTMLCDATAOpen:

                    // CDATA SECTION STATE (12.2.4.68)
                    state = Token.HTMLCDATAText;

                    // Fall through to the next case
                    goto case Token.HTMLCDATAText;

                case Token.HTMLCDATAText:

                    do
                    {
                        // DATA STATE (12.2.4.1)
                        if (source[position] == ']' && source.ElementAtOrDefault(position + 1) == ']' && source.ElementAtOrDefault(position + 2) == '>')
                        {
                            // If `]]>` aren't the first characters, break (and don't consume them)
                            if (position != start)
                                break;

                            // Consume the `]]>` characters and set the state
                            position += 3;
                            state     = Token.HTMLCDATAClose;

                            break;
                        }
                    }
                    // Continue if the incremented position doesn't exceed the length
                    while (++position < length);

                    break;
                
                // ---------- CSS ----------
                case "css":
                case "fcss":
                case Token.CSSIdentifier:
                case Token.CSSNumber:
                case Token.CSSDelimiter:
                case Token.CSSPunctuator:
                case Token.CSSDimension:
                case Token.CSSPercentage:
                case Token.CSSComma:
                case Token.CSSColon:
                case Token.CSSSemicolon:
                case Token.CSSDoubleQuotedString:
                case Token.CSSSingleQuotedString:
                case Token.CSSHash:
                case Token.CSSFunction:
                case Token.CSSAtKeyword:
                case Token.CSSMatch:
                case Token.CSSUrl:
                case Token.CSSColumn:
                case Token.CSSUnicodeRange:
                case Token.CSSComment:
                case Token.CSSWhitespace:
                case Token.FusionObject:
                case Token.FusionSelector:
                case Token.FusionObjectSubstitutionClose:
                case Token.FusionSelectorSubstitutionClose:
                case Token.FusionStyleSubstitutionClose:

                    // Get the current character from the source
                    current = source[position];

                    // Check if the current character is numeric
                    bool numeric = Helpers.IsNumber(current);

                    // If the current character isn't a number but could be numeric
                    if (!numeric && (current == '+'
                                  || current == '-'
                                  || current == '.'))
                    {
                        // Get the next character from the source
                        char peek = source.ElementAtOrDefault(position + 1);

                        // NUMBER (4.3.11)
                        numeric = Helpers.IsNumber(peek) || current != '.' && peek == '.' && Helpers.IsNumber(source.ElementAtOrDefault(position + 2));
                    }

                    // NUMERIC (4.3.3)
                    if (numeric)
                    {
                        // Set the state
                        state = Token.CSSNumber;

                        // If the current character is not a decimal point
                        if (current != '.')
                        {
                            // Consume the current character
                            position++;

                            // Consume any other numeric characters
                            while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                position++;

                            // Get the current character from the source
                            current = source.ElementAtOrDefault(position);
                        }

                        // If the current character is a decimal point
                        if (current == '.' && Helpers.IsNumber(source.ElementAtOrDefault(position + 1)))
                        {
                            // Consume the current characters
                            position += 2;

                            // Consume any other numeric characters
                            while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                position++;

                            // Get the current character from the source
                            current = source.ElementAtOrDefault(position);
                        }

                        // Get the next character from the source
                        char peek = source.ElementAtOrDefault(position + 1);

                        // If the current character is an exponential indicator and the next character is a numeric character (or it is preceded by a valid punctuator)
                        if ((current == 'e' || current == 'E') && (Helpers.IsNumber(peek) || (peek == '+' || peek == '-') && Helpers.IsNumber(source.ElementAtOrDefault(position + 2))))
                        {
                            // Consume the current characters
                            position += peek == '+' || peek == '-' ? 3 : 2;

                            // Consume any other numeric characters
                            while (Helpers.IsNumber(source.ElementAtOrDefault(position)))
                                position++;

                            // Get the current character from the source
                            current = source.ElementAtOrDefault(position);
                        }

                        // PERCENTAGE (4.3.3)
                        if (current == '%')
                        {
                            // Consume the `%` character and set the state
                            position++;
                            state = Token.CSSPercentage;

                            break;
                        }
                        // If the current character can't start an identifier
                        else if (!Helpers.IsLetter(current) && current != '_'
                                                            && current != '\\'
                                                            && current != '-'
                                                            && current <  '\u0080')
                            // Don't consume the current character
                            break;
                    }
                    // DIMENSION (4.3.3)
                    // IDENT (4.3.10)
                    if (numeric || Helpers.IsLetter(current) || current == '_'
                                                             || current == '\\'
                                                             || current == '#'
                                                             || current == '@'
                                                             || current == '-'
                                                             || current >= '\u0080')
                    {
                        // UNICODE-RANGE (4.3.7)
                        if (!numeric && (current == 'u'
                                      || current == 'U') && source.ElementAtOrDefault(position + 1) == '+' && (Helpers.IsHexadecimal(source.ElementAtOrDefault(position + 2)) || source.ElementAtOrDefault(position + 2) == '?'))
                        {
                            // Consume the current characters and set the state
                            position += 2;
                            state = Token.CSSUnicodeRange;

                            // Create the character count
                            int count = 0;

                            // Count any six hexadecimal characters
                            while (count < 6 && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + count)))
                                count++;

                            // Get the next character from the source
                            char peek = source.ElementAtOrDefault(position + count);

                            // If the unicode range is a range
                            if (peek == '-' && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + count + 1)))
                            {
                                // Consume the counted hexadecimal characters along with the `-` character and reset the character count
                                position += count + 1;
                                count     = 0;

                                // Count any six hexadecimal characters
                                while (count < 6 && Helpers.IsHexadecimal(source.ElementAtOrDefault(position + count)))
                                    count++;
                            }
                            // If the unicode range is a 0-F range, count any six minus the character count `?` characters
                            else if (peek == '?')
                                while (count < 6 && source.ElementAtOrDefault(position + count) == '?')
                                    count++;

                            // Consume the counted characters
                            position += count;
                        }
                        // IDENT-LIKE (4.3.4)
                        // HASH (4.3.12)
                        // AT-KEYWORD (4.3.12)
                        else
                        {
                            // Set the state
                            state = numeric ?
                                    Token.CSSDimension :
                                    current == '#' ?
                                    Token.CSSHash :
                                    current == '@' ?
                                    Token.CSSAtKeyword :
                                    Token.CSSIdentifier;

                            // If the current character is an escape character
                            if (current == '\\')
                            {
                                // If the next character is a newline
                                if (Helpers.IsNewline(source.ElementAtOrDefault(position + 1)))
                                {
                                    // If the identifier isn't numeric, consume the delimiter character
                                    if (!numeric)
                                        position++;

                                    // Set the state
                                    state = numeric ?
                                            Token.CSSNumber :
                                            Token.CSSDelimiter;

                                    break;
                                }

                                // Consume the escape character and if there is another character, consume it
                                if (++position < length)
                                    position++;
                            }
                            // If the current character is a delimiter character
                            else if (current == '#'
                                  || current == '@'
                                  || current == '-')
                            {
                                // Get the next character from the source
                                char peek = source.ElementAtOrDefault(position + 1);

                                // If the next character isn't a valid starting identifier character
                                if (!Helpers.IsLetter(peek) &&  peek != '_'
                                                            &&  peek != '-'
                                                            && (peek != '\\' || Helpers.IsNewline(source.ElementAtOrDefault(position + 2))) && peek < '\u0080' && (current != '#' || !Helpers.IsNumber(peek)))
                                {
                                    // If the identifier isn't numeric, consume the delimiter character
                                    if (!numeric)
                                        position++;

                                    // Set the state
                                    state = numeric ?
                                            Token.CSSNumber :
                                            Token.CSSDelimiter;

                                    break;
                                }
                                // If the current character is an at-keyword and the next character could be a delimiter
                                else if (current == '@' && peek == '-')
                                {
                                    // Get the next character from the source
                                    peek = source.ElementAtOrDefault(position + 2);

                                    // If the next character isn't a valid starting identifier character
                                    if (!Helpers.IsLetter(peek) &&  peek != '_'
                                                                &&  peek != '-'
                                                                && (peek != '\\' || Helpers.IsNewline(source.ElementAtOrDefault(position + 3))) && peek < '\u0080')
                                    {
                                        // Consume the delimiter character and set the state
                                        position++;
                                        state = Token.CSSDelimiter;

                                        break;
                                    }

                                    // Consume the current characters
                                    position += 3;
                                }
                                // Consume the current characters
                                else
                                    position += 2;
                            }
                            // Consume the current character
                            else
                                position++;

                            do
                            {
                                // Get the current character from the source
                                current = source.ElementAtOrDefault(position);

                                // If the current character is an escape character
                                if (current == '\\')
                                {
                                    // If the next character is a newline, break (and don't consume the escape character)
                                    if (Helpers.IsNewline(source.ElementAtOrDefault(position + 1)))
                                        break;

                                    // Consume the escape character and if there isn't another character, break
                                    if (++position >= length)
                                        break;
                                }
                                // If the current character isn't a valid identifier character
                                else if (!Helpers.IsAlphanumeric(current) && current != '_'
                                                                          && current != '-'
                                                                          && current < '\u0080')
                                    // Don't consume the current character
                                    break;
                            }
                            // Continue if the incremented position doesn't exceed the length
                            while (++position < length);

                            // FUNCTION (4.3.4)
                            if (current == '(' && state == Token.CSSIdentifier)
                            {
                                // Consume the `(` character and set the state
                                position++;
                                state = Token.CSSFunction;

                                // If there's a current context, count the current character
                                if (scope != null)
                                    CountPunctuator(scope, current);

                                // URL (4.3.4)
                                if (position == start + 4 && source.Substring(start, 3).ToLower() == "url")
                                {
                                    // Create the whitespace count
                                    int count = 0;

                                    // Count any other whitespace characters
                                    while (Helpers.IsSpace(source.ElementAtOrDefault(position + count)))
                                        count++;

                                    // Get the next character from the source
                                    char peek = source.ElementAtOrDefault(position + count);

                                    // If the next character isn't a string
                                    if (peek != '"' && peek != '\'')
                                    {
                                        // Consume the whitespace characters and set the state
                                        position += count;
                                        state     = Token.CSSUrl;

                                        // If there isn't another character, break
                                        if (position >= length)
                                            break;

                                        do
                                        {
                                            // Get the current character from the source
                                            current = source[position];

                                            // If the current character is a closing parentheses
                                            if (current == ')')
                                            {
                                                // Consume the `)` character
                                                position++;

                                                break;
                                            }
                                            // If the current character is an escape character, consume it and break if there isn't another character
                                            else if (current == '\\' && ++position >= length)
                                                break;
                                        }
                                        // Continue if the incremented position doesn't exceed the length
                                        while (++position < length);
                                    }
                                }
                            }
                        }
                    }
                    // COMMENTS (4.3.2)
                    else if (current == '/' && source.ElementAtOrDefault(position + 1) == '*')
                    {
                        // Consume the `/` character and set the state
                        position++;
                        state = Token.CSSComment;

                        // Consume the current character (and initially the `*` character)
                        while (++position < length)
                        {
                            // If the current characters close the comment
                            if (source[position] == '*' && source.ElementAtOrDefault(position + 1) == '/')
                            {
                                // Consume the `*/` characters
                                position += 2;

                                break;
                            }
                        }
                    }
                    // WHITESPACE (4.3.1)
                    else if (Helpers.IsSpace(current))
                    {
                        // Consume the whitespace character and set the state
                        position++;
                        state = Token.CSSWhitespace;

                        // Consume any other whitespace characters
                        while (Helpers.IsSpace(source.ElementAtOrDefault(position)))
                            position++;
                    }
                    // STRING (4.3.5)
                    else if (current == '"' || current == '\'')
                    {
                        // Get the break character
                        var @break = current;

                        // Set the state
                        state = @break == '"' ?
                                Token.CSSDoubleQuotedString :
                                Token.CSSSingleQuotedString;

                        // Consume the current character
                        while (++position < length)
                        {
                            // Get the current character from the source
                            current = source[position];

                            // If the current character is an escape sequence
                            if (current == '\\')
                            {
                                // Consume the escape character and if there isn't another character, break
                                if (++position >= length)
                                    break;

                                // If the current character is a carriage return and the next character is a line break, consume the carriage return
                                if (source[position] == '\r' && source.ElementAtOrDefault(position + 1) == '\n')
                                    position++;
                            }
                            // If the current character is the break character
                            else if (current == @break)
                            {
                                // Consume the current character
                                position++;

                                break;
                            }
                            // LINE TERMINATORS (11.3)
                            else if (Helpers.IsNewline(current))
                                break;
                        }
                    }
                    // SUFFIX/SUBSTRING/PREFIX/DASH/INCLUDE MATCH (4.3.1)
                    // COLUMN (4.3.1)
                    else if (current == '$'
                          || current == '*'
                          || current == '^'
                          || current == '|'
                          || current == '~')
                    {
                        // Get the next character from the source
                        char peek = source.ElementAtOrDefault(position + 1);

                        // If the current characters open a declaration substitution
                        if (fusion && current == '$' && peek == '{' && scope != null && (scope.State == "@{:"
                                                                                      || scope.State == "@("
                                                                                      || scope.State == "@["
                                                                                      || scope.State == "<style"))
                        {
                            // Consume the current characters, set the state, and push a declaration substitution context into the scope chain
                            position += 2;
                            state     = scope.State == "@{:" ?
                                        Token.FusionObjectSubstitutionOpen :
                                        scope.State == "@(" || scope.State == "@[" ?
                                        Token.FusionSelectorSubstitutionOpen :
                                        Token.FusionStyleSubstitutionOpen;
                            push      = new Scope(scope.State + current + peek);
                        }
                        // If the current character is a column
                        else if (current == '|' && peek == '|')
                        {
                            // Consume the current characters and set the state
                            position += 2;
                            state     = Token.CSSColumn;
                        }
                        // If the current characters are a match
                        else if (peek == '=')
                        {
                            // Consume the current characters and set the state
                            position += 2;
                            state     = Token.CSSMatch;
                        }
                        else
                        {
                            // Consume the current character and set the state
                            position++;
                            state = Token.CSSDelimiter;
                        }
                    }
                    // PARENTHESIS/BRACKET/CURLY BRACKET (4.3.1)
                    else if (current == '('
                          || current == ')'
                          || current == '['
                          || current == ']'
                          || current == '{'
                          || current == '}')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.CSSPunctuator;

                        // If there's a current context in the scope chain, count the current character
                        if (scope != null)
                            CountPunctuator(scope, current);
                    }
                    // COMMA (4.3.1)
                    else if (current == ',')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.CSSComma;
                    }
                    // COLON (4.3.1)
                    else if (current == ':')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.CSSColon;

                        // If the current context is a declaration name context, append the current character to make it a declaration value context
                        if (scope != null && scope.State == "@{")
                            append = current + "";
                    }
                    // SEMICOLON (4.3.1)
                    else if (current == ';')
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.CSSSemicolon;

                        // If the current context is a declaration value context, replace it with a declaration name context
                        if (scope != null && scope.State == "@{:")
                            replace = "@{";
                    }
                    // COMMENT (4.3.1)
                    else if (current == '<')
                    {
                        // Consume the `<` character, get the current character, and set the state
                        current = source.ElementAtOrDefault(++position);
                        state   = Token.CSSDelimiter;

                        // If the current character opens a markup comment
                        if (current == '!' && source.ElementAtOrDefault(position + 1) == '-' && source.ElementAtOrDefault(position + 2) == '-' && scope != null && scope.State == "<style")
                        {
                            // Consume the `!-` characters and set the state
                            position += 2;
                            state     = Token.CSSComment;

                            // Consume the current character (and initially the third `-` character)
                            while (++position < length)
                            {
                                // If the current character closes the comment
                                if (source[position] == '-' && source.ElementAtOrDefault(position + 1) == '-' && source.ElementAtOrDefault(position + 2) == '>')
                                {
                                    // Consume the `-->` characters
                                    position += 3;

                                    break;
                                }
                            }
                        }
                        // If the punctuator is a markup end tag
                        else if (current == '/' && position + 6 <= length && source.Substring(position + 1, 5) == "style" && scope != null && scope.State == "<style")
                        {
                            // Consume the `/` character, set the state, append the `>` character to the state of the current context and pop it from the scope chain
                            position++;
                            state  = Token.HTMLEndTagOpen;
                            append = ">";
                            pop    = true;
                        }
                    }
                    else
                    {
                        // Consume the current character and set the state
                        position++;
                        state = Token.CSSDelimiter;
                    }

                    break;

                default:

                    return null;
            }

            // Set the current position and state
            this.Position = position;
            this.State    = state;

            // If the element state is being closed
            if (fusion && scope != null && scope.State == "<" && scope.Tags == 0)
            {
                // Append the `>` character to the state of the current context and pop it from the scope chain
                append = ">";
                pop    = true;

                // Set the language state
                this.State = language;
            }
            // If either the style or selector states are being closed
            else if (fusion && scope != null && ((scope.State == "@{"
                                               || scope.State == "@{:") && scope.Braces      == 0
                                               || scope.State == "@("   && scope.Parentheses == 0
                                               || scope.State == "@["   && scope.Brackets    == 0))
            {
                // Replace the state of the current context and pop it from the scope chain
                pop     = true;
                replace = scope.State == "@(" ?
                          "@()" :
                          scope.State == "@[" ?
                          "@[]" :
                          "@{}";

                // Set the language state
                this.State = language;
            }
            // If a closing start tag is pushing a context into the scope chain
            else if (push != null && state == Token.HTMLStartTagClose)
            {
                // If a script context is being pushed, set the language state
                if (push.State == "<script")
                    this.State = "js";
                // If a style context is being pushed, set the language state
                else if (push.State == "<style")
                    this.State = "css";
            }

            // If there's a current context
            if (scope != null)
            {
                // If there's a replacement string for the state, set the state of the current context
                if (!String.IsNullOrEmpty(replace))
                    scope.State = replace;

                // If there's an append string for the state, append the string to the state of the current context
                if (!String.IsNullOrEmpty(append))
                    scope.State += append;
            }

            // If there's a scope chain
            if (chain != null)
            {
                // If a context should be pushed into the scope chain
                if (push != null)
                {
                    // If the pop flag is set and there are already contexts in the scope chain, replace the last context
                    if (pop && scopes > 0)
                        chain[scopes - 1] = push;
                    // Push the context into the scope chain
                    else
                        chain.Add(push);
                }
                // If the pop flag is set, pop the current context from the scope chain
                else if (pop)
                    chain.RemoveAt(chain.Count - 1);
            }

            // If no characters were consumed, return null
            if (position == start)
                return null;

            // Create the current token
            token = new Token(state, source, start, position);

            // If the state is neither whitespace nor a comment
            if (!IsWhitespace(state) && !IsComment(state))
            {
                // Set the previous expression and token
                this.Expression = scope != null && pop ?
                                  scope.State :
                                  "";
                this.Token      = token;
            }

            // Return the current token
            return token;
        }

        public Token Peek(int? position = null, string language = null)
        {
            // Create a context-free lexer
            var lexer = new Lexer();

            // Copy the lexer parameters
            lexer.Language = this.Language;
            lexer.Position = position ?? this.Position;
            lexer.Source   = this.Source;
            lexer.State    = language ?? this.State;

            // Get the next token
            var peek = lexer.Next();

            while (peek != null)
            {
                // Get the next token type
                string type = peek.Type;

                // If the next token is neither whitespace nor a comment, break
                if (!IsWhitespace(type) && !IsComment(type))
                    break;

                // Get the next token
                peek = lexer.Next();
            }

            // Return the next token
            return peek;
        }

        public void Reset()
        {
            // Reset the scope chain, expression, position, state, and previous token
            this.Chain      = null;
            this.Expression = "";
            this.Position   = 0;
            this.State      = "";
            this.Token      = null;
        }
    }
}