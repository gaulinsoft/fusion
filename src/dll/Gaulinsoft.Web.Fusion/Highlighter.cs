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
    public class Highlighter
    {
        public Highlighter(string source = null, string language = null)
        {
            // Create the lexer
            this.Lexer = new Lexer(source, language);
        }

        protected Highlighter()
        {
            //
        }

        public Lexer         Lexer    { get; protected set; }
        public IList<string> Chain    { get; protected set; }
        public Token         Previous { get; protected set; }

        public Highlighter Clone()
        {
            // Create an empty highlighter
            var highlighter = new Highlighter();

            // Create a clone of the lexer
            highlighter.Chain    = this.Chain != null ?
                                   this.Chain.ToList() :
                                   null;
            highlighter.Lexer    = this.Lexer != null ?
                                   this.Lexer.Clone() :
                                   null;
            highlighter.Previous = this.Previous != null ?
                                   this.Previous.Clone() :
                                   null;

            // Return the highlighter
            return highlighter;
        }

        public bool Equals(Highlighter highlighter)
        {
            // If a highlighter wasn't provided, return false
            if (highlighter == null)
                return false;

            // If the highlighters don't have matching lexers, return false
            if ((this.Lexer == null) != (highlighter.Lexer == null) || this.Lexer != null && !this.Lexer.Equals(highlighter.Lexer))
                return false;

            // Get the scope chains
            var chainHighlighter = highlighter.Chain;
            var chainThis        = this.Chain;

            // If the highlighters don't have matching scope chain lengths, return false
            if ((chainThis != null ? chainThis.Count : 0) != (chainHighlighter != null ? chainHighlighter.Count : 0))
                return false;

            // If the highlighters have scope chains, return false if they are not equal
            if (chainThis != null)
                for (int i = 0, j = chainThis.Count; i < j; i++)
                    if (chainThis[i] != chainHighlighter[i])
                        return false;

            // If the highlighters don't have matching previous tokens, return false
            if ((this.Previous == null) != (highlighter.Previous == null) || this.Previous != null && !this.Previous.Equals(highlighter.Previous))
                return false;

            return true;
        }

        public Token Next()
        {
            // If there's no lexer, return null
            if (this.Lexer == null)
                return null;

            // Get the next token from the lexer
            var token    = this.Lexer.Next();
            var chain    = this.Chain;
            var previous = this.Previous;

            // If there's no token, return null
            if (token == null)
                return null;

            // Set the previous token
            this.Previous = this.Lexer.Token;

            // Get the token type
            string type = token.Type;

            // If the token isn't a CSS token, return it
            if (!type.StartsWith("CSS"))
                return token;

            // If this is the first CSS token, create the CSS scope chain
            if (chain == null)
                chain = this.Chain = new List<string>();

            // If there's no previous token or the previous token was neither a CSS token nor a fusion substitution closing token
            if (previous == null || !previous.Type.StartsWith("CSS") && previous.Type != Token.FusionObjectSubstitutionClose
                                                                     && previous.Type != Token.FusionSelectorSubstitutionClose
                                                                     && previous.Type != Token.FusionStyleSubstitutionClose)
                // Unshift the selector state into the scope chain
                chain.Insert(0, "*");

            // If the token is either whitespace or a comment, return it
            if (Lexer.IsWhitespace(type) || Lexer.IsComment(type))
                return token;

            // Get the current context and CSS punctuator
            string scope      = chain.Count > 0 ?
                                chain[0] :
                                null;
            string group      = null;
            string punctuator = type == Token.CSSPunctuator ?
                                token.Text() :
                                null;

            // If the current token is an opening brace
            if (punctuator == "{")
            {
                // If the current context is neither a qualified rule or an at-rule
                if (scope != "*" && scope != "@")
                {
                    // Unshift a qualified rule context into the scope chain
                    scope = "*{";
                    chain.Insert(0, scope);
                }
                // Append the current character to the current context
                else
                    scope += chain[0] += punctuator;
            }
            // If the current token is a closing brace
            else if (punctuator == "}")
            {
                // If the current context is a qualified rule block
                if (scope == "*{" || scope == "*{:")
                {
                    // If the current context isn't the top-level context
                    if (chain.Count > 1)
                    {
                        // Shift the current context from the scope chain and get the parent context
                        chain.RemoveAt(0);
                        scope = chain.Count > 0 ?
                                chain[0] :
                                null;
                    }
                    // Reset the current context
                    else
                        scope = chain[0] = "*";
                }
                // If the current context is an at-rule block
                else if (scope == "@{" || scope == "@{:")
                {
                    // Shift the current context from the scope chain and get the parent context
                    chain.RemoveAt(0);
                    scope = chain.Count > 0 ?
                            chain[0] :
                            null;
                }
            }
            // If the current token is a semi-colon
            else if (type == Token.CSSSemicolon)
            {
                // If the current context is an at-rule without a block
                if (scope == "@")
                {
                    // Shift the current context from the scope chain and get the parent context
                    chain.RemoveAt(0);
                    scope = chain.Count > 0 ?
                            chain[0] :
                            null;
                }
                // If the current context is a declaration value, set the current context as a declaration name context
                else if (scope == "*{:" || scope == "@{:")
                    scope = chain[0] = scope[0] + "{";
            }
            // If the current token is a colon and the current context is a declaration name, append the current character to the current context
            else if (type == Token.CSSColon && (scope == "*{" || scope == "@{"))
                scope += chain[0] += ":";
            else
            {
                // If the current token is an at-keyword and the current context opens an at-rule
                if (type == Token.CSSAtKeyword && (scope == "*"
                                                || scope == "*{"
                                                || scope == "@{"))
                {
                    // Unshift an at-rule context into the scope chain
                    scope = "@";
                    chain.Insert(0, scope);
                }

                // Get the next token if the current context is an at-rule declaration name
                var peek = scope == "@{" && type == Token.CSSIdentifier ?
                           this.Lexer.Peek(token.End) :
                           null;

                // Get the group type from the tokens and context
                group = scope == "*{" && type == Token.CSSIdentifier || peek != null && peek.Type == Token.CSSColon ?
                        Highlighter.CSSDeclarationName :
                        scope == "*{:" || scope == "@{:" ?
                        Highlighter.CSSDeclarationValue :
                        scope == "*" || scope == "@{" ?
                        Highlighter.CSSSelector :
                        scope == "@" ?
                        Highlighter.CSSAtRule :
                        null;

                // If the current context is a declaration value context
                if (scope == "*{:" || scope == "@{:")
                {
                    // If the current token is the `!` delimiter
                    if (type == Token.CSSDelimiter && token.Text() == "!")
                    {
                        // Get the next token
                        peek = this.Lexer.Peek(token.End);

                        // If the next token is the `important` identifier
                        if (peek != null && peek.Type == Token.CSSIdentifier && peek.Text().ToLower() == "important")
                        {
                            // Get the next token
                            peek = this.Lexer.Peek(peek.End);

                            // If the next token is either a semi-colon or closing brace, set the important declaration group type
                            if (peek != null && (peek.Type == Token.CSSSemicolon || peek.Type == Token.CSSPunctuator && peek.Text() == "}"))
                                group = Highlighter.CSSDeclarationImportant;
                        }
                    }
                    // If the previous token was the `!` delimiter and the current token is the `important` identifier
                    else if (previous != null && previous.Type == Token.CSSDelimiter && previous.Text() == "!" && type == Token.CSSIdentifier && token.Text().ToLower() == "important")
                    {
                        // Get the next token
                        peek = this.Lexer.Peek(token.End);

                        // If the next token is either a semi-colon or closing brace, set the important declaration group type
                        if (peek != null && (peek.Type == Token.CSSSemicolon || peek.Type == Token.CSSPunctuator && peek.Text() == "}"))
                            group = Highlighter.CSSDeclarationImportant;
                    }
                }
            }

            // If there isn't a group type, return the token
            if (group == null)
                return token;

            // Create a clone of the token and set the group type
            token = token.Clone();
            token.Type = group;

            return token;
        }

        public void Reset()
        {
            // Reset the lexer
            if (this.Lexer != null)
                this.Lexer.Reset();

            // Reset the chain and previous token
            this.Chain    = null;
            this.Previous = null;
        }
        
        public const string CSSAtRule               = "CSSAtRule";
        public const string CSSDeclarationName      = "CSSDeclarationName";
        public const string CSSDeclarationValue     = "CSSDeclarationValue";
        public const string CSSDeclarationImportant = "CSSDeclarationImportant";
        public const string CSSSelector             = "CSSSelector";
    }
}