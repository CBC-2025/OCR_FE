'use client';

import React, { createContext, useContext, useState } from 'react';
import { ExtractedData, ComparisonResult } from '../types';

interface CurrentResult {
  extractedData: ExtractedData;
  imageFiles: string[];
  comparison: ComparisonResult;
  uploadedAt: string;
  // Optional client-side object URL pointing to the original uploaded file (PDF/image)
  originalFileUrl?: string;
}

interface ResultContextType {
  currentResult: CurrentResult | null;
  setCurrentResult: (result: CurrentResult) => void;
  clearResult: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentResult, setCurrentResultState] = useState<CurrentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const setCurrentResult = (result: CurrentResult) => {
    setCurrentResultState(result);
  };

  const clearResult = () => {
    // Revoke any created object URL to avoid memory leaks
    try {
      if (currentResult && currentResult.originalFileUrl && currentResult.originalFileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentResult.originalFileUrl);
      }
    } catch (e) {
      // ignore
    }
    setCurrentResultState(null);
  };

  return (
    <ResultContext.Provider value={{ 
      currentResult, 
      setCurrentResult, 
      clearResult,
      isProcessing,
      setIsProcessing
    }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
};