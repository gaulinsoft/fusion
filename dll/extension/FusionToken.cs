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
using Gaulinsoft.VisualStudio.EditorExtensions;
using Gaulinsoft.Web.Fusion;

namespace extension
{
    internal class FusionToken : IToken
    {
        internal Token Token = null;

        public int Start
        {
            get
            {
                // Return the token starting position
                return this.Token.Start;
            }
        }

        public int End
        {
            get
            {
                // Return the token ending position
                return this.Token.End;
            }
        }
        
        public int GetBreakPosition()
        {
            // If the token isn't whitespace, return
            if (!Lexer.IsWhitespace(this.Token.Type))
                return -1;

            // Return the position of the first line break
            return this.Token.Text().IndexOf('\n');
        }
    }
}