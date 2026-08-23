"use client";

/**
 * Result of PDF text extraction.
 */
export type PdfExtractionResult = {
  text: string;
  pageCount: number;
  hasText: boolean;
};

/**
 * Extracts text from a PDF file using pdfjs-dist.
 */
export async function extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction can only run in the browser.');
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Reconstruct line structure: pdf.js marks items that end a line with
      // `hasEOL`, which preserves paragraphs for better summaries/previews.
      let pageText = '';
      for (const item of textContent.items) {
        if (!('str' in item)) continue;
        pageText += item.str;
        pageText += item.hasEOL ? '\n' : ' ';
      }

      if (i > 1) {
        fullText += `\n\n--- Page ${i} ---\n\n`;
      }
      fullText += pageText.trim();
    }

    const trimmedText = fullText.trim();
    const hasText = trimmedText.length > 50;

    return {
      text: trimmedText,
      pageCount,
      hasText,
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file.');
  }
}
