"use client";

import React, { useState } from 'react';
import {
  Copy,
  Check,
  ListChecks,
  Lightbulb,
  Loader2,
  Plus,
  ScrollText,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryMode = 'ai' | 'extractive';

export interface SummaryDisplayProps {
  summary: string;
  keyPoints: string[];
  improvementSuggestions: string[];
  wordCount: number;
  onRegenerate: (length: SummaryLength) => void;
  onReset: () => void;
  currentLength: SummaryLength;
  isRegenerating: boolean;
  mode?: SummaryMode;
  notice?: string;
}

export function SummaryDisplay({
  summary,
  keyPoints,
  improvementSuggestions,
  wordCount,
  onRegenerate,
  onReset,
  currentLength,
  isRegenerating,
  mode = 'ai',
  notice,
}: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const keyPointsText = keyPoints.length > 0 ? `\n\nKey points:\n${keyPoints.map((p) => `- ${p}`).join('\n')}` : '';
    navigator.clipboard.writeText(`${summary}${keyPointsText}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Mode / notice banner */}
      {mode === 'extractive' && (
        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {notice ??
              'This is a locally generated extractive summary. Add a GEMINI_API_KEY to .env.local for full AI-powered summaries.'}
          </p>
        </div>
      )}
      {mode === 'ai' && notice && (
        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Sparkles className="h-4 w-4 text-violet-600" />
          Summary length
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['short', 'medium', 'long'] as SummaryLength[]).map((length) => (
            <button
              key={length}
              onClick={() => onRegenerate(length)}
              disabled={isRegenerating}
              className={cn(
                'flex min-w-[76px] items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:min-w-[90px] sm:px-4',
                currentLength === length
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-300'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900',
                isRegenerating ? 'cursor-not-allowed opacity-50' : ''
              )}
            >
              {isRegenerating && currentLength === length && <Loader2 className="h-3 w-3 animate-spin" />}
              {length}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Summary — full width */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-violet-400">
              <ScrollText className="h-4 w-4" />
            </span>
            Executive Summary
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            title="Copy summary to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-6">
          <div
            className={cn(
              'mx-auto max-w-3xl leading-relaxed text-slate-700 transition-opacity',
              isRegenerating && 'opacity-50'
            )}
          >
            {summary.split('\n').map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="mb-4 text-[15px] last:mb-0">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-md bg-slate-100 px-2.5 py-1">{wordCount.toLocaleString()} words</span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1">~{readingTime} min read</span>
            <span
              className={cn(
                'rounded-md px-2.5 py-1',
                mode === 'ai' ? 'bg-slate-800 text-white' : 'bg-violet-100 text-violet-800'
              )}
            >
              {mode === 'ai' ? 'AI summary' : 'Extractive summary'}
            </span>
          </div>
        </div>
      </div>

      {/* Key Points + Suggestions — side by side, bounded height */}
      <div
        className={cn(
          'grid grid-cols-1 items-stretch gap-6',
          improvementSuggestions.length > 0 && 'md:grid-cols-2'
        )}
      >
        {/* Key Points */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ListChecks className="h-4 w-4" />
              </span>
              Key Points
            </h3>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              {keyPoints.length}
            </span>
          </div>
          <div className="nice-scroll flex-1 p-5 md:max-h-[380px] md:overflow-y-auto">
            <ol className={cn('space-y-3 transition-opacity', isRegenerating && 'opacity-50')}>
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-100 text-[10px] font-bold text-green-700">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Suggestions */}
        {improvementSuggestions.length > 0 && (
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 p-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Lightbulb className="h-4 w-4" />
                </span>
                Suggestions
              </h3>
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                {improvementSuggestions.length}
              </span>
            </div>
            <div className="nice-scroll flex-1 p-5 md:max-h-[380px] md:overflow-y-auto">
              <ul className={cn('space-y-3 transition-opacity', isRegenerating && 'opacity-50')}>
                {improvementSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Process New Document
        </button>
      </div>
    </div>
  );
}
