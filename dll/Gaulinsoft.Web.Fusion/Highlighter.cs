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
    public class Highlighter : Lexer, ICloneable, IEquatable<Highlighter>
    {
        public Highlighter()
            : this(null, null)
        {
            //
        }

        public Highlighter(string source, string language = null)
            : base(source, language)
        {
            // If a language wasn't provided, return
            if (language == null)
                return;

            // Create the CSS scope chain
            this.StyleChain = language == "fjs"
                           || language == "fhtml"
                           || language == "fcss" ?
                              new List<string>() :
                              null;
        }

        protected IList<string> StyleChain { get; set; }

        public override string Language
        {
            get
            {
                return base.Language;
            }

            set
            {
                // Set the language of the lexer
                base.Language = value;

                // Set the CSS scope chain
                this.StyleChain = this._language == "fjs"
                               || this._language == "fhtml"
                               || this._language == "fcss" ?
                                  new List<string>() :
                                  null;
            }
        }

        protected new THighlighter Clone<THighlighter>()
            where THighlighter : Highlighter, new()
        {
            // Create a clone of the lexer as a highlighter
            var highlighter = base.Clone<THighlighter>();

            // Copy the highlighter parameters
            highlighter._token     = this._token != null ?
                                     this._token.Clone() as Token :
                                     null;
            highlighter.StyleChain = this.StyleChain != null ?
                                     this.StyleChain.ToList() :
                                     null;

            // Return the highlighter
            return highlighter;
        }

        public override object Clone()
        {
            // Return a clone of this highlighter as an object
            return this.Clone<Highlighter>();
        }

        public bool Equals(Highlighter highlighter)
        {
            // If a highlighter wasn't provided, return false
            if (highlighter == null)
                return false;

            // If the highlighters don't have matching lexers, return false
            if (!base.Equals(highlighter))
                return false;

            // Get the CSS scope chains
            var chainHighlighter = highlighter.StyleChain;
            var chainThis        = this.StyleChain;

            // If the highlighters don't have matching CSS scope chain lengths, return false
            if ((chainThis != null ? chainThis.Count : 0) != (chainHighlighter != null ? chainHighlighter.Count : 0))
                return false;

            // If the highlighters don't have matching cached tokens, return false
            if ((this._token == null) != (highlighter._token == null) || this._token != null && !this._token.Equals(highlighter._token))
                return false;

            // If the highlighters have CSS scope chains, return false if they are not equal
            if (chainThis != null)
                for (int i = 0, j = chainThis.Count; i < j; i++)
                    if (chainThis[i] != chainHighlighter[i])
                        return false;

            return true;
        }

        public override bool Hack()
        {
            // If a CSS scope chain already exists, return false
            if (this.StyleChain != null)
                return false;

            // Hack the lexer
            base.Hack();

            // Create the CSS scope chain
            this.StyleChain = this._language == "fjs"
                           || this._language == "html"
                           || this._language == "fhtml"
                           || this._language == "css"
                           || this._language == "fcss" ?
                              new List<string>() :
                              null;

            // Return true if a CSS scope chain was created
            return this.StyleChain != null;
        }

        private Token _token = null;

        public override Token Next()
        {
            // Get the next token from the lexer
            var previous = this.Token;
            var token    = this._token ?? base.Next();
            var chain    = this.StyleChain;

            // If there's no token, return null
            if (token == null)
                return null;

            // Get the token type
            string type = token.Type;

            // If the token opens a DOCTYPE
            if (this._token == null && type == Token.HTMLDOCTYPEOpen)
            {
                // Create a cached copy of the token
                this._token = token.Clone() as Token;

                // Trim the first character from the cached token
                this._token.Start++;
                this._token.Type = Highlighter.HTMLDOCTYPEDeclaration;

                // Trim all but the first character from the token
                token.End = token.Start + 1;
            }
            // If there's a cached token, remove it
            else if (this._token != null)
                this._token = null;

            // If the highlighter doesn't have a CSS scope chain, return the token
            if (chain == null)
                return token;

            // If the token isn't a CSS token
            if (!type.StartsWith("CSS"))
            {
                // If there's no previous token, the previous token was not a CSS token, or the current token is a fusion substitution opening token
                if (previous == null || !previous.Type.StartsWith("CSS") || type == Token.FusionObjectSubstitutionOpen
                                                                         || type == Token.FusionSelectorSubstitutionOpen
                                                                         || type == Token.FusionStyleSubstitutionOpen)
                    return token;

                string last = null;

                do
                {
                    // If the CSS scope chain is empty, break
                    if (chain.Count == 0)
                        break;

                    // Get the last index of the chain
                    int index = chain.Count - 1;
                    
                    // Get the last scope in the chain
                    last = chain[index];

                    // Pop the last scope from the chain
                    chain.RemoveAt(index);
                }
                // Continue if the removed scope wasn't a selector context
                while (last != null && last != "*");

                return token;
            }

            // If the token is either whitespace or a comment, return it
            if (Lexer.IsWhitespace(type) || Lexer.IsComment(type))
                return token;

            // If there's no previous token or the previous token was neither a CSS token nor a fusion substitution closing token
            if (previous == null || !previous.Type.StartsWith("CSS") && previous.Type != Token.FusionObjectSubstitutionClose
                                                                     && previous.Type != Token.FusionSelectorSubstitutionClose
                                                                     && previous.Type != Token.FusionStyleSubstitutionClose)
                // Push the selector context into the scope chain
                chain.Add("*");

            // If the previous token was a fusion object opening punctuator, push a qualified rule context into the scope chain
            if (previous != null && previous.Type == Token.FusionObjectOpen)
                chain.Add("*{");

            // Get the current context and CSS punctuator
            int    current    = chain.Count - 1;
            string scope      = current >= 0 ?
                                chain[current] :
                                null;
            string punctuator = type == Token.CSSPunctuator ?
                                token.Text() :
                                null;

            // If the current token is an opening brace
            if (punctuator == "{")
            {
                // If the current context is an at-rule scope, set the scope as an at-rule block
                if (scope == "@")
                    chain[current] = scope + "{";
                // Push a qualified rule context into the scope chain
                else
                    chain.Add("*{");
            }
            // If the current token is a closing brace
            else if (punctuator == "}")
            {
                // If the current context isn't a selector context, pop it from the scope chain
                if (scope != null && scope != "*")
                    chain.RemoveAt(current);
            }
            // If the current token is a semi-colon
            else if (type == Token.CSSSemicolon)
            {
                // If the current context is a declaration value, set the current context as a declaration name context
                if (scope == "*{:" || scope == "@{:")
                    chain[current] = scope[0] + "{";
                // If the current context is an at-rule without a block, pop it from the scope chain
                else if (scope == "@")
                    chain.RemoveAt(current);
            }
            // If the current token is a colon and the current context is a declaration name, append the current character to the current context
            else if (type == Token.CSSColon && (scope == "*{" || scope == "@{"))
                chain[current] = scope + ":";
            else
            {
                // Get the next token if the current context is an at-rule declaration name
                var peek = scope == "@{" && type == Token.CSSIdentifier ?
                           this.Peek(token.End) :
                           null;

                // If the current token is an at-keyword and the current context can open an at-rule
                if (type == Token.CSSAtKeyword && (scope == "*"
                                                || scope == "*{"
                                                || scope == "@{"))
                {
                    // Push an at-rule context into the scope chain
                    chain.Add("@");

                    // Set the token type
                    token.Type = Highlighter.CSSAtRule;
                }
                // Set the token type from the tokens and current context
                else
                    token.Type = scope == "*{" && type == Token.CSSIdentifier || peek != null && peek.Type == Token.CSSColon ?
                                 Highlighter.CSSDeclarationName :
                                 scope == "*{:" || scope == "@{:" ?
                                 Highlighter.CSSDeclarationValue :
                                 scope == "*" || scope == "@{" ?
                                 Highlighter.CSSSelector :
                                 scope == "@" ?
                                 Highlighter.CSSAtRule :
                                 Highlighter.CSSInvalidCharacters;

                // If the current context is a declaration value context
                if (scope == "*{:" || scope == "@{:")
                {
                    // If the current token is the `!` delimiter
                    if (type == Token.CSSDelimiter && token.Text() == "!")
                    {
                        // Get the next token
                        peek = this.Peek(token.End);

                        // If the next token is the `important` identifier
                        if (peek != null && peek.Type == Token.CSSIdentifier && peek.Text().ToLower() == "important")
                        {
                            // Get the next token
                            peek = this.Peek(peek.End);

                            // If the next token is either a semi-colon or closing brace, set the important declaration type
                            if (peek != null && (peek.Type == Token.CSSSemicolon || peek.Type == Token.CSSPunctuator && peek.Text() == "}"))
                                token.Type = Highlighter.CSSDeclarationImportant;
                        }
                    }
                    // If the previous token was the `!` delimiter and the current token is the `important` identifier
                    else if (previous != null && previous.Type == Token.CSSDelimiter && previous.Text() == "!" && type == Token.CSSIdentifier && token.Text().ToLower() == "important")
                    {
                        // Get the next token
                        peek = this.Peek(token.End);

                        // If the next token is either a semi-colon or closing brace, set the important declaration type
                        if (peek != null && (peek.Type == Token.CSSSemicolon || peek.Type == Token.CSSPunctuator && peek.Text() == "}"))
                            token.Type = Highlighter.CSSDeclarationImportant;
                    }
                }
            }

            return token;
        }

        public override void Reset()
        {
            // Reset the lexer
            base.Reset();

            // Reset the CSS scope chain and cached token
            this._token     = null;
            this.StyleChain = null;
        }
        
        public const string HTMLDOCTYPEDeclaration  = "HTMLDOCTYPEDeclaration";
        public const string CSSAtRule               = "CSSAtRule";
        public const string CSSDeclarationName      = "CSSDeclarationName";
        public const string CSSDeclarationValue     = "CSSDeclarationValue";
        public const string CSSDeclarationImportant = "CSSDeclarationImportant";
        public const string CSSInvalidCharacters    = "CSSInvalidCharacters";
        public const string CSSSelector             = "CSSSelector";
    }
}