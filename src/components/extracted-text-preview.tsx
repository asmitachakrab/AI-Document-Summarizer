"use client";

import React, { useState } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';

export interface ExtractedTextPreviewProps {
  text: string;
  wordCount: number;
}

export function ExtractedTextPreview({ text, wordCount }: ExtractedTextPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const PREVIEW_LENGTH = 500;
  const isTruncated = text.length > PREVIEW_LENGTH;
  const displayText = !isExpanded && isTruncated ? `${text.slice(0, PREVIEW_LENGTH)}...` : text;

  return (
    <div className="mx-auto w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 p-4">
        <div className="flex items-center space-x-2 text-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-violet-400">
            <Eye className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold">Extracted text preview</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {wordCount.toLocaleString()} words
        </span>
      </div>

      <div className="p-4">
        <pre className="nice-scroll max-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-700">
          {displayText}
        </pre>

        {isTruncated && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <span>{isExpanded ? 'Show less' : 'Show more'}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
