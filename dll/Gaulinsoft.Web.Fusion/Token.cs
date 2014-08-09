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
using System.Web;

namespace Gaulinsoft.Web.Fusion
{
    public class Token
    {
        public Token(string type = null, string source = null, int? start = null, int? end = null)
        {
            // Set the token parameters
            this.Type   = type   ?? "";
            this.Source = source ?? "";
            this.Start  = start  ?? 0;
            this.End    = end    ?? 0;
        }

        public static string ClassPrefix = "fusion_";

        public string Type   { get; set; }
        public string Source { get; set; }
        public int    Start  { get; set; }
        public int    End    { get; set; }

        public Token Clone()
        {
            // Return a copy of this token
            return new Token
            {
                Type   = this.Type,
                Source = this.Source,
                Start  = this.Start,
                End    = this.End
            };
        }

        public bool Equals(Token token)
        {
            // Return true if the token has the same type and text
            return (this.Type   == token.Type
                 && this.Text() == token.Text());
        }

        public string HTML()
        {
            // Create the HTML text of the token
            string text = HttpUtility.HtmlEncode(this.Text());
            
            // If the token doesn't have a type or it is either whitespace or plain text, return the HTML text
            if (String.IsNullOrEmpty(this.Type) || Lexer.IsWhitespace(this.Type) || Lexer.IsText(this.Type))
                return text;
            
            // Return the HTML of the token
            return "<span class=\"" + ClassPrefix + this.Type + "\">" + text + "</span>";
        }

        public string Text()
        {
            // Return the token text from the source
            return this.Source.Substring(this.Start, this.End - this.Start);
        }

        public const string JavaScriptIdentifier                = "JavaScriptIdentifier";
        public const string JavaScriptReservedWord              = "JavaScriptReservedWord";
        public const string JavaScriptPunctuator                = "JavaScriptPunctuator";
        public const string JavaScriptNumber                    = "JavaScriptNumber";
        public const string JavaScriptDoubleQuotedString        = "JavaScriptDoubleQuotedString";
        public const string JavaScriptSingleQuotedString        = "JavaScriptSingleQuotedString";
        public const string JavaScriptTemplateString            = "JavaScriptTemplateString";
        public const string JavaScriptRegExp                    = "JavaScriptRegExp";
        public const string JavaScriptBlockComment              = "JavaScriptBlockComment";
        public const string JavaScriptLineComment               = "JavaScriptLineComment";
        public const string JavaScriptInvalidCharacter          = "JavaScriptInvalidCharacter";
        public const string JavaScriptWhitespace                = "JavaScriptWhitespace";
        public const string HTMLText                            = "HTMLText";
        public const string HTMLStartTagOpen                    = "HTMLStartTagOpen";
        public const string HTMLStartTagName                    = "HTMLStartTagName";
        public const string HTMLStartTagSolidus                 = "HTMLStartTagSolidus";
        public const string HTMLStartTagWhitespace              = "HTMLStartTagWhitespace";
        public const string HTMLStartTagClose                   = "HTMLStartTagClose";
        public const string HTMLStartTagSelfClose               = "HTMLStartTagSelfClose";
        public const string HTMLEndTagOpen                      = "HTMLEndTagOpen";
        public const string HTMLEndTagName                      = "HTMLEndTagName";
        public const string HTMLEndTagText                      = "HTMLEndTagText";
        public const string HTMLEndTagWhitespace                = "HTMLEndTagWhitespace";
        public const string HTMLEndTagClose                     = "HTMLEndTagClose";
        public const string HTMLCharacterReference              = "HTMLCharacterReference";
        public const string HTMLAttributeName                   = "HTMLAttributeName";
        public const string HTMLAttributeOperator               = "HTMLAttributeOperator";
        public const string HTMLAttributeValue                  = "HTMLAttributeValue";
        public const string HTMLAttributeDoubleQuotedValue      = "HTMLAttributeDoubleQuotedValue";
        public const string HTMLAttributeSingleQuotedValue      = "HTMLAttributeSingleQuotedValue";
        public const string HTMLCommentOpen                     = "HTMLCommentOpen";
        public const string HTMLCommentText                     = "HTMLCommentText";
        public const string HTMLCommentClose                    = "HTMLCommentClose";
        public const string HTMLBogusCommentOpen                = "HTMLBogusCommentOpen";
        public const string HTMLBogusCommentText                = "HTMLBogusCommentText";
        public const string HTMLBogusCommentClose               = "HTMLBogusCommentClose";
        public const string HTMLDOCTYPEOpen                     = "HTMLDOCTYPEOpen";
        public const string HTMLDOCTYPEString                   = "HTMLDOCTYPEString";
        public const string HTMLDOCTYPEDoubleQuotedString       = "HTMLDOCTYPEDoubleQuotedString";
        public const string HTMLDOCTYPESingleQuotedString       = "HTMLDOCTYPESingleQuotedString";
        public const string HTMLDOCTYPEWhitespace               = "HTMLDOCTYPEWhitespace";
        public const string HTMLDOCTYPEClose                    = "HTMLDOCTYPEClose";
        public const string HTMLCDATAOpen                       = "HTMLCDATAOpen";
        public const string HTMLCDATAText                       = "HTMLCDATAText";
        public const string HTMLCDATAClose                      = "HTMLCDATAClose";
        public const string CSSIdentifier                       = "CSSIdentifier";
        public const string CSSNumber                           = "CSSNumber";
        public const string CSSDelimiter                        = "CSSDelimiter";
        public const string CSSPunctuator                       = "CSSPunctuator";
        public const string CSSDimension                        = "CSSDimension";
        public const string CSSPercentage                       = "CSSPercentage";
        public const string CSSComma                            = "CSSComma";
        public const string CSSColon                            = "CSSColon";
        public const string CSSSemicolon                        = "CSSSemicolon";
        public const string CSSDoubleQuotedString               = "CSSDoubleQuotedString";
        public const string CSSSingleQuotedString               = "CSSSingleQuotedString";
        public const string CSSHash                             = "CSSHash";
        public const string CSSFunction                         = "CSSFunction";
        public const string CSSAtKeyword                        = "CSSAtKeyword";
        public const string CSSMatch                            = "CSSMatch";
        public const string CSSUrl                              = "CSSUrl";
        public const string CSSColumn                           = "CSSColumn";
        public const string CSSUnicodeRange                     = "CSSUnicodeRange";
        public const string CSSComment                          = "CSSComment";
        public const string CSSWhitespace                       = "CSSWhitespace";
        public const string FusionStartTagOpen                  = "FusionStartTagOpen";
        public const string FusionStartTagClose                 = "FusionStartTagClose";
        public const string FusionStartTagSelfClose             = "FusionStartTagSelfClose";
        public const string FusionEndTagOpen                    = "FusionEndTagOpen";
        public const string FusionEndTagClose                   = "FusionEndTagClose";
        public const string FusionProperty                      = "FusionProperty";
        public const string FusionObject                        = "FusionObject";
        public const string FusionSelector                      = "FusionSelector";
        public const string FusionAttributeTemplateString       = "FusionAttributeTemplateString";
        public const string FusionAttributeTemplateStringHead   = "FusionAttributeTemplateStringHead";
        public const string FusionAttributeTemplateStringMiddle = "FusionAttributeTemplateStringMiddle";
        public const string FusionAttributeTemplateStringTail   = "FusionAttributeTemplateStringTail";
        public const string FusionSubstitutionOpen              = "FusionSubstitutionOpen";
        public const string FusionSubstitutionClose             = "FusionSubstitutionClose";
        public const string FusionObjectSubstitutionOpen        = "FusionObjectSubstitutionOpen";
        public const string FusionObjectSubstitutionClose       = "FusionObjectSubstitutionClose";
        public const string FusionSelectorSubstitutionOpen      = "FusionSelectorSubstitutionOpen";
        public const string FusionSelectorSubstitutionClose     = "FusionSelectorSubstitutionClose";
        public const string FusionStyleSubstitutionOpen         = "FusionStyleSubstitutionOpen";
        public const string FusionStyleSubstitutionClose        = "FusionStyleSubstitutionClose";
    }
}