# 📄 SummifyAI — AI Document Summary Assistant

An AI-powered web application that accepts documents (**PDFs** and **Images**), extracts text with high fidelity (using native PDF parsing or client-side OCR via Tesseract.js), and generates intelligent, structured summaries with customizable lengths, key takeaways, and document improvement recommendations.

---

## 🚀 Live Demo & Repository
- **Repository**: [GitHub](https://github.com/asmitachakrab/AI-Document-Summarizer)
- **Deployment**: Ready for instant 1-click deployment on **Vercel** or **Netlify**.

---

## 💡 Brief Approach Write-Up (175 words)

> **Architectural Philosophy:**
> To deliver a high-performance, cost-effective, and privacy-first solution, document processing is divided into two distinct tiers: **Client-Side Extraction** and **Server-Side AI Synthesis**.
>
> 1. **Client-Side Ingestion & OCR:** PDFs are parsed directly in the browser via `pdfjs-dist` to preserve formatting and eliminate server upload overhead. If a scanned PDF or image (PNG, JPG, TIFF, WEBP) is detected, `Tesseract.js` Web Workers execute client-side OCR without taxing server compute or running into serverless execution limits.
> 2. **Structured AI Summarization:** Extracted text is processed via a Next.js API route backed by **Google Gemini 3.6 Flash** using schema-constrained JSON output containing the executive summary (tailored to Short, Medium, or Long presets), high-priority key points, and actionable document improvement suggestions.
> 3. **Resilient UX:** The interface offers drag-and-drop uploads, real-time stage progress indicators, raw text inspection, single-click clipboard copying, and a built-in demo fallback mode for immediate evaluation without requiring API credentials.

---

## ✨ Features

- 📂 **Multi-Format Document Upload**: Drag-and-drop or file picker supporting PDF, PNG, JPG, JPEG, WEBP, and TIFF (up to 20MB).
- ⚡ **Dual-Engine Text Extraction**:
  - **Native PDF Parsing**: High-speed text extraction preserving document structure via `pdfjs-dist`.
  - **Client-Side OCR**: Robust text recognition for scanned images and flat PDFs using `Tesseract.js`.
- 🧠 **AI Summary Generation**:
  - Powered by **Google Gemini 3.6 Flash** (generous free tier & 1M token context window).
  - **Configurable Lengths**: *Short* (2-3 sentences), *Medium* (1 paragraph), and *Long* (multi-paragraph detailed).
  - **Key Points Extraction**: Instant bulleted takeaways highlighting core messages.
  - **Improvement Suggestions**: Actionable recommendations on clarity, structure, and formatting.
- 🎨 **Modern & Responsive UI**: Clean, mobile-friendly interface built with Tailwind CSS, Lucide icons, step indicators, and loading states.
- 🛡️ **Zero-Config Demo Mode**: Includes a frequency-scored extractive fallback summarizer so the app functions immediately out-of-the-box even before adding an API key (clearly labeled in the UI).

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, React 19, TypeScript) |
| **Styling** | Tailwind CSS v4 + Lucide React Icons |
| **PDF Extraction** | `pdfjs-dist` (Client-side Web Worker) |
| **OCR Engine** | `Tesseract.js` (Client-side Web Worker) |
| **AI Summarization** | Google Gemini API (`gemini-3.6-flash`) |
| **Deployment** | Vercel / Netlify (Serverless & Edge Ready) |

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ installed on your machine
- (Optional) A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone and Install
```bash
git clone https://github.com/asmitachakrab/AI-Document-Summarizer.git
cd AI-Document-Summarizer
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Note: If no API key is provided, the application seamlessly runs in Demo Mode for evaluation.)*

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing

To verify the production build and type safety:
```bash
# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## 🌐 Deployment Guide (Vercel)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the `GEMINI_API_KEY` in your Vercel Project Settings under **Environment Variables**.
4. Click **Deploy**. Vercel will automatically build and publish the application.

---

## 📄 License
MIT License. Created as part of the Technical Assessment for the Software Engineering Position.
