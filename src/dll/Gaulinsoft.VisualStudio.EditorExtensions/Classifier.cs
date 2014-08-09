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
        where THighlighter : class, IHighlighter<THighlighter, TToken>, new()
        where TToken       : class, IToken
    {
        public const int THRESHOLD = 150;

        public Classifier(IClassificationTypeRegistryService registry, string language = null)
        {
            // If the registry is null, throw an exception
            if (registry == null)
                throw new ArgumentNullException("registry");

            // Create the cache and snapshots collection
            this._cache     = new Dictionary<string, IClassificationType>();
            this._language  = language;
            this._registry  = registry;
            this._snapshots = new List<THighlighter>();
        }

        protected IDictionary<string, IClassificationType> _cache     = null;
        protected string                                   _language  = null;
        protected IClassificationTypeRegistryService       _registry  = null;
        protected IList<THighlighter>                      _snapshots = null;
        protected string                                   _source    = null;

        protected abstract IClassificationType GetClassificationType(TToken token);

        public IList<ClassificationSpan> GetClassificationSpans(SnapshotSpan span)
        {
            // Create the classifications list
            var classifications = new List<ClassificationSpan>();

            // If the span is empty, return the empty classifications list
            if (span.IsEmpty)
                return classifications;
            
            IHighlighter<THighlighter, TToken> highlighter = null;

            // Get the starting and ending line numbers
            int startLine = span.Snapshot.GetLineNumberFromPosition(span.Start.Position);
            int endLine   = span.Snapshot.GetLineNumberFromPosition(span.End.Position);
            
            // Define the snapshot index and starting position
            int index = 0;
            int start = 0;

            for (int i = this._snapshots.Count - 1; i >= 0; i--)
            {
                // Get the current snapshot and its line number of the current snapshot
                var snapshot = this._snapshots[i];
                int line     = snapshot.TrackingLineNumber;

                // If the snapshot comes after the start of the span, skip it
                if (line > startLine)
                    continue;

                // Set the snapshot index and starting position
                index = i + 1;
                start = span.Snapshot.GetLineFromLineNumber(line).Start.Position;

                // Adjust the starting line number and create a copy of the highlighter for the snapshot
                startLine   = line;
                highlighter = snapshot.Clone();

                // Reset the position and source of the highlighter
                highlighter.Position = 0;
                highlighter.Source   = span.Snapshot.GetText(start, span.Snapshot.Length - start);

                break;
            }

            while (index < this._snapshots.Count)
            {
                // Get the tracking point of the current snapshot and calculate the adjusted position
                var point    = this._snapshots[index].TrackingPoint;
                int adjusted = point.GetPosition(span.Snapshot);

                // If the adjusted position succeeds the span, break
                if (adjusted >= span.End.Position)
                    break;

                // Remove the snapshot from the snapshot collection
                this._snapshots.RemoveAt(index);
            }

            // Get the snapshot source code and check if it's changed
            string source  = span.Snapshot.GetText();
            bool   changed = this._source != source;

            // If no snapshot highlighter was copied, create the highlighter for the entire span snapshot
            if (highlighter == null)
                highlighter = new THighlighter
                {
                    Language = this._language,
                    Source   = source
                };

            // Get the first token and create the snapshot position
            var token    = highlighter.Next();
            int position = start;

            // Calculate the current ending position
            int end = index < this._snapshots.Count ?
                      this._snapshots[index].TrackingPoint.GetPosition(span.Snapshot) :
                      span.Snapshot.Length;

            while (token != null)
            {
                // Calculate the token starting position and length
                int tokenStart  = token.Start + start;
                int tokenLength = token.End - token.Start;
                int tokenEnd    = tokenStart + tokenLength;

                // If the token end is within the start of the span
                if (tokenEnd >= span.Start.Position)
                {
                    // If the token start is within the end of the span, create a classification for the token and add it to the classifications list
                    if (tokenStart <= span.End.Position)
                        classifications.Add(new ClassificationSpan(new SnapshotSpan(span.Snapshot, tokenStart, tokenLength), this.GetClassificationType(token)));

                    // If the token end succeeds the span
                    if (tokenEnd >= span.End.Position)
                    {
                        // If there's an ending position
                        if (end < span.Snapshot.Length)
                        {
                            // Get the first break position of the token
                            int breakPosition = token.GetBreakPosition();

                            // If the token has a break position, it's equal to the ending position, and the highlighter states are equal, break
                            if (breakPosition >= 0 && tokenStart + breakPosition == end && highlighter.Equals(this._snapshots[index]))
                                break;

                            // If the token end succeeds the current ending position
                            if (tokenEnd > end)
                            {
                                // Remove the current and succeeding snapshots
                                this._snapshots = this._snapshots.Take(index).ToList();

                                // Set the ending position
                                end = span.Snapshot.Length;

                                break;
                            }
                        }
                        else
                            break;
                    }
                }

                // If the snapshot threshold has been exceeded
                if (tokenStart - position > THRESHOLD)
                {
                    // Get the first break position of the token
                    int breakPosition = token.GetBreakPosition();

                    // If the token has a break position
                    if (breakPosition >= 0)
                    {
                        // Create a copy of the highlighter
                        var snapshot = highlighter.Clone();

                        // Insert the snapshot into the snapshots collection
                        this._snapshots.Insert(index++, snapshot);

                        // Calculate the snapshot position
                        position = tokenStart + breakPosition;

                        // Create the snapshot tracking line number and point
                        snapshot.TrackingLineNumber = span.Snapshot.GetLineNumberFromPosition(position + 1);
                        snapshot.TrackingPoint      = span.Snapshot.CreateTrackingPoint(position, PointTrackingMode.Negative);
                    }
                }
                
                // Get the next token
                token = highlighter.Next();
            }

            // If the source code wasn't changed, return the classifications list
            if (!changed)
                return classifications;

            // If the highlighter stopped at a snapshot
            if (end < span.Snapshot.Length)
            {
                // Calculate the ending line number
                endLine = span.Snapshot.GetLineNumberFromPosition(end + 1);

                // Calculate the line offset
                int offset = endLine - this._snapshots[index].TrackingLineNumber;

                // If there's a line offset, apply it to any snapshots that succeed the ending line
                if (offset != 0)
                    for (int i = index, j = this._snapshots.Count; i < j; i++)
                        this._snapshots[i].TrackingLineNumber += offset;

                // If the ending position succeeds the end of the span, refresh any text between them
                if (end > span.End.Position)
                    this.ClassificationChanged(this, new ClassificationChangedEventArgs(new SnapshotSpan(span.Snapshot, span.End.Position, end - span.End.Position)));
            }
            // Refresh any text in the span snapshot that comes after the span
            else
                this.ClassificationChanged(this, new ClassificationChangedEventArgs(new SnapshotSpan(span.Snapshot, span.End.Position, span.Snapshot.Length - span.End.Position)));

            // Set the previous source code
            this._source = source;
            
            return classifications;
        }

        #pragma warning disable 67
        public event EventHandler<ClassificationChangedEventArgs> ClassificationChanged;
        #pragma warning restore 67
    }
}