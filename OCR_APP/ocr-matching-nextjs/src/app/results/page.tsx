'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResultContext } from '@/context/JobContext';
import MatchTable from '@/components/results/MatchTable';
import { getStatus } from '@/utils/format';

const ResultsPage = () => {
  const router = useRouter();
  const { currentResult, clearResult } = useResultContext();

  useEffect(() => {
    // If no result data, redirect to upload
    if (!currentResult) {
      router.push('/upload');
    }
    // Print the full response to browser DevTools for debugging
    if (currentResult) {
      // Use console.log so it's easy to filter; stringify to avoid circular refs
      try {
        console.log('extractPdf response (currentResult):', JSON.parse(JSON.stringify(currentResult)));
      } catch (e) {
        console.log('extractPdf response (currentResult):', currentResult);
      }
    }
  }, [currentResult, router]);

  if (!currentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-4">Please upload documents to see results.</p>
          <button 
            onClick={() => router.push('/upload')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const formatComparisonForTable = (extractedData: any, comparison: any, imageFiles: string[]) => {
    const results: Array<{
      field: string;
      extractedText: string;
      originalText: string;
      matchPercentage: number;
      status: 'match' | 'partial' | 'mismatch';
      phieuchuyenImage?: string;
      hopdongImage?: string;
    }> = [];

    // Helper function to find corresponding image for a field
    const findImageForField = (fieldName: string, docType: 'phieuchuyen' | 'hopdong') => {
      return imageFiles.find(img => {
        const imgName = img.toLowerCase();
        // Handle special cases for nguoi_mua fields
        if (fieldName === 'ho_ten') {
          return imgName.includes(`${docType}_nguoi_mua_0_ho_ten`);
        }
        if (fieldName === 'cccd') {
          return imgName.includes(`${docType}_nguoi_mua_0_cccd`);
        }
        // For other fields, direct match
        return imgName.includes(`${docType}_${fieldName}`);
      });
    };
    
    // Map the comparison data to the table format - use comparison data directly
    Object.keys(comparison).forEach(field => {
      const comparisonItem = comparison[field];
      
      results.push({
        field: field,
        extractedText: comparisonItem.phieuchuyen || '',
        originalText: comparisonItem.hopdong || '',
        matchPercentage: comparisonItem.similarity * 100,
        status: getStatus(comparisonItem.similarity * 100),
        phieuchuyenImage: findImageForField(field, 'phieuchuyen'),
        hopdongImage: findImageForField(field, 'hopdong')
      });
    });

    return results;
  };

  const tableResults = formatComparisonForTable(
    currentResult.extractedData, 
    currentResult.comparison, 
    currentResult.imageFiles
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kết quả đối chiếu</h1>
              <p className="text-sm text-gray-500">
                Đã tải lên: {new Date(currentResult.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/review')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Xem và chỉnh sửa
              </button>
              <button 
                onClick={() => {
                  clearResult();
                  router.push('/upload');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Tải lên mới
              </button>
            </div>
          </div>
          
          <MatchTable results={tableResults} />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;