"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResultContext } from '@/context/JobContext';
import MatchTable from '@/components/results/MatchTable';
import { getStatus } from '@/utils/format';
import dynamic from 'next/dynamic';

const ReactPdfViewer = dynamic(() => import('@/components/common/ReactPdfViewer'), { ssr: false });

const ResultsPage = () => {
  const router = useRouter();
  const { currentResult, clearResult } = useResultContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    // If no result data, redirect to upload
    if (!currentResult) {
      router.push('/upload');
    } else {
      // Initialize edited data with current result
      setEditedData({
        extractedData: { ...currentResult.extractedData },
        comparison: { ...currentResult.comparison }
      });
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

  // Handle field editing in edit mode
  const handleFieldEdit = (field: string, sourceType: 'phieuchuyen' | 'hopdong', newValue: string) => {
    setEditedData((prev: any) => {
      const newData = { ...prev };
      
      // Update the comparison data directly since that's what we display
      if (!newData.comparison[field]) {
        newData.comparison[field] = {};
      }
      newData.comparison[field][sourceType] = newValue;
      
      return newData;
    });
  };

  // Handle save changes
  const handleSaveChanges = () => {
    console.log('Saving edited data:', editedData);
    // alert('Thay đổi đã được lưu! (Chỉ lưu tạm trên Frontend)');
    setIsEditMode(false);
  };

  // Handle cancel changes
  const handleCancelChanges = () => {
    // if (confirm('Bạn có chắc chắn muốn hủy tất cả thay đổi?')) {
      // Reset edited data to original
      if (currentResult) {
        setEditedData({
          extractedData: { ...currentResult.extractedData },
          comparison: { ...currentResult.comparison }
        });
      }
      setIsEditMode(false);
    // }
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (!currentResult || !editedData) {
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
    editedData.extractedData, 
    editedData.comparison, 
    currentResult.imageFiles
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Chỉnh sửa kết quả đối chiếu' : 'Kết quả đối chiếu'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode ? 'Click vào các ô để chỉnh sửa. Nhấn Enter để lưu, Esc để hủy.' : `Đã tải lên: ${new Date(currentResult.uploadedAt).toLocaleString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <button 
                    onClick={handleCancelChanges}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Hủy thay đổi
                  </button>
                  <button 
                    onClick={handleSaveChanges}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Lưu thay đổi
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleToggleEditMode}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Chỉnh sửa
                  </button>
                  {/* Autofill button: send comparison data to extension via postMessage */}
                  <button
                    onClick={() => {
                      if (!editedData || !editedData.comparison) return;

                      const fields = [
                        'cccd',
                        'dia_chi_mua',
                        'dien_tich',
                        'ho_ten',
                        'loai_dat',
                        'so_thua',
                        'tai_san_gan_voi_dat',
                        'to_ban_do'
                      ];

                      const payload: Record<string, { phieuchuyen: string; hopdong: string }> = {};

                      fields.forEach(f => {
                        const item = editedData.comparison?.[f] || {};
                        payload[f] = {
                          phieuchuyen: item.phieuchuyen || '',
                          hopdong: item.hopdong || ''
                        };
                      });

                      // Send to content script via window messaging
                      try {
                        window.postMessage({ type: 'OCR_AUTOFILL', payload }, '*');
                        // small feedback to user
                        console.log('Sent OCR_AUTOFILL payload to extension', payload);
                      } catch (err) {
                        console.error('Failed to post OCR_AUTOFILL message', err);
                      }
                    }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  >
                    Tự động điền
                  </button>
                  {/* New button: View original uploaded file
                  <button
                    onClick={() => setIsViewerOpen(true)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  >
                    Xem hồ sơ
                  </button> */}
                  <button 
                    onClick={() => {
                      clearResult();
                      router.push('/upload');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Tải lên mới
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Always show table view, with editing capability based on edit mode */}
          <MatchTable 
            results={tableResults} 
            cacheBuster={currentResult.uploadedAt}
            isEditMode={isEditMode}
            onFieldEdit={handleFieldEdit}
          />
          {/* Pdf viewer modal (simple) */}
          {/* {isViewerOpen && currentResult?.originalFileUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Hồ sơ gốc</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsViewerOpen(false)}
                      className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Đóng
                    </button>
                    <a
                      href={currentResult.originalFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Mở trong tab mới
                    </a>
                  </div>
                </div>
                <div>
                  <ReactPdfViewer url={currentResult.originalFileUrl} />
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;