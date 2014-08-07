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
using System.Web.Optimization;
using Microsoft.Ajax.Utilities;

namespace Gaulinsoft.Web.Optimization
{
    public class FusionMinify : IBundleTransform
    {
        private readonly CodeSettings _defaultScriptSettings = new CodeSettings
        {
            // Preserve important comments unlike the Microsoft defaults (which make no sense by the way)
            EvalTreatment             = EvalTreatment.MakeImmediateSafe,
            PreserveImportantComments = true
        };

        private readonly CssSettings _defaultStyleSettings = new CssSettings
        {
            // Preserve important comments unlike the Microsoft defaults
            CommentMode = CssComment.Important
        };

        public FusionMinify(string language = null)
        {
            // If the language is JavaScript (or no language was provided), set the default script settings
            if (language == null || language == "js" || language == "fjs")
                this._scriptSettings = _defaultScriptSettings.Clone();
            // If the language is CSS, set the default style settings
            else if (language == "css" || language == "fcss")
                this._styleSettings = _defaultStyleSettings.Clone();
        }

        public FusionMinify(CodeSettings settings)
        {
            // Set the script settings
            this._scriptSettings = settings ?? _defaultScriptSettings.Clone();
        }

        public FusionMinify(CssSettings settings)
        {
            // Set the style settings
            this._styleSettings = settings ?? _defaultStyleSettings.Clone();
        }
        
        protected CodeSettings _scriptSettings = null;
        protected CssSettings  _styleSettings  = null;

        public void Process(BundleContext context, BundleResponse response)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            if (response == null)
                throw new ArgumentNullException("response");

            // If instrumentation mode is enabled or there are no settings, return
            if (context.EnableInstrumentation || this._scriptSettings == null && this._styleSettings == null)
                return;

            // Create the minifier and minify the content
            var    minifier = new Minifier();
            string content  = this._styleSettings == null ?
                              minifier.MinifyJavaScript(response.Content, this._scriptSettings) :
                              minifier.MinifyStyleSheet(response.Content, this._styleSettings, this._scriptSettings);

            // Replace the content with either the minified content or errors list
            response.Content = minifier.ErrorList.Count > 0 ?
                               "/*\r\n    " + String.Join("\r\n    ", minifier.ErrorList) + "\r\n*/" :
                               content;
        }
    }
}