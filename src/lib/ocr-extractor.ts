"use client";

import { createWorker } from 'tesseract.js';

type TesseractWorker = Awaited<ReturnType<typeof createWorker>>;

/**
 * Progress status for OCR operations.
 */
export type OcrProgress = {
  status: string;
  progress: number;
};

/**
 * Extracts text from an image using Tesseract.js.
 */
export async function extractTextFromImage(file: File, onProgress?: (p: OcrProgress) => void): Promise<string> {
  let worker: TesseractWorker | undefined;
  try {
    worker = await createWorker('eng', 1, {
      logger: m => {
        if (onProgress) {
          onProgress({
            status: m.status,
            progress: m.progress,
          });
        }
      }
    });

    const ret = await worker.recognize(file);
    return ret.data.text;
  } catch (error) {
    console.error('Error extracting text from image with OCR:', error);
    throw new Error('Failed to extract text from image using OCR.');
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

/**
 * Extracts text from a PDF by rendering pages to images and running OCR.
 */
export async function extractTextFromPdfWithOcr(file: File, onProgress?: (p: OcrProgress) => void): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF OCR extraction can only run in the browser.');
  }

  let worker: TesseractWorker | undefined;
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    worker = await createWorker('eng', 1);

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      if (onProgress) {
        onProgress({ status: `Processing page ${i} of ${pageCount}`, progress: (i - 1) / pageCount });
      }

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not create canvas context');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;
      
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not convert canvas to blob');

      const ret = await worker.recognize(blob);

      if (i > 1) {
        fullText += `\n\n--- Page ${i} ---\n\n`;
      }
      fullText += ret.data.text;
    }
    
    if (onProgress) {
      onProgress({ status: 'Completed', progress: 1 });
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF with OCR:', error);
    throw new Error('Failed to extract text from PDF using OCR.');
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}
