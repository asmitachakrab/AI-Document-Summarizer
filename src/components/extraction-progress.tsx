"use client";

import React from 'react';
import { Loader2, XCircle, FileSearch, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExtractionProgressProps {
  stage: 'parsing' | 'ocr' | 'idle';
  progress: number;
  fileName: string;
  onCancel?: () => void;
}

export function ExtractionProgress({ stage, progress, fileName, onCancel }: ExtractionProgressProps) {
  if (stage === 'idle') return null;

  const isOcr = stage === 'ocr';
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-violet-400">
            {isOcr ? <ScanLine className="h-5 w-5" /> : <FileSearch className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base">
              {isOcr ? 'Recognizing text (OCR)' : 'Reading document'}
              <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
            </h3>
            <p className="mt-0.5 truncate text-sm text-slate-500" title={fileName}>
              {fileName}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Cancel processing"
            title="Cancel"
          >
            <XCircle className="h-6 w-6" />
          </button>
        )}
      </div>

      <p className="mb-2 text-xs text-slate-400">
        {isOcr
          ? 'Scanned pages are processed locally in your browser — this can take a moment.'
          : 'Extracting the text layer from your PDF.'}
      </p>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            'absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-300',
            isOcr && 'animate-pulse'
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-400">
          {isOcr ? 'Optical character recognition' : 'PDF parsing'}
        </span>
        <span className="font-semibold text-violet-700">{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}
