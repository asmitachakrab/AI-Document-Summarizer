"use client";

import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles, TriangleAlert, BrainCircuit } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FileUpload } from '@/components/file-upload';
import { ExtractionProgress } from '@/components/extraction-progress';
import { ExtractedTextPreview } from '@/components/extracted-text-preview';
import { SummaryDisplay } from '@/components/summary-display';
import type { SummaryLength, SummaryMode } from '@/components/summary-display';
import { StepIndicator } from '@/components/step-indicator';
import { countWords } from '@/lib/utils';

type AppState = 'idle' | 'extracting' | 'extracted' | 'summarizing' | 'done' | 'error';

type SummaryData = {
  summary: string;
  keyPoints: string[];
  improvementSuggestions: string[];
  mode?: SummaryMode;
  notice?: string;
};

export default function Page() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [extractionStage, setExtractionStage] = useState<'parsing' | 'ocr' | 'idle'>('idle');
  const [summaryResult, setSummaryResult] = useState<SummaryData | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const resetState = useCallback(() => {
    setAppState('idle');
    setSelectedFile(null);
    setExtractedText('');
    setExtractionProgress(0);
    setExtractionStage('idle');
    setSummaryResult(null);
    setSummaryLength('medium');
    setError(null);
    setIsRegenerating(false);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setAppState('extracting');
    setError(null);
    setExtractionProgress(5);

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        setExtractionStage('parsing');
        setExtractionProgress(10);

        const { extractTextFromPdf } = await import('@/lib/pdf-extractor');
        const result = await extractTextFromPdf(file);

        if (!result.hasText) {
          // Scanned PDF — fall back to OCR
          setExtractionStage('ocr');
          setExtractionProgress(15);
          const { extractTextFromPdfWithOcr } = await import('@/lib/ocr-extractor');
          text = await extractTextFromPdfWithOcr(file, (p) => {
            setExtractionProgress(15 + p.progress * 85);
          });
        } else {
          text = result.text;
          setExtractionProgress(100);
        }
      } else if (file.type.startsWith('image/')) {
        setExtractionStage('ocr');
        setExtractionProgress(10);

        const { extractTextFromImage } = await import('@/lib/ocr-extractor');
        text = await extractTextFromImage(file, (p) => {
          setExtractionProgress(10 + p.progress * 90);
        });
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or image.');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from this document. Please try a different file.');
      }

      setExtractedText(text);
      setExtractionProgress(100);
      setAppState('extracted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during extraction.';
      setError(message);
      setAppState('error');
    }
  }, []);

  const callSummarizeApi = useCallback(async (text: string, length: SummaryLength): Promise<SummaryData> => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, length }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || 'Failed to generate summary.');
    }

    return response.json();
  }, []);

  const handleGenerateSummary = useCallback(async () => {
    setAppState('summarizing');
    setError(null);

    try {
      const data = await callSummarizeApi(extractedText, summaryLength);
      setSummaryResult(data);
      setAppState('done');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during summarization.';
      setError(message);
      setAppState('error');
    }
  }, [extractedText, summaryLength, callSummarizeApi]);

  const handleRegenerate = useCallback(
    async (length: SummaryLength) => {
      if (length === summaryLength) return;
      setSummaryLength(length);
      setIsRegenerating(true);

      try {
        const data = await callSummarizeApi(extractedText, length);
        setSummaryResult(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to regenerate summary.';
        setError(message);
        setAppState('error');
      } finally {
        setIsRegenerating(false);
      }
    },
    [extractedText, summaryLength, callSummarizeApi]
  );

  const currentStep: 1 | 2 | 3 =
    appState === 'idle' || appState === 'extracting' ? 1 : appState === 'extracted' ? 2 : 3;

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6">
      <Header />
      <StepIndicator currentStep={currentStep} />

      <main className="flex flex-grow flex-col items-center justify-center py-6">
        {/* Idle — File Upload */}
        {appState === 'idle' && (
          <div className="w-full animate-fade-in">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Extracting — Progress */}
        {appState === 'extracting' && (
          <div className="w-full animate-fade-in">
            <ExtractionProgress
              stage={extractionStage}
              progress={extractionProgress}
              fileName={selectedFile?.name || ''}
              onCancel={resetState}
            />
          </div>
        )}

        {/* Extracted — Preview + Generate */}
        {appState === 'extracted' && (
          <div className="w-full animate-fade-in space-y-5">
            <ExtractedTextPreview text={extractedText} wordCount={countWords(extractedText)} />

            {/* Summary Length Selector */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Summary length</h3>
                <p className="mt-0.5 text-xs text-slate-500">Choose how detailed you want the summary</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['short', 'medium', 'long'] as SummaryLength[]).map((len) => (
                  <button
                    key={len}
                    onClick={() => setSummaryLength(len)}
                    className={`min-w-[80px] rounded-md px-4 py-2 text-sm font-medium capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                      summaryLength === len
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-300'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={resetState}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto sm:py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Start over
              </button>
              <button
                onClick={handleGenerateSummary}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white shadow-md shadow-slate-900/20 transition-all hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 sm:w-auto"
              >
                <Sparkles className="h-4 w-4 text-violet-400" />
                Generate Summary
              </button>
            </div>
          </div>
        )}

        {/* Summarizing — Loading Skeleton */}
        {appState === 'summarizing' && (
          <div className="w-full max-w-3xl animate-fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-violet-400 shadow-lg shadow-slate-900/25">
                  <BrainCircuit className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-semibold text-slate-700">Generating Summary...</h2>
                <p className="text-sm text-slate-400">Analyzing your document — this may take a few seconds.</p>
              </div>
              <div className="space-y-4">
                {['w-3/4', 'w-full', 'w-5/6', 'w-2/3'].map((width, i) => (
                  <div key={i} className={`relative h-4 overflow-hidden rounded-full bg-slate-100 ${width}`}>
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Done — Summary Results */}
        {appState === 'done' && summaryResult && (
          <div className="w-full animate-fade-in">
            <SummaryDisplay
              summary={summaryResult.summary}
              keyPoints={summaryResult.keyPoints}
              improvementSuggestions={summaryResult.improvementSuggestions}
              wordCount={countWords(summaryResult.summary)}
              onRegenerate={handleRegenerate}
              onReset={resetState}
              currentLength={summaryLength}
              isRegenerating={isRegenerating}
              mode={summaryResult.mode}
              notice={summaryResult.notice}
            />
          </div>
        )}

        {/* Error State */}
        {appState === 'error' && (
          <div className="mx-auto w-full max-w-xl animate-fade-in">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <TriangleAlert className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-red-700">Something went wrong</h2>
              <p className="mb-6 text-sm text-red-600">{error}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <button
                  onClick={resetState}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
                >
                  Start Over
                </button>
                {extractedText && (
                  <button
                    onClick={handleGenerateSummary}
                    className="w-full rounded-xl bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 sm:w-auto"
                  >
                    Retry Summary
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
