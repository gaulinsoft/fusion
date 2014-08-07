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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Optimization;
using Microsoft.Ajax.Utilities;

namespace Gaulinsoft.Web.Optimization
{
    public class FusionBundle : Bundle
    {
        public FusionBundle(string virtualPath, string language = null)
            : this(virtualPath, language, null, null)
        {
        }

        public FusionBundle(string virtualPath, CodeSettings settings)
            : this(virtualPath, null, settings, null)
        {
        }

        public FusionBundle(string virtualPath, CssSettings settings)
            : this(virtualPath, null, null, settings)
        {
        }

        private FusionBundle(string virtualPath, string language, CodeSettings scriptSettings, CssSettings styleSettings)
            : base(virtualPath)
        {
            if (virtualPath == null)
                throw new ArgumentNullException("virtualPath");

            // Set the concatenation token and orderer
            this.ConcatenationToken = "\r\n";
            this.Orderer            = new DefaultFusionBundleOrderer();

            // Clear the transforms
            this.Transforms.Clear();

            // If a language wasn't provided
            if (language == null)
            {
                // Check if the virtual path has a known file extension
                var match = Regex.Match(virtualPath, @"\.(f?js|f?html|f?css)$");

                // Set the language to the matched file extension (or default to fjs)
                language = match.Success ?
                           match.Groups[1].Value :
                           "fjs";

                // If the matched file extension isn't a fusion language, set the transpile source language
                if (language[0] != 'f')
                    language = "f" + language;
            }

            // Add the content type transform
            this.Transforms.Add(new FusionContentType(language));

            // If the language is a fusion language, add the transpile transform
            if (language[0] == 'f')
                this.Transforms.Add(new FusionTranspile(language));

            // If the language is a script or style, add the minify transform
            if (language == "js" || language == "fjs" || language == "css" || language == "fcss")
                this.Transforms.Add(scriptSettings != null ?
                                    new FusionMinify(scriptSettings) :
                                    styleSettings != null ?
                                    new FusionMinify(styleSettings) :
                                    new FusionMinify(language));
        }
    }
}