import React from 'react';

interface DiffTextProps {
  oldText: string;
  newText: string;
}

const DiffText: React.FC<DiffTextProps> = ({ oldText, newText }) => {
  // Simple diff highlighting - in a real app you'd use a library like 'diff'
  const getDiff = (text1: string, text2: string) => {
    if (text1.trim().toLowerCase() === text2.trim().toLowerCase()) {
      return <span className="text-green-600">✓ Hợp lệ</span>;
    }
    
    return (
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-500">Phiếu chuyển:</span>
          <div className="bg-red-50 border border-red-200 rounded p-2 mt-1">
            {text1}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Hợp đồng:</span>
          <div className="bg-green-50 border border-green-200 rounded p-2 mt-1">
            {text2}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-lg bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-2">So sánh</h4>
      {getDiff(oldText, newText)}
    </div>
  );
};

export default DiffText;