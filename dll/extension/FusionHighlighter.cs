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
using Microsoft.VisualStudio.Text;

namespace extension
{
    internal class FusionHighlighter : IHighlighter<FusionHighlighter, FusionToken>
    {
        public FusionHighlighter()
        {
            // Create the highlighter
            this.Highlighter = new Highlighter();
        }

        internal Highlighter Highlighter = null;

        public string Language
        {
            get
            {
                // Return the language of the highlighter
                return this.Highlighter.Language;
            }
            set
            {
                // Set the language of the highlighter
                this.Highlighter.Language = value;
            }
        }

        public int Position
        {
            get
            {
                // Return the position of the highlighter
                return this.Highlighter.Position;
            }
            set
            {
                // Set the position of the highlighter
                this.Highlighter.Position = value;
            }
        }

        public string Source
        {
            get
            {
                // Return the source code of the highlighter
                return this.Highlighter.Source;
            }
            set
            {
                // Set the source code of the highlighter
                this.Highlighter.Source = value;
            }
        }

        public FusionHighlighter Clone()
        {
            // Return a wrapper highlighter with a cloned fusion highlighter
            return new FusionHighlighter
            {
                Highlighter = this.Highlighter.Clone() as Highlighter
            };
        }

        public bool Equals(FusionHighlighter highlighter)
        {
            // If the highlighter is null, return false
            if (highlighter == null)
                return false;

            return this.Highlighter.Equals(highlighter.Highlighter);
        }

        public FusionToken Next()
        {
            // Get the next fusion token from the highlighter
            var token = this.Highlighter.Next();

            // If there's no fusion token, return null
            if (token == null)
                return null;

            // Return a wrapper token of the fusion token
            return new FusionToken
            {
                Token = token
            };
        }

        public int TrackingLineNumber
        {
            get;
            set;
        }

        public ITrackingPoint TrackingPoint
        {
            get;
            set;
        }
    }
}