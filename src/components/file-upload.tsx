"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/tiff'];

export function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, PNG, JPG, WEBP, or TIFF image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File exceeds the 20 MB limit.');
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const openPicker = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-violet-500" />;
    return <File className="h-8 w-8 text-slate-500" />;
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a document"
          className={cn(
            'relative flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
            isDragOver
              ? 'border-violet-500 bg-violet-50/70'
              : 'border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-100/60',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openPicker}
          onKeyDown={handleKeyDown}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
            onChange={handleFileChange}
            disabled={disabled}
          />

          <span
            className={cn(
              'mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-violet-400 shadow-lg shadow-slate-900/25 transition-transform',
              isDragOver && 'scale-110'
            )}
          >
            <Upload className="h-7 w-7" />
          </span>

          <p className="text-center text-lg font-semibold text-slate-800">
            {isDragOver ? 'Drop it here' : 'Drag & drop your document'}
          </p>
          <p className="mt-1.5 text-center text-sm text-slate-500">or</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPicker();
            }}
            disabled={disabled}
            className="mt-3 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            Browse files
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {['PDF', 'PNG', 'JPG', 'WEBP', 'TIFF'].map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500"
              >
                {fmt}
              </span>
            ))}
            <span className="text-[11px] text-slate-400">Up to 20 MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          <TriangleAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {selectedFile && !error && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center space-x-4 overflow-hidden">
            {getFileIcon(selectedFile.type)}
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-medium text-slate-800">{selectedFile.name}</span>
              <span className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Remove file"
            disabled={disabled}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
