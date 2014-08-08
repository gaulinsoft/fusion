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
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Classification;
using Microsoft.VisualStudio.Utilities;

namespace extension
{
    internal static class FusionClassificationDefinitions
    {
        #region Content Types
        [Export]
        [Name("fjs")]
        [BaseDefinition("code")]
        internal static ContentTypeDefinition FusionJavaScriptContentType { get; set; }
        
        [Export]
        [Name("fhtml")]
        [BaseDefinition("code")]
        internal static ContentTypeDefinition FusionHTMLContentType { get; set; }
        
        [Export]
        [Name("fcss")]
        [BaseDefinition("code")]
        internal static ContentTypeDefinition FusionCSSContentType { get; set; }
        #endregion

        #region File Extensions
        [Export]
        [ContentType("fjs")]
        [FileExtension(".fjs")]
        internal static FileExtensionToContentTypeDefinition FusionJavaScriptFileExtension { get; set; }

        [Export]
        [ContentType("fhtml")]
        [FileExtension(".fhtml")]
        internal static FileExtensionToContentTypeDefinition FusionHTMLFileExtension { get; set; }

        [Export]
        [ContentType("fcss")]
        [FileExtension(".fcss")]
        internal static FileExtensionToContentTypeDefinition FusionCSSFileExtension { get; set; }
        #endregion

        #region Formats
        #region JavaScript Identifier
        [Name(FusionClassificationTypes.JavaScriptIdentifier), Export]
        internal static ClassificationTypeDefinition JavaScriptIdentifierClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptIdentifier)]
        [Name("JavaScriptIdentifierFormatDefinition")]
        [Order]
        internal sealed class JavaScriptIdentifierClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptIdentifierClassificationFormat()
            {
                this.DisplayName     = "JavaScript Identifier";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region JavaScript Reserved Word
        [Name(FusionClassificationTypes.JavaScriptReservedWord), Export]
        internal static ClassificationTypeDefinition JavaScriptReservedWordClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptReservedWord)]
        [Name("JavaScriptReservedWordFormatDefinition")]
        [Order]
        internal sealed class JavaScriptReservedWordClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptReservedWordClassificationFormat()
            {
                this.DisplayName     = "JavaScript Reserved Word";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region JavaScript Punctuator
        [Name(FusionClassificationTypes.JavaScriptPunctuator), Export]
        internal static ClassificationTypeDefinition JavaScriptPunctuatorClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptPunctuator)]
        [Name("JavaScriptPunctuatorFormatDefinition")]
        [Order]
        internal sealed class JavaScriptPunctuatorClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptPunctuatorClassificationFormat()
            {
                this.DisplayName     = "JavaScript Punctuator";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region JavaScript Number
        [Name(FusionClassificationTypes.JavaScriptNumber), Export]
        internal static ClassificationTypeDefinition JavaScriptNumberClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptNumber)]
        [Name("JavaScriptNumberFormatDefinition")]
        [Order]
        internal sealed class JavaScriptNumberClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptNumberClassificationFormat()
            {
                this.DisplayName     = "JavaScript Number";
                this.ForegroundColor = Color.FromRgb(43, 145, 175);
            }
        }
        #endregion

        #region JavaScript String
        [Name(FusionClassificationTypes.JavaScriptString), Export]
        internal static ClassificationTypeDefinition JavaScriptStringClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptString)]
        [Name("JavaScriptStringFormatDefinition")]
        [Order]
        internal sealed class JavaScriptStringClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptStringClassificationFormat()
            {
                this.DisplayName     = "JavaScript String";
                this.ForegroundColor = Color.FromRgb(163, 21, 21);
            }
        }
        #endregion

        #region JavaScript RegExp
        [Name(FusionClassificationTypes.JavaScriptRegExp), Export]
        internal static ClassificationTypeDefinition JavaScriptRegExpClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptRegExp)]
        [Name("RegExpFormatDefinition")]
        [Order]
        internal sealed class RegExpClassificationFormat : ClassificationFormatDefinition
        {
            internal RegExpClassificationFormat()
            {
                this.DisplayName     = "JavaScript Regular Expression";
                this.ForegroundColor = Colors.Maroon;
            }
        }
        #endregion

        #region JavaScript Comment
        [Name(FusionClassificationTypes.JavaScriptComment), Export]
        internal static ClassificationTypeDefinition JavaScriptCommentClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptComment)]
        [Name("JavaScriptCommentFormatDefinition")]
        [Order]
        internal sealed class JavaScriptCommentClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptCommentClassificationFormat()
            {
                this.DisplayName     = "JavaScript Comment";
                this.ForegroundColor = Colors.Green;
            }
        }
        #endregion

        #region JavaScript Text
        [Name(FusionClassificationTypes.JavaScriptText), Export]
        internal static ClassificationTypeDefinition JavaScriptTextClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptText)]
        [Name("JavaScriptTextFormatDefinition")]
        [Order]
        internal sealed class JavaScriptTextClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptTextClassificationFormat()
            {
                this.DisplayName     = "JavaScript Text";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region JavaScript Whitespace
        [Name(FusionClassificationTypes.JavaScriptWhitespace), Export]
        internal static ClassificationTypeDefinition JavaScriptWhitespaceClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.JavaScriptWhitespace)]
        [Name("JavaScriptWhitespaceFormatDefinition")]
        [Order]
        internal sealed class JavaScriptWhitespaceClassificationFormat : ClassificationFormatDefinition
        {
            internal JavaScriptWhitespaceClassificationFormat()
            {
                this.DisplayName     = "JavaScript Whitespace";
                this.ForegroundColor = Colors.Transparent;
            }
        }
        #endregion

        #region HTML Text
        [Name(FusionClassificationTypes.HTMLText), Export]
        internal static ClassificationTypeDefinition HTMLTextClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLText)]
        [Name("HTMLTextFormatDefinition")]
        [Order]
        internal sealed class HTMLTextClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLTextClassificationFormat()
            {
                this.DisplayName     = "HTML Text";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region HTML Tag Open/Close
        [Name(FusionClassificationTypes.HTMLTagOpenClose), Export]
        internal static ClassificationTypeDefinition HTMLTagOpenCloseClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLTagOpenClose)]
        [Name("HTMLTagOpenCloseFormatDefinition")]
        [Order]
        internal sealed class HTMLTagOpenCloseClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLTagOpenCloseClassificationFormat()
            {
                this.DisplayName     = "HTML Tag Open/Close";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region HTML Tag Name
        [Name(FusionClassificationTypes.HTMLTagName), Export]
        internal static ClassificationTypeDefinition HTMLTagNameClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLTagName)]
        [Name("HTMLTagNameFormatDefinition")]
        [Order]
        internal sealed class HTMLTagNameClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLTagNameClassificationFormat()
            {
                this.DisplayName     = "HTML Tag Name";
                this.ForegroundColor = Colors.Maroon;
            }
        }
        #endregion

        #region HTML Tag Text
        [Name(FusionClassificationTypes.HTMLTagText), Export]
        internal static ClassificationTypeDefinition HTMLTagTextClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLTagText)]
        [Name("HTMLTagTextFormatDefinition")]
        [Order]
        internal sealed class HTMLTagTextClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLTagTextClassificationFormat()
            {
                this.DisplayName     = "HTML Tag Text";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region HTML Tag Whitespace
        [Name(FusionClassificationTypes.HTMLTagWhitespace), Export]
        internal static ClassificationTypeDefinition HTMLTagWhitespaceClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLTagWhitespace)]
        [Name("HTMLTagWhitespaceFormatDefinition")]
        [Order]
        internal sealed class HTMLTagWhitespaceClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLTagWhitespaceClassificationFormat()
            {
                this.DisplayName     = "HTML Tag Whitespace";
                this.ForegroundColor = Colors.Transparent;
            }
        }
        #endregion

        #region HTML Character Reference
        [Name(FusionClassificationTypes.HTMLCharacterReference), Export]
        internal static ClassificationTypeDefinition HTMLCharacterReferenceClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLCharacterReference)]
        [Name("HTMLCharacterReferenceFormatDefinition")]
        [Order]
        internal sealed class HTMLCharacterReferenceClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLCharacterReferenceClassificationFormat()
            {
                this.DisplayName     = "HTML Character Reference";
                this.ForegroundColor = Colors.Red;
            }
        }
        #endregion

        #region HTML Attribute Name
        [Name(FusionClassificationTypes.HTMLAttributeName), Export]
        internal static ClassificationTypeDefinition HTMLAttributeNameClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLAttributeName)]
        [Name("HTMLAttributeNameFormatDefinition")]
        [Order]
        internal sealed class HTMLAttributeNameClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLAttributeNameClassificationFormat()
            {
                this.DisplayName     = "HTML Attribute Name";
                this.ForegroundColor = Colors.Red;
            }
        }
        #endregion

        #region HTML Attribute Value
        [Name(FusionClassificationTypes.HTMLAttributeValue), Export]
        internal static ClassificationTypeDefinition HTMLAttributeValueClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLAttributeValue)]
        [Name("HTMLAttributeValueFormatDefinition")]
        [Order]
        internal sealed class HTMLAttributeValueClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLAttributeValueClassificationFormat()
            {
                this.DisplayName     = "HTML Attribute Value";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region HTML Comment
        [Name(FusionClassificationTypes.HTMLComment), Export]
        internal static ClassificationTypeDefinition HTMLCommentClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLComment)]
        [Name("HTMLCommentFormatDefinition")]
        [Order]
        internal sealed class HTMLCommentClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLCommentClassificationFormat()
            {
                this.DisplayName     = "HTML Comment";
                this.ForegroundColor = Colors.DarkGreen;
            }
        }
        #endregion

        #region HTML Bogus Comment
        [Name(FusionClassificationTypes.HTMLBogusComment), Export]
        internal static ClassificationTypeDefinition HTMLBogusCommentClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLBogusComment)]
        [Name("HTMLBogusCommentFormatDefinition")]
        [Order]
        internal sealed class HTMLBogusCommentClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLBogusCommentClassificationFormat()
            {
                this.DisplayName     = "HTML Bogus Comment";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region HTML DOCTYPE
        [Name(FusionClassificationTypes.HTMLDOCTYPE), Export]
        internal static ClassificationTypeDefinition HTMLDOCTYPEClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLDOCTYPE)]
        [Name("HTMLDOCTYPEFormatDefinition")]
        [Order]
        internal sealed class HTMLDOCTYPEClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLDOCTYPEClassificationFormat()
            {
                this.DisplayName     = "HTML DOCTYPE";
                this.ForegroundColor = Colors.Maroon;
            }
        }
        #endregion

        #region HTML CDATA
        [Name(FusionClassificationTypes.HTMLCDATA), Export]
        internal static ClassificationTypeDefinition HTMLCDATAClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.HTMLCDATA)]
        [Name("HTMLCDATAFormatDefinition")]
        [Order]
        internal sealed class HTMLCDATAClassificationFormat : ClassificationFormatDefinition
        {
            internal HTMLCDATAClassificationFormat()
            {
                this.DisplayName     = "HTML CDATA";
                this.ForegroundColor = Colors.Gray;
            }
        }
        #endregion

        #region CSS Selector
        [Name(FusionClassificationTypes.CSSSelector), Export]
        internal static ClassificationTypeDefinition CSSSelectorClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSSelector)]
        [Name("CSSSelectorFormatDefinition")]
        [Order]
        internal sealed class CSSSelectorClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSSelectorClassificationFormat()
            {
                this.DisplayName     = "CSS Selector";
                this.ForegroundColor = Colors.Maroon;
            }
        }
        #endregion

        #region CSS At-Rule
        [Name(FusionClassificationTypes.CSSAtRule), Export]
        internal static ClassificationTypeDefinition CSSAtRuleClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSAtRule)]
        [Name("CSSAtRuleFormatDefinition")]
        [Order]
        internal sealed class CSSAtRuleClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSAtRuleClassificationFormat()
            {
                this.DisplayName     = "CSS At-Rule";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region CSS Declaration Name
        [Name(FusionClassificationTypes.CSSDeclarationName), Export]
        internal static ClassificationTypeDefinition CSSDeclarationNameClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSDeclarationName)]
        [Name("CSSDeclarationNameFormatDefinition")]
        [Order]
        internal sealed class CSSDeclarationNameClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSDeclarationNameClassificationFormat()
            {
                this.DisplayName     = "CSS Declaration Name";
                this.ForegroundColor = Colors.Red;
            }
        }
        #endregion

        #region CSS Declaration Value
        [Name(FusionClassificationTypes.CSSDeclarationValue), Export]
        internal static ClassificationTypeDefinition CSSDeclarationValueClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSDeclarationValue)]
        [Name("CSSDeclarationValueFormatDefinition")]
        [Order]
        internal sealed class CSSDeclarationValueClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSDeclarationValueClassificationFormat()
            {
                this.DisplayName     = "CSS Declaration Value";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region CSS Declaration Important
        [Name(FusionClassificationTypes.CSSDeclarationImportant), Export]
        internal static ClassificationTypeDefinition CSSDeclarationImportantClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSDeclarationImportant)]
        [Name("CSSDeclarationImportantFormatDefinition")]
        [Order]
        internal sealed class CSSDeclarationImportantClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSDeclarationImportantClassificationFormat()
            {
                this.DisplayName     = "CSS Declaration Important";
                this.ForegroundColor = Color.FromRgb(163, 21, 21);
            }
        }
        #endregion

        #region CSS Comment
        [Name(FusionClassificationTypes.CSSComment), Export]
        internal static ClassificationTypeDefinition CSSCommentClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSComment)]
        [Name("CSSCommentFormatDefinition")]
        [Order]
        internal sealed class CSSCommentClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSCommentClassificationFormat()
            {
                this.DisplayName     = "CSS Comment";
                this.ForegroundColor = Colors.DarkGreen;
            }
        }
        #endregion

        #region CSS Text
        [Name(FusionClassificationTypes.CSSText), Export]
        internal static ClassificationTypeDefinition CSSTextClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSText)]
        [Name("CSSTextFormatDefinition")]
        [Order]
        internal sealed class CSSTextClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSTextClassificationFormat()
            {
                this.DisplayName     = "CSS Text";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region CSS Whitespace
        [Name(FusionClassificationTypes.CSSWhitespace), Export]
        internal static ClassificationTypeDefinition CSSWhitespaceClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.CSSWhitespace)]
        [Name("CSSWhitespaceFormatDefinition")]
        [Order]
        internal sealed class CSSWhitespaceClassificationFormat : ClassificationFormatDefinition
        {
            internal CSSWhitespaceClassificationFormat()
            {
                this.DisplayName     = "CSS Whitespace";
                this.ForegroundColor = Colors.Transparent;
            }
        }
        #endregion

        #region Fusion Tag Open/Close
        [Name(FusionClassificationTypes.FusionTagOpenClose), Export]
        internal static ClassificationTypeDefinition FusionTagOpenCloseClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.FusionTagOpenClose)]
        [Name("FusionTagOpenCloseFormatDefinition")]
        [Order]
        internal sealed class FusionTagOpenCloseClassificationFormat : ClassificationFormatDefinition
        {
            internal FusionTagOpenCloseClassificationFormat()
            {
                this.BackgroundColor = Color.FromRgb(251, 251, 48);
                this.DisplayName     = "Fusion Tag Open/Close";
            }
        }
        #endregion

        #region Fusion Attribute String
        [Name(FusionClassificationTypes.FusionAttributeString), Export]
        internal static ClassificationTypeDefinition FusionAttributeStringClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.FusionAttributeString)]
        [Name("FusionAttributeStringFormatDefinition")]
        [Order]
        internal sealed class FusionAttributeStringClassificationFormat : ClassificationFormatDefinition
        {
            internal FusionAttributeStringClassificationFormat()
            {
                this.DisplayName     = "Fusion Attribute String";
                this.ForegroundColor = Colors.Blue;
            }
        }
        #endregion

        #region Fusion Substitution
        [Name(FusionClassificationTypes.FusionSubstitution), Export]
        internal static ClassificationTypeDefinition FusionSubstitutionClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.FusionSubstitution)]
        [Name("FusionSubstitutionFormatDefinition")]
        [Order]
        internal sealed class FusionSubstitutionClassificationFormat : ClassificationFormatDefinition
        {
            internal FusionSubstitutionClassificationFormat()
            {
                this.BackgroundColor = Color.FromRgb(251, 251, 48);
                this.DisplayName     = "Fusion Substitution";
            }
        }
        #endregion

        #region Fusion Text
        [Name(FusionClassificationTypes.FusionText), Export]
        internal static ClassificationTypeDefinition FusionTextClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.FusionText)]
        [Name("FusionTextFormatDefinition")]
        [Order]
        internal sealed class FusionTextClassificationFormat : ClassificationFormatDefinition
        {
            internal FusionTextClassificationFormat()
            {
                this.DisplayName     = "Fusion Text";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion

        #region Unknown
        [Name(FusionClassificationTypes.Unknown), Export]
        internal static ClassificationTypeDefinition UnknownClassificationType { get; set; }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = FusionClassificationTypes.Unknown)]
        [Name("UnknownFormatDefinition")]
        [Order]
        internal sealed class UnknownClassificationFormat : ClassificationFormatDefinition
        {
            internal UnknownClassificationFormat()
            {
                this.DisplayName     = "Unknown";
                this.ForegroundColor = Colors.Black;
            }
        }
        #endregion
        #endregion
    }

    #region Providers
    [Export(typeof(IClassifierProvider))]
    [ContentType("fjs")]
    internal class FusionJavaScriptClassifierProvider : IClassifierProvider
    {
        [Import]
        internal IClassificationTypeRegistryService ClassificationRegistry = null;// Set via MEF

        public IClassifier GetClassifier(ITextBuffer buffer)
        {
            // Return a reference to the custom classification type layer
            return buffer.Properties.GetOrCreateSingletonProperty(() => new FusionClassifier(this.ClassificationRegistry, "fjs"));
        }
    }

    [Export(typeof(IClassifierProvider))]
    [ContentType("fhtml")]
    internal class FusionHTMLClassifierProvider : IClassifierProvider
    {
        [Import]
        internal IClassificationTypeRegistryService ClassificationRegistry = null;// Set via MEF

        public IClassifier GetClassifier(ITextBuffer buffer)
        {
            // Return a reference to the custom classification type layer
            return buffer.Properties.GetOrCreateSingletonProperty(() => new FusionClassifier(this.ClassificationRegistry, "fhtml"));
        }
    }

    [Export(typeof(IClassifierProvider))]
    [ContentType("fcss")]
    internal class FusionCSSClassifierProvider : IClassifierProvider
    {
        [Import]
        internal IClassificationTypeRegistryService ClassificationRegistry = null;// Set via MEF

        public IClassifier GetClassifier(ITextBuffer buffer)
        {
            // Return a reference to the custom classification type layer
            return buffer.Properties.GetOrCreateSingletonProperty(() => new FusionClassifier(this.ClassificationRegistry, "fcss"));
        }
    }
    #endregion
}