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
    public class Scope
    {
        public Scope(string state = null)
        {
            // Set the scope parameters
            this.State = state ?? "";
            this.Tag   = "";
        }

        public string State { get; set; }
        public string Tag   { get; set; }

        public int Braces      { get; set; }
        public int Brackets    { get; set; }
        public int Parentheses { get; set; }
        public int Tags        { get; set; }

        public Scope Clone()
        {
            // Return a copy of this scope
            return new Scope
            {
                State = this.State,
                Tag   = this.Tag,

                Braces      = this.Braces,
                Brackets    = this.Brackets,
                Parentheses = this.Parentheses,
                Tags        = this.Tags
            };
        }

        public bool Equals(Scope scope)
        {
            // Return true if the scope has the same state and counts
            return (this.Braces      == scope.Braces
                 && this.Brackets    == scope.Brackets
                 && this.Parentheses == scope.Parentheses
                 && this.State       == scope.State
                 && this.Tag         == scope.Tag
                 && this.Tags        == scope.Tags);
        }
    }
}