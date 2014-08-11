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
using Gaulinsoft.Web.Fusion;
using Microsoft.Ajax.Utilities;

namespace Gaulinsoft.Web.Optimization
{
    public class FusionTranspile : IBundleTransform
    {
        protected static string Attr   = null;
        protected static string Create = null;
        protected static string Find   = null;
        protected static string Html   = null;
        protected static string Query  = null;

        protected static IDictionary<string, string> _entities = new Dictionary<string, string> { {"Aacute","C1"},{"aacute","E1"},{"Acirc","C2"},{"acirc","E2"},{"acute","B4"},{"AElig","C6"},{"aelig","E6"},{"Agrave","C0"},{"agrave","E0"},{"amp","26"},{"AMP","26"},{"Aring","C5"},{"aring","E5"},{"Atilde","C3"},{"atilde","E3"},{"Auml","C4"},{"auml","E4"},{"brvbar","A6"},{"Ccedil","C7"},{"ccedil","E7"},{"cedil","B8"},{"cent","A2"},{"copy","A9"},{"COPY","A9"},{"curren","A4"},{"deg","B0"},{"divide","F7"},{"Eacute","C9"},{"eacute","E9"},{"Ecirc","CA"},{"ecirc","EA"},{"Egrave","C8"},{"egrave","E8"},{"ETH","D0"},{"eth","F0"},{"Euml","CB"},{"euml","EB"},{"frac12","BD"},{"frac14","BC"},{"frac34","BE"},{"gt","3E"},{"GT","3E"},{"Iacute","CD"},{"iacute","ED"},{"Icirc","CE"},{"icirc","EE"},{"iexcl","A1"},{"Igrave","CC"},{"igrave","EC"},{"iquest","BF"},{"Iuml","CF"},{"iuml","EF"},{"laquo","AB"},{"lt","3C"},{"LT","3C"},{"macr","AF"},{"micro","B5"},{"middot","B7"},{"nbsp","A0"},{"not","AC"},{"Ntilde","D1"},{"ntilde","F1"},{"Oacute","D3"},{"oacute","F3"},{"Ocirc","D4"},{"ocirc","F4"},{"Ograve","D2"},{"ograve","F2"},{"ordf","AA"},{"ordm","BA"},{"Oslash","D8"},{"oslash","F8"},{"Otilde","D5"},{"otilde","F5"},{"Ouml","D6"},{"ouml","F6"},{"para","B6"},{"plusmn","B1"},{"pound","A3"},{"quot","22"},{"QUOT","22"},{"raquo","BB"},{"reg","AE"},{"REG","AE"},{"sect","A7"},{"shy","AD"},{"sup1","B9"},{"sup2","B2"},{"sup3","B3"},{"szlig","DF"},{"THORN","DE"},{"thorn","FE"},{"times","D7"},{"Uacute","DA"},{"uacute","FA"},{"Ucirc","DB"},{"ucirc","FB"},{"Ugrave","D9"},{"ugrave","F9"},{"uml","A8"},{"Uuml","DC"},{"uuml","FC"},{"Yacute","DD"},{"yacute","FD"},{"yen","A5"},{"yuml","FF"} };

        public FusionTranspile(string language = null)
        {
            // Set the transpile language
            this.Language = language ?? "fjs";
        }

        public readonly string Language = null;

        public void Process(BundleContext context, BundleResponse response)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            if (response == null)
                throw new ArgumentNullException("response");

            // for now this is just a rough outline that works with Lexer tokens until a Parser is ready (and only with scripts, not styles or markup)

            if (this.Language != "js" && this.Language != "fjs")
                return;

            var    lexer = new Parser(response.Content, this.Language);
            string code  = "";
            var    tags  = new List<string>();

            Token token    = lexer.Next();
            Token previous = null;
            
            while (token != null)
            {
                if (token.Type == Token.FusionSelectorOpen || token.Type == Token.FusionSelectorSubstitutionClose)
                {
                    string selector = "";
                    bool   open     = token.Type == Token.FusionSelectorOpen;
                    bool   close    = true;

                    do
                    {
                        if (token.Type == Token.FusionSelectorSubstitutionOpen)
                        {
                            var peek = lexer.Peek();

                            if (peek != null && peek.Type == Token.JavaScriptPunctuator && peek.Text() == "}")
                            {
                                previous = lexer.Token;

                                continue;
                            }

                            selector += "\"+(";
                            close     = false;
                            previous  = lexer.Token;

                            continue;
                        }
                        else if (token.Type == Token.FusionSelectorSubstitutionClose)
                        {
                            if (previous != null && previous.Type == Token.FusionSelectorSubstitutionOpen)
                            {
                                previous = lexer.Token;

                                continue;
                            }

                            selector += ")+\"";
                            close     = true;
                            previous  = lexer.Token;

                            continue;
                        }
                        else if (!token.Type.StartsWith("CSS") && token.Type != Token.FusionSelectorOpen && token.Type != Token.FusionSelectorClose)
                            break;

                        if (Lexer.IsComment(token.Type))
                            continue;

                        string text = token.Type == "FusionSelectorOpen" ? token.Text().Substring(1) : token.Text();

                        selector += Regex.Replace(text.Replace("\\", "\\\\").Replace("\"", "\\\""), @"(\r?\n)", "\\n\\$1");
                        previous  = lexer.Token;
                        token     = lexer.Next();
                    }
                    while (token != null);

                    var exec = Regex.Match(selector, @"^\(\s*(head|html|body)\s*\)$", RegexOptions.IgnoreCase);

                    if (!exec.Success)
                    {
                        code += !open ?
                                ")+\"" :
                                selector[0] == '[' ?
                                (Query ?? "document.__query") + "(\"" :
                                (Find  ?? "document.__find")  + "(\"";
                        code += selector.Substring(open ? 1 : 0, selector.Length - (open && close ? 2 : 1));

                        if (close)
                            code += "\")";
                    }
                    else
                    {
                        string tag = exec.Groups[1].Value.ToLower();

                        code += "document." + (tag == "html" ? "documentElement" : tag);
                    }
                }
                else if (token.Type == Token.FusionObjectOpen || token.Type == Token.FusionObjectSubstitutionClose)
                {
                    bool value = token.Type != Token.FusionObjectOpen;

                    do
                    {
                        if (token.Type == Token.FusionObjectSubstitutionOpen)
                        {
                            if (previous != null && previous.Type == Token.CSSColon)
                                code += "\"";

                            var peek = lexer.Peek();

                            if (peek != null && peek.Type == Token.JavaScriptPunctuator && peek.Text() == "}")
                            {
                                previous = lexer.Token;

                                continue;
                            }

                            code    += "\"+(";
                            previous = lexer.Token;

                            continue;
                        }
                        else if (token.Type == Token.FusionObjectSubstitutionClose)
                        {
                            if (previous != null && previous.Type == Token.FusionObjectSubstitutionOpen)
                            {
                                previous = lexer.Token;

                                continue;
                            }

                            code    += ")+\"";
                            previous = lexer.Token;

                            continue;
                        }
                        else if (!token.Type.StartsWith("CSS") && token.Type != Token.FusionObjectOpen && token.Type != Token.FusionObjectClose)
                            break;

                        if (Lexer.IsComment(token.Type))
                            continue;

                        var space = Lexer.IsWhitespace(token.Type) ?
                                    token :
                                    null;

                        if (space != null)
                        {
                            token = lexer.Next();

                            if (token == null)
                            {
                                code += space.Text();

                                break;
                            }
                        }

                        if (value)
                        {
                            if (token.Type == Token.FusionObjectClose && lexer.State == "fjs")
                            {
                                if (previous == null || previous.Type != Token.CSSSemicolon)
                                    code += "\"";

                                if (space != null)
                                    code += space.Text();

                                code    += token.Text();
                                previous = lexer.Token;

                                continue;
                            }
                            else if (token.Type == Token.CSSSemicolon)
                            {
                                code += "\"";
                                value = false;

                                if (space != null)
                                    code += space.Text();

                                previous = lexer.Token;

                                continue;
                            }
                            else if (space != null)
                                code += Regex.Replace(space.Text(), @"(\r?\n)", "\\n\\$1");

                            if (token.Type == Token.FusionObjectSubstitutionOpen)
                            {
                                var peek = lexer.Peek();
                        
                                if (peek == null || peek.Type != Token.JavaScriptPunctuator || peek.Text() != "}")
                                    code += "\"+(";
                            }
                            else if (token.Type == Token.FusionObjectSubstitutionClose)
                            {
                                if (previous == null || previous.Type != Token.FusionObjectSubstitutionOpen)
                                    code += ")+\"";
                            }
                            else
                                code += token.Text().Replace("\\", "\\\\").Replace("\"", "\\\"");
                        }
                        else if (token.Type == Token.CSSIdentifier && previous != null && (previous.Type == Token.FusionObjectOpen || previous.Type == Token.CSSSemicolon))
                        {
                            if (previous.Type == Token.CSSSemicolon)
                                code += ",";

                            if (space != null)
                                code += space.Text();

                            code += "\"";
                            code += Regex.Replace(Regex.Replace(token.Text(), @"^-+", ""), @"-+([a-z])", m => m.Groups[1].Value.ToUpper(), RegexOptions.IgnoreCase);
                            code += "\"";
                        }
                        else if (token.Type == Token.CSSColon)
                        {
                            if (space != null)
                                code += space.Text();

                            code += token.Text();
                        }
                        else if (token.Type == Token.CSSSemicolon)
                        {
                            if (space != null)
                                code += space.Text();
                        }
                        else if (previous != null && previous.Type == Token.CSSColon)
                        {
                            if (space != null)
                                code += space.Text();

                            value = true;

                            if (lexer.State != "fjs")
                                code += "\"";

                            if (token.Type == Token.FusionObjectSubstitutionOpen)
                            {
                                var peek = lexer.Peek();
                        
                                if (peek == null || peek.Type != Token.JavaScriptPunctuator || peek.Text() != "}")
                                    code += "\"+(";
                            }
                            else if (token.Type == Token.FusionObjectSubstitutionClose)
                            {
                                if (previous == null || previous.Type != Token.FusionObjectSubstitutionOpen)
                                    code += ")+\"";
                            }
                            else
                                code += token.Text().Replace("\\", "\\\\").Replace("\"", "\\\"");
                        }
                        else
                        {
                            if (space != null)
                                code += space.Text();

                            code += token.Type == Token.FusionObjectOpen ? token.Text().Substring(1) : token.Text();
                        }

                        previous = lexer.Token;
                        token    = lexer.Next();
                    }
                    while (token != null);
                }

                if (token == null)
                    break;

                if (token.Type == Token.FusionProperty)
                    code += ".__" + token.Text().Substring(1);
                else if (token.Type == Token.FusionSubstitutionOpen || token.Type == Token.FusionStyleSubstitutionOpen)
                    code += "\"+(";
                else if (token.Type == Token.FusionSubstitutionClose || token.Type == Token.FusionStyleSubstitutionClose)
                    code += ")+\"";
                else if (token.Type == Token.HTMLStartTagOpen)
                {
                    if (tags.Count > 0)
                        code += token.Text();
                }
                else if (token.Type == Token.HTMLStartTagName)
                {
                    string tag = token.Text();

                    tags.Add(tag);

                    tag = tag.Replace("\\", "\\\\").Replace("\"", "\\\"");

                    code += tags.Count > 1 ?
                            tag :
                            (Create ?? "document.__create") + "(\"" + tag + "\")";
                }
                else if (tags.Count > 0)
                {
                    if (token.Type == Token.HTMLStartTagClose)
                    {
                        if (previous != null && (previous.Type == Token.HTMLAttributeName || previous.Type == Token.HTMLAttributeOperator))
                            code += "\"\")";
                        else if (previous != null && (previous.Type == Token.FusionAttributeTemplateString
                                                   || previous.Type == Token.FusionAttributeTemplateStringTail))
                            code += ")";

                        string tag = tags[tags.Count - 1];

                        if (tag == "area"
                         || tag == "base"
                         || tag == "br"
                         || tag == "col"
                         || tag == "embed"
                         || tag == "hr"
                         || tag == "img"
                         || tag == "input"
                         || tag == "keygen"
                         || tag == "link"
                         || tag == "menuitem"
                         || tag == "meta"
                         || tag == "param"
                         || tag == "source"
                         || tag == "track"
                         || tag == "wbr")
                        {
                            tags.RemoveAt(tags.Count - 1);

                            if (tags.Count > 0)
                                code += token.Text();
                        }
                        else
                            code += tags.Count > 1 ?
                                    token.Text() :
                                    "." + (Html ?? "__html") + "(\"";
                    }
                    else if (token.Type == Token.HTMLEndTagOpen)
                        code += tags.Count > 1 ?
                                token.Text() :
                                "\")";
                    else if (token.Type == Token.HTMLEndTagName)
                    {
                        string tag = token.Text();

                        if (tag != tags[tags.Count - 1])
                            throw new Exception("unmatched <" + tags[tags.Count - 1] + "> tag");

                        if (tags.Count > 1)
                            code += tag.Replace("\\", "\\\\").Replace("\"", "\\\"");
                    }
                    else if (token.Type == Token.HTMLStartTagSelfClose || token.Type == Token.HTMLEndTagClose)
                    {
                        if (token.Type == Token.HTMLStartTagSelfClose && previous != null && previous.Type == Token.HTMLAttributeName)
                            code += "\"\")";
                        else if (token.Type == Token.HTMLStartTagSelfClose && previous != null && (previous.Type == Token.FusionAttributeTemplateString
                                                                                                || previous.Type == Token.FusionAttributeTemplateStringTail))
                            code += ")";

                        tags.RemoveAt(tags.Count - 1);

                        if (tags.Count > 0)
                            code += token.Text();
                    }
                    else if (tags.Count == 1 && token.Type == Token.HTMLAttributeName)
                    {
                        if (previous != null && previous.Type == Token.HTMLAttributeName)
                            code += "\"\")";
                        else if (previous != null && (previous.Type == Token.FusionAttributeTemplateString
                                                   || previous.Type == Token.FusionAttributeTemplateStringTail))
                            code += ")";

                        code += "." + (Attr ?? "__attr") + "(\"";
                        code += token.Text().Replace("\\", "\\\\").Replace("\"", "\\\"");
                        code += "\",";
                    }
                    else if (tags.Count == 1 && (token.Type == Token.HTMLAttributeValue
                                              || token.Type == Token.HTMLAttributeDoubleQuotedValue
                                              || token.Type == Token.HTMLAttributeSingleQuotedValue))
                    {
                        string substring = token.Text();

                        if (token.Type != Token.HTMLAttributeValue)
                            substring = substring.Substring(1, substring.Length - 2);

                        code += "\"";

                        for (int i = 0, j = substring.Length; i < j;)
                        {
                            char character = substring[i];

                            if (character == '&')
                            {
                                char peek = substring[i + 1];

                                if (peek == '#')
                                {
                                    peek = substring[i + 2];

                                    if (peek == 'x' || peek == 'X')
                                    {
                                        peek = substring[i + 3];

                                        if (Helpers.IsHexadecimal(peek))
                                        {
                                            i += 3;

                                            string hex = "";

                                            do
                                            {
                                                character = substring[i];

                                                if (!Helpers.IsHexadecimal(character))
                                                    break;

                                                hex += character;
                                            }
                                            while (++i < j);

                                            if (substring[i++] != ';')
                                                i--;

                                            while (hex.Length < 4)
                                                hex = "0" + hex;

                                            code += "\\u";
                                            code += hex;

                                            continue;
                                        }
                                    }
                                    else if (peek >= '0' && peek <= '9')
                                    {
                                        i += 2;

                                        string number = "";

                                        do
                                        {
                                            character = substring[i];

                                            if (character < '0' || character > '9')
                                                break;

                                            number += character;
                                        }
                                        while (++i < j);

                                        if (substring[i++] != ';')
                                            i--;

                                        string hex = Convert.ToInt32(number).ToString("X");

                                        while (hex.Length < 4)
                                            hex = "0" + hex;

                                        code += "\\u";
                                        code += hex;

                                        continue;
                                    }
                                }
                                else if (Helpers.IsLetter(peek))
                                {
                                    i++;

                                    string reference = "&";

                                    do
                                    {
                                        character = substring[i];

                                        if (!Helpers.IsAlphanumeric(character))
                                            break;

                                        reference += character;
                                    }
                                    while (++i < j);

                                    if (substring[i++] != ';')
                                        i--;
                                    else
                                        reference += ";";
                                    
                                    string lookup = _entities[reference.Substring(1)];

                                    if (lookup != null)
                                        lookup = "\\u" + lookup.PadLeft(4, '0');

                                    code += lookup != null ?
                                            lookup :
                                            reference;

                                    continue;
                                }
                            }
                            else if (character == '"')
                            {
                                code += "\\\"";

                                i++;

                                continue;
                            }
                            else if (character == '\n')
                            {
                                code += "\\n\\\n";

                                i++;

                                continue;
                            }
                            else if (character == '\\')
                            {
                                code += "\\\\";

                                i++;

                                continue;
                            }

                            code += character;

                            i++;
                        }

                        code += "\")";
                    }
                    else if (tags.Count == 1 && token.Type == Token.HTMLStartTagSolidus)
                    {
                        if (previous != null && previous.Type == Token.HTMLAttributeName)
                            code += "\"\")";
                        else if (previous != null && (previous.Type == Token.FusionAttributeTemplateString
                                                   || previous.Type == Token.FusionAttributeTemplateStringTail))
                            code += ")";
                    }
                    else if (token.Type == Token.FusionAttributeTemplateString
                          || token.Type == Token.FusionAttributeTemplateStringHead
                          || token.Type == Token.FusionAttributeTemplateStringMiddle
                          || token.Type == Token.FusionAttributeTemplateStringTail)
                    {
                        string substring = token.Text();
                        bool   head      = substring[0] == '`';
                        bool   tail      = substring[substring.Length - 1] == '`';

                        if (head)
                            code += "\"";
                        else if (previous == null || (previous.Type != Token.FusionAttributeTemplateStringHead && previous.Type != Token.FusionAttributeTemplateStringMiddle) || previous.Source[previous.End - 1] == '`')
                            code += ")+\"";

                        code += Regex.Replace(substring.Substring(1, tail ? substring.Length - 2 : substring.Length - 3).Replace("\"", "\\\""), @"(\r?\n)", "\\n\\$1");

                        if (!tail)
                        {
                            var peek = lexer.Peek();

                            if (peek == null || peek.Type != Token.JavaScriptPunctuator || peek.Text() != "}")
                                code += "\"+(";
                        }
                        else
                            code += "\"";
                    }
                    else if (token.Type == Token.HTMLText || token.Type.StartsWith("CSS"))
                        code += Regex.Replace(token.Text().Replace("\\", "\\\\").Replace("\"", "\\\""), @"(\r?\n)", "\\n\\$1");
                    else if (token.Type == Token.HTMLStartTagWhitespace)
                    {
                        code += previous == null || previous.Type != Token.HTMLAttributeOperator ?
                                Regex.Replace(token.Text(), @"^[^\r\n]+", "") :
                                token.Text();
                    }
                    else if (tags.Count > 1 || (token.Type != Token.HTMLEndTagText
                                             && token.Type != Token.HTMLAttributeOperator))
                        code += token.Text();
                }
                else if (token.Type == Token.JavaScriptTemplateString)
                {
                    string substring = token.Text();
                    bool   head      = substring[0] == '`';
                    bool   tail      = substring[substring.Length - 1] == '`';

                    if (head && previous != null && (previous.Type == Token.JavaScriptIdentifier || previous.Type == Token.JavaScriptPunctuator && (previous.Text() == ")" || previous.Text() == "]")))
                    {
                        // TO DO: TAGGED TEMPLATE LITERALS
                    }

                    if (head)
                        code += "\"";
                    else if (previous == null || previous.Type != Token.JavaScriptTemplateString || previous.Source[previous.End - 1] == '`')
                        code += ")+\"";

                    code += Regex.Replace(substring.Substring(1, tail ? substring.Length - 2 : substring.Length - 3).Replace("\"", "\\\""), @"(\r?\n)", "\\n\\$1");
                    if (!tail)
                    {
                        var peek = lexer.Peek();

                        if (peek == null || peek.Type != Token.JavaScriptPunctuator || peek.Text() != "}")
                            code += "\"+(";
                    }
                    else
                        code += "\"";
                }
                else
                    code += token.Text();

                previous = lexer.Token;
                token    = lexer.Next();
            }

            response.Content = code;
        }
    }
}