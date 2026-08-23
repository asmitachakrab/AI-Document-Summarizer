import { NextRequest, NextResponse } from 'next/server';
import { generateSummary, type SummaryLength } from '@/lib/summarizer';

const MAX_INPUT_CHARS = 100_000;

/** Truncates at a sentence boundary so the model never sees a half-cut sentence. */
function truncateSmartly(text: string): string {
  if (text.length <= MAX_INPUT_CHARS) return text;
  const cut = text.slice(0, MAX_INPUT_CHARS);
  const lastBoundary = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('!\n'), cut.lastIndexOf('.\n'));
  const end = lastBoundary > MAX_INPUT_CHARS * 0.6 ? lastBoundary + 1 : MAX_INPUT_CHARS;
  return `${cut.slice(0, end).trimEnd()}\n\n[Note: The document was truncated to fit the model's input limit; later sections were not summarized.]`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, length } = body as { text?: unknown; length?: unknown };

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const safeLength: SummaryLength =
      length === 'short' || length === 'medium' || length === 'long' ? length : 'medium';

    const result = await generateSummary(truncateSmartly(text), safeLength);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred during summarization.';
    console.error('Error generating summary:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
