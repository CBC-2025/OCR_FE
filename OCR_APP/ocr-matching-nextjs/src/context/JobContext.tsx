'use client';

import React, { createContext, useContext, useState } from 'react';
import { ExtractedData, ComparisonResult } from '../types';

interface CurrentResult {
  extractedData: ExtractedData;
  imageFiles: string[];
  comparison: ComparisonResult;
  uploadedAt: string;
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