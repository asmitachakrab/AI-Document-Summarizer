import { ScanText } from 'lucide-react';

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center pt-10 pb-2 text-center">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-violet-400 shadow-lg shadow-slate-900/25">
          <ScanText className="h-6 w-6" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-slate-900">Summify</span>
          <span className="text-violet-600">AI</span>
        </h1>
      </div>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
        Turn PDFs and scanned images into clear, structured summaries — with key
        points and improvement suggestions.
      </p>
    </header>
  );
}
