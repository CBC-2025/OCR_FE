import { ExtractedData, ComparisonResult } from '@/types';

const API_BASE_URL = 'http://localhost:8000';

export interface ExtractPdfResponse {
  extracted_data: ExtractedData;
  image_files: string[];
  comparison: ComparisonResult;
}

// API Functions
/**
 * POST file to external OCR service (/extract_pdf)
 * - Accepts browser File/Blob or a Node Buffer (when called from server).
 * - Uses a timeout/AbortController to avoid hanging requests.
 */
export const extractPdf = async (
  file: File | Blob | Buffer,
  options?: { timeoutMs?: number }
): Promise<ExtractPdfResponse> => {
  const timeoutMs = options?.timeoutMs ?? 60_000; // default 60s

  const formData = new FormData();

  // DEBUG: lightweight file metadata to help compare with Postman
  try {
    // avoid logging file content; just metadata
    // eslint-disable-next-line no-console
    console.log('extractPdf: file meta', {
      name: (file as any)?.name,
      size: (file as any)?.size,
      type: (file as any)?.type,
    });
  } catch (e) {
    /* ignore */
  }

  // Safe Buffer check (Buffer may be undefined in browser)
  const isBuffer = typeof Buffer !== 'undefined' && file instanceof (Buffer as any);

  // If running in Node and receiving a Buffer, convert to Blob via Blob constructor
  // Note: Node 18+ provides global Blob. If unavailable, callers should pass a File/Blob.
  if (isBuffer) {
    // @ts-ignore - Buffer to Blob
    const blob = new Blob([file as Buffer]);
    formData.append('file', blob, 'upload.pdf');
  } else {
    // If it's a File/Blob, provide filename to FormData so backend sees same filename as Postman
    const maybeName = (file as any)?.name ?? 'upload.bin';
    formData.append('file', file as any, maybeName);
  }
  

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}/extract_pdf`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      throw new Error(`Extract PDF failed: ${res.status} ${res.statusText} ${bodyText}`);
    }

    const json = (await res.json()) as ExtractPdfResponse;
    return json;
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      throw new Error(`Extract PDF request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};

export const getImage = async (fileName: string): Promise<Blob> => {
  // Remove 'temp_crops\' prefix if present and replace backslashes with forward slashes
  const cleanFileName = fileName.replace(/^temp_crops[\\\/]/, '').replace(/\\/g, '/');
  const controller = new AbortController();
  const timeoutMs = 30_000; // 30s
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/get_image/${encodeURIComponent(cleanFileName)}`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      throw new Error(`Get image failed: ${response.status} ${response.statusText} ${bodyText}`);
    }

    return await response.blob();
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      throw new Error(`Get image request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};

// Helper function to get image URL for display
export const getImageUrl = (fileName: string, cacheBuster?: string | number): string => {
  const cleanFileName = fileName.replace(/^temp_crops[\\\/]/, '').replace(/\\/g, '/');
  const base = `${API_BASE_URL}/get_image/${encodeURIComponent(cleanFileName)}`;
  return cacheBuster ? `${base}?t=${encodeURIComponent(String(cacheBuster))}` : base;
};