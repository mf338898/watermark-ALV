import { useState, useCallback } from 'react';
import { applyWatermark } from '../lib/watermark';
import { createZip, downloadZip } from '../lib/zip';
import {
  WATERMARK_URL,
  DEMO_IMAGE_URL,
  defaultWatermarkOptions,
  type WatermarkOptions,
} from '../config';

export interface ProcessedFile {
  original: File;
  name: string;
  blob: Blob;
  beforeUrl: string;
  afterUrl: string;
}

export function useWatermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<WatermarkOptions>(defaultWatermarkOptions);
  const [processed, setProcessed] = useState<ProcessedFile[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [demoBlob, setDemoBlob] = useState<Blob | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const processFiles = useCallback(async (newFiles: File[], opts: WatermarkOptions) => {
    if (newFiles.length === 0) return;
    setFiles(newFiles);
    setProgress({ current: 0, total: newFiles.length });
    setProcessed([]);

    const results: ProcessedFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      setProgress({ current: i, total: newFiles.length });
      const file = newFiles[i];
      const blob = await applyWatermark(file, WATERMARK_URL, opts);
      const beforeUrl = URL.createObjectURL(file);
      const afterUrl = URL.createObjectURL(blob);
      results.push({
        original: file,
        name: file.name,
        blob,
        beforeUrl,
        afterUrl,
      });
    }
    setProcessed(results);
    setProgress(null);
  }, []);

  const loadDemo = useCallback(async (opts: WatermarkOptions) => {
    setDemoLoading(true);
    try {
      const blob = await applyWatermark(DEMO_IMAGE_URL, WATERMARK_URL, opts);
      setDemoBlob(blob);
    } catch {
      setDemoBlob(null);
    } finally {
      setDemoLoading(false);
    }
  }, []);

  const handleDownloadZip = useCallback(async () => {
    if (processed.length === 0) return;
    const zipBlob = await createZip(
      processed.map((p) => ({ name: p.name, blob: p.blob }))
    );
    downloadZip(zipBlob);
  }, [processed]);

  const clear = useCallback(() => {
    processed.forEach((p) => {
      URL.revokeObjectURL(p.beforeUrl);
      URL.revokeObjectURL(p.afterUrl);
    });
    setFiles([]);
    setProcessed([]);
    setProgress(null);
  }, [processed]);

  const isReady = processed.length > 0 && progress === null;
  const isProcessing = progress !== null;
  const estimatedSec = files.length * 1.5;

  return {
    files,
    options,
    setOptions,
    processed,
    progress,
    demoBlob,
    demoLoading,
    loadDemo,
    processFiles,
    handleDownloadZip,
    clear,
    isReady,
    isProcessing,
    estimatedSec,
  };
}
