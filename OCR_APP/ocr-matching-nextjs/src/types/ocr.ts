export interface OCRResult {
  jobId: string;
  extractedText: string;
  fields: OCRField[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface OCRField {
  label: string;
  value: string;
  confidence: number; // Confidence level of the OCR result
  status: 'matched' | 'partially_matched' | 'unmatched';
}

export interface UploadResponse {
  jobId: string;
  message: string;
  status: 'success' | 'error';
}

export interface JobDetails {
  jobId: string;
  createdAt: string;
  updatedAt: string;
  results: OCRResult[];
}