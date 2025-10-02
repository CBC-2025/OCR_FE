'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResultContext } from '@/context/JobContext';
import FieldEditor from '@/components/review/FieldEditor';
import DiffText from '@/components/review/DiffText';
import ImageDisplay from '@/components/common/ImageDisplay';
import { getFieldDisplayName } from '@/utils/fieldNames';

const ReviewPage = () => {
  const router = useRouter();
  const { currentResult } = useResultContext();
  const [editedData, setEditedData] = useState<any>(null);

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
  }, [currentResult, router]);

  if (!currentResult || !editedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Không có dữ liệu để xem</h2>
          <p className="text-gray-600 mb-4">Vui lòng tải lên tài liệu trước.</p>
          <button 
            onClick={() => router.push('/upload')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Đi tới Tải lên
          </button>
        </div>
      </div>
    );
  }

  const handleFieldEdit = (field: string, sourceType: 'phieuchuyen' | 'hopdong', newValue: string) => {
    setEditedData((prev: any) => {
      const newData = { ...prev };
      
      if (field === 'ho_ten') {
        // Update ho_ten in nguoi_mua[0]
        if (!newData.extractedData[sourceType].nguoi_mua) {
          newData.extractedData[sourceType].nguoi_mua = [{}];
        }
        if (!newData.extractedData[sourceType].nguoi_mua[0]) {
          newData.extractedData[sourceType].nguoi_mua[0] = {};
        }
        newData.extractedData[sourceType].nguoi_mua[0].ho_ten = newValue;
      } else if (field === 'cccd') {
        // Update cccd in nguoi_mua[0]
        if (!newData.extractedData[sourceType].nguoi_mua) {
          newData.extractedData[sourceType].nguoi_mua = [{}];
        }
        if (!newData.extractedData[sourceType].nguoi_mua[0]) {
          newData.extractedData[sourceType].nguoi_mua[0] = {};
        }
        newData.extractedData[sourceType].nguoi_mua[0].cccd = newValue;
      } else {
        // Update other fields directly
        newData.extractedData[sourceType][field] = newValue;
      }
      
      return newData;
    });
  };

  const handleSave = () => {
    // In a real app, you would send this to BE to save
    console.log('Saving edited data:', editedData);
    alert('Changes saved! (In real app, this would be sent to backend)');
    router.push('/results');
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      router.push('/results');
    }
  };

  const comparisonFields = Object.keys(currentResult.comparison);

  // Helper function to get value from nested data structure
  const getValue = (data: any, field: string) => {
    if (field === 'ho_ten') {
      return data.nguoi_mua?.[0]?.ho_ten || '';
    }
    if (field === 'cccd') {
      return data.nguoi_mua?.[0]?.cccd || '';
    }
    return data[field] || '';
  };

  // Helper function to find corresponding image for a field
  const findImageForField = (fieldName: string, docType: 'phieuchuyen' | 'hopdong') => {
    return currentResult.imageFiles.find(img => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Xem và chỉnh sửa</h1>
              <p className="text-sm text-gray-500">
                Xem và chỉnh sửa dữ liệu đã trích xuất
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleDiscard}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Bỏ qua thay đổi
              </button>
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {comparisonFields.map(field => {
              const comparisonItem = currentResult.comparison[field];
              // Use comparison data as the source of truth
              const phieuchuyenValue = comparisonItem.phieuchuyen || '';
              const hopdongValue = comparisonItem.hopdong || '';
              
              const phieuchuyenImage = findImageForField(field, 'phieuchuyen');
              const hopdongImage = findImageForField(field, 'hopdong');
              
              return (
                <div key={field} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">{getFieldDisplayName(field)}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phiếu chuyển
                      </label>
                      {phieuchuyenImage && (
                        <div className="mb-3">
                          <ImageDisplay 
                            imagePath={phieuchuyenImage}
                            alt={`Phiếu chuyển - ${field}`}
                            className="border rounded"
                          />
                        </div>
                      )}
                      <FieldEditor
                        value={phieuchuyenValue}
                        onChange={(newValue) => handleFieldEdit(field, 'phieuchuyen', newValue)}
                        placeholder="Enter value from phiếu chuyển"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hợp đồng
                      </label>
                      {hopdongImage && (
                        <div className="mb-3">
                          <ImageDisplay 
                            imagePath={hopdongImage}
                            alt={`Hợp đồng - ${field}`}
                            className="border rounded"
                          />
                        </div>
                      )}
                      <FieldEditor
                        value={hopdongValue}
                        onChange={(newValue) => handleFieldEdit(field, 'hopdong', newValue)}
                        placeholder="Enter value from hợp đồng"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      So sánh (Tỷ lệ: {(comparisonItem.similarity * 100).toFixed(1)}%)
                    </label>
                    <DiffText
                      oldText={phieuchuyenValue}
                      newText={hopdongValue}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;