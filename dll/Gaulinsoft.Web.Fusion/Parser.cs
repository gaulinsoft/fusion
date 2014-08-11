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
    public class Parser : Lexer, ICloneable, IEquatable<Parser>
    {
        public Parser()
            : this(null, null)
        {
            //
        }

        public Parser(string source, string language = null)
            : base(source, language)
        {
            //
        }

        protected new TParser Clone<TParser>()
            where TParser : Parser, new()
        {
            // Create a clone of the lexer as a parser
            var parser = base.Clone<TParser>();

            // Return the parser
            return parser;
        }

        public override object Clone()
        {
            // Return a clone of this parser as an object
            return this.Clone<Parser>();
        }

        public bool Equals(Parser parser)
        {
            // If a parser wasn't provided, return false
            if (parser == null)
                return false;

            // If the parsers don't have matching lexers, return false
            if (!base.Equals(parser))
                return false;

            //

            return true;
        }

        // ### TEMPORARILY PUBLIC UNTIL PARSER IS READY ###
        public new string State
        {
            get
            {
                return this.State;
            }
        }
        public new Token  Token
        {
            get
            {
                return this.Token;
            }
        }
    }
}