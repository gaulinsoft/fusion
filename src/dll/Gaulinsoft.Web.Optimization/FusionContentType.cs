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
using Gaulinsoft.Web.Fusion;
using Microsoft.Ajax.Utilities;

namespace Gaulinsoft.Web.Optimization
{
    public class FusionContentType : IBundleTransform
    {
        public FusionContentType(string language)
        {
            // Set the content type
            this.ContentType = language == "js"
                            || language == "fjs" ?
                               "text/javascript" :
                               language == "html"
                            || language == "fhtml" ?
                               "text/html" :
                               language == "css"
                            || language == "fcss" ?
                               "text/css" :
                               null;
        }

        public readonly string ContentType = null;

        public void Process(BundleContext context, BundleResponse response)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            if (response == null)
                throw new ArgumentNullException("response");

            // If there's a content type, set the response content type
            if (this.ContentType != null)
                response.ContentType = this.ContentType;
        }
    }
}