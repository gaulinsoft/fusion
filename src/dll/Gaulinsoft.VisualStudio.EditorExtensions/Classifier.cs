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
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Classification;

namespace Gaulinsoft.VisualStudio.EditorExtensions
{
    public abstract class Classifier<THighlighter, TToken> : IClassifier
        where THighlighter : IHighlighter<THighlighter, TToken>, new()
        where TToken       : IToken
    {
        public Classifier(IClassificationTypeRegistryService registry, string language = null)
        {
            // If the registry is null, throw an exception
            if (registry == null)
                throw new ArgumentNullException("registry");

            // Create the cache and snapshots collection
            this._cache     = new Dictionary<string, IClassificationType>();
            this._language  = language;
            this._registry  = registry;
            this._snapshots = new SortedList<int, THighlighter>();
        }

        protected IDictionary<string, IClassificationType> _cache     = null;
        protected string                                   _language  = null;
        protected IClassificationTypeRegistryService       _registry  = null;
        protected SortedList<int, THighlighter>            _snapshots = null;

        protected abstract IClassificationType GetClassificationType(TToken token);

        public IList<ClassificationSpan> GetClassificationSpans(SnapshotSpan span)
        {
            // Create the classifications list
            var classifications = new List<ClassificationSpan>();

            // If the span is empty, return the empty classifications list
            if (span.IsEmpty)
                return classifications;
            
            IHighlighter<THighlighter, TToken> highlighter = null;
            
            // Define the snapshot index and starting position
            int index = -1;
            int start = 0;

            // Get the starting and ending line numbers
            int startLine = span.Snapshot.GetLineNumberFromPosition(span.Start.Position);
            int endLine   = span.Snapshot.GetLineNumberFromPosition(span.End.Position);

            for (int i = this._snapshots.Count - 1; i >= 0; i--)
            {
                // Get the line number of the current snapshot
                int line = this._snapshots.Keys[i];

                // If the snapshot comes after the start of the span, skip it
                if (line > startLine)
                    continue;

                // Cache the snapshot index and starting position
                index = i;
                start = span.Snapshot.GetLineFromLineNumber(line).Start.Position;

                // Adjust the starting line number and create a copy of the highlighter for the snapshot
                startLine   = line;
                highlighter = this._snapshots.Values[i].Clone();

                // Reset the position and source of the highlighter
                highlighter.Position = 0;
                highlighter.Source   = span.Snapshot.GetText(start, span.Snapshot.Length - start);

                break;
            }

            // If no snapshot highlighter was copied, create the highlighter for the entire span snapshot
            if (highlighter == null)
                highlighter = new THighlighter
                {
                    Language = this._language,
                    Source   = span.Snapshot.GetText()
                };

            // Get the first token and create the current snapshot position
            var token    = highlighter.Next();
            int position = start;

            while (token != null)
            {
                // Create the snapshot span
                var snapshot = new SnapshotSpan(span.Snapshot, token.Start + start, token.End - token.Start);

                // If the span intersects the snapshot span, create a classification span and add it to the classifications list
                if (span.IntersectsWith(snapshot))
                    classifications.Add(new ClassificationSpan(snapshot, this.GetClassificationType(token)));

                //if (token.Start - position > 50)
                //{
                //    index++;

                //    this._snapshots[token.End] = highlighter.Clone();

                //    if (position < span.Snapshot.Length)
                //        position = ++index < this._snapshots.Count ?
                //                   this._snapshots.Keys[index] :
                //                   token.End;
                //}

                //if (index >= 0)
                //{
                //    if (token.End > position)
                //    {
                //        if (position == start)
                //        {
                //            if (++index < this._snapshots.Count)
                //                position = this._snapshots.Keys[index];
                //        }
                //        else if (index < this._snapshots.Count)
                //        {
                //            this._snapshots.RemoveAt(index);

                //            if (index < this._snapshots.Count)
                //                position = this._snapshots.Keys[index];
                //        }
                //    }

                //    if (token.End >= span.End.Position && position < span.Snapshot.Length && token.End == position && highlighter.Equals(this._snapshots.Values[index]))
                //        break;
                //}

                // Get the next token
                token = highlighter.Next();
            }

            // If the highlighter stopped at a snapshot
            if (token != null)
            {
                //
            }
            // Refresh any text in the span snapshot that comes after the span
            else
                this.ClassificationChanged(this, new ClassificationChangedEventArgs(new SnapshotSpan(span.Snapshot, span.End.Position, span.Snapshot.Length - span.End.Position)));
            
            return classifications;
        }

        #pragma warning disable 67
        public event EventHandler<ClassificationChangedEventArgs> ClassificationChanged;
        #pragma warning restore 67
    }
}