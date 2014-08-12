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
using Microsoft.VisualStudio.Text.Classification;

namespace extension
{
    internal class FusionClassifier : Classifier<FusionHighlighter, FusionToken>
    {
        public FusionClassifier(IClassificationTypeRegistryService registry, string language = null)
            : base(registry, language)
        {
            //
        }

        protected override IClassificationType GetClassificationType(FusionToken token)
        {
            if (token == null)
                throw new ArgumentNullException("token");

            // Get the token type
            string type = token.Token.Type;

            // If the type is already cached, return the classification type
            if (this._cache.ContainsKey(type))
                return this._cache[type];

            IClassificationType classification = null;

            // Get the classification type
            switch (type)
            {
                // JAVASCRIPT IDENTIFIER
                case Token.JavaScriptIdentifier:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptIdentifier);
                    break;
                // JAVASCRIPT RESERVED WORD
                case Token.JavaScriptReservedWord:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptReservedWord);
                    break;
                // JAVASCRIPT PUNCTUATOR
                case Token.JavaScriptPunctuator:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptPunctuator);
                    break;
                // JAVASCRIPT NUMBER
                case Token.JavaScriptNumber:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptNumber);
                    break;
                // JAVASCRIPT STRING
                case Token.JavaScriptDoubleQuotedString:
                case Token.JavaScriptSingleQuotedString:
                case Token.JavaScriptTemplateString:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptString);
                    break;
                // JAVASCRIPT REGEXP
                case Token.JavaScriptRegExp:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptRegExp);
                    break;
                // JAVASCRIPT COMMENT
                case Token.JavaScriptBlockComment:
                case Token.JavaScriptLineComment:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptComment);
                    break;
                // JAVASCRIPT TEXT
                case Token.JavaScriptInvalidCharacter:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptText);
                    break;
                // JAVASCRIPT WHITESPACE
                case Token.JavaScriptWhitespace:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.JavaScriptWhitespace);
                    break;
                // HTML TEXT
                case Token.HTMLText:
                case Token.HTMLCDATAText:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLText);
                    break;
                // HTML TAG OPEN/CLOSE
                case Token.HTMLStartTagOpen:
                case Token.HTMLStartTagClose:
                case Token.HTMLStartTagSelfClose:
                case Token.HTMLEndTagOpen:
                case Token.HTMLEndTagClose:
                case Token.HTMLDOCTYPEOpen:
                case Token.HTMLDOCTYPEClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLTagOpenClose);
                    break;
                // HTML TAG NAME
                case Token.HTMLStartTagName:
                case Token.HTMLEndTagName:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLTagName);
                    break;
                // HTML TAG TEXT
                case Token.HTMLStartTagSolidus:
                case Token.HTMLEndTagText:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLTagText);
                    break;
                // HTML TAG WHITESPACE
                case Token.HTMLStartTagWhitespace:
                case Token.HTMLEndTagWhitespace:
                case Token.HTMLDOCTYPEWhitespace:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLTagWhitespace);
                    break;
                // HTML CHARACTER REFERENCE
                case Token.HTMLCharacterReference:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLCharacterReference);
                    break;
                // HTML ATTRIBUTE NAME
                case Token.HTMLAttributeName:
                case Token.HTMLDOCTYPEString:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLAttributeName);
                    break;
                // HTML ATTRIBUTE VALUE
                case Token.HTMLAttributeOperator:
                case Token.HTMLAttributeValue:
                case Token.HTMLAttributeDoubleQuotedValue:
                case Token.HTMLAttributeSingleQuotedValue:
                case Token.HTMLDOCTYPEDoubleQuotedString:
                case Token.HTMLDOCTYPESingleQuotedString:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLAttributeValue);
                    break;
                // HTML COMMENT
                case Token.HTMLCommentOpen:
                case Token.HTMLCommentText:
                case Token.HTMLCommentClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLComment);
                    break;
                // HTML BOGUS COMMENT
                case Token.HTMLBogusCommentOpen:
                case Token.HTMLBogusCommentText:
                case Token.HTMLBogusCommentClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLBogusComment);
                    break;
                // HTML DOCTYPE
                case Highlighter.HTMLDOCTYPEDeclaration:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLDOCTYPE);
                    break;
                // HTML CDATA
                case Token.HTMLCDATAOpen:
                case Token.HTMLCDATAClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.HTMLCDATA);
                    break;
                // CSS SELECTOR
                case Highlighter.CSSSelector:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSSelector);
                    break;
                // CSS AT-RULE
                case Highlighter.CSSAtRule:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSAtRule);
                    break;
                // CSS DECLARATION NAME
                case Highlighter.CSSDeclarationName:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSDeclarationName);
                    break;
                // CSS DECLARATION VALUE
                case Highlighter.CSSDeclarationValue:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSDeclarationValue);
                    break;
                // CSS DECLARATION IMPORTANT
                case Highlighter.CSSDeclarationImportant:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSDeclarationImportant);
                    break;
                // CSS COMMENT
                case Token.CSSComment:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSComment);
                    break;
                // CSS TEXT
                case Highlighter.CSSInvalidCharacters:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSText);
                    break;
                // CSS WHITESPACE
                case Token.CSSWhitespace:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.CSSWhitespace);
                    break;
                // FUSION TAG OPEN/CLOSE
                case Token.FusionStartTagOpen:
                case Token.FusionStartTagClose:
                case Token.FusionStartTagSelfClose:
                case Token.FusionEndTagOpen:
                case Token.FusionEndTagClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.FusionTagOpenClose);
                    break;
                // FUSION ATTRIBUTE STRING
                case Token.FusionAttributeTemplateString:
                case Token.FusionAttributeTemplateStringHead:
                case Token.FusionAttributeTemplateStringMiddle:
                case Token.FusionAttributeTemplateStringTail:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.FusionAttributeString);
                    break;
                // FUSION SUBSTITUTION
                case Token.FusionSubstitutionOpen:
                case Token.FusionSubstitutionClose:
                case Token.FusionObjectSubstitutionOpen:
                case Token.FusionObjectSubstitutionClose:
                case Token.FusionSelectorSubstitutionOpen:
                case Token.FusionSelectorSubstitutionClose:
                case Token.FusionStyleSubstitutionOpen:
                case Token.FusionStyleSubstitutionClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.FusionSubstitution);
                    break;
                // FUSION TEXT
                case Token.FusionProperty:
                case Token.FusionObjectOpen:
                case Token.FusionObjectClose:
                case Token.FusionSelectorOpen:
                case Token.FusionSelectorClose:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.FusionText);
                    break;
                default:
                    classification = this._registry.GetClassificationType(FusionClassificationTypes.Unknown);
                    break;
            }

            // Set the classification type in the cache
            this._cache[type] = classification;

            // Return the classification type
            return classification;
        }
    }
}