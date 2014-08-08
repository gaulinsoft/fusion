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

namespace extension
{
    internal static class FusionClassificationTypes
    {
        internal const string JavaScriptIdentifier    = "JavaScriptIdentifier";
        internal const string JavaScriptReservedWord  = "JavaScriptReservedWord";
        internal const string JavaScriptPunctuator    = "JavaScriptPunctuator";
        internal const string JavaScriptNumber        = "JavaScriptNumber";
        internal const string JavaScriptString        = "JavaScriptString";
        internal const string JavaScriptRegExp        = "JavaScriptRegExp";
        internal const string JavaScriptComment       = "JavaScriptComment";
        internal const string JavaScriptText          = "JavaScriptText";
        internal const string JavaScriptWhitespace    = "JavaScriptWhitespace";
        internal const string HTMLText                = "HTMLText";
        internal const string HTMLTagOpenClose        = "HTMLTagOpenClose";
        internal const string HTMLTagName             = "HTMLTagName";
        internal const string HTMLTagText             = "HTMLTagText";
        internal const string HTMLTagWhitespace       = "HTMLTagWhitespace";
        internal const string HTMLCharacterReference  = "HTMLCharacterReference";
        internal const string HTMLAttributeName       = "HTMLAttributeName";
        internal const string HTMLAttributeValue      = "HTMLAttributeValue";
        internal const string HTMLComment             = "HTMLComment";
        internal const string HTMLBogusComment        = "HTMLBogusComment";
        internal const string HTMLDOCTYPE             = "HTMLDOCTYPE";
        internal const string HTMLCDATA               = "HTMLCDATA";
        internal const string CSSSelector             = "CSSSelector";
        internal const string CSSAtRule               = "CSSAtRule";
        internal const string CSSDeclarationName      = "CSSDeclarationName";
        internal const string CSSDeclarationValue     = "CSSDeclarationValue";
        internal const string CSSDeclarationImportant = "CSSDeclarationImportant";
        internal const string CSSComment              = "CSSComment";
        internal const string CSSText                 = "CSSText";
        internal const string CSSWhitespace           = "CSSWhitespace";
        internal const string FusionTagOpenClose      = "FusionTagOpenClose";
        internal const string FusionAttributeString   = "FusionAttributeString";
        internal const string FusionSubstitution      = "FusionSubstitution";
        internal const string FusionText              = "FusionText";
        internal const string Unknown                 = "Unknown";
    }
}