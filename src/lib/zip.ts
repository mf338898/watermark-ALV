import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ZipFile {
  name: string;
  blob: Blob;
}

export async function createZip(files: ZipFile[]): Promise<Blob> {
  const zip = new JSZip();
  for (const { name, blob } of files) {
    zip.file(name, blob);
  }
  return zip.generateAsync({ type: 'blob' });
}

export function downloadZip(blob: Blob, filename = 'watermarked-images.zip'): void {
  saveAs(blob, filename);
}
