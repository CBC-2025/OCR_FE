import React, { useState } from 'react';
import ImageDisplay from '../common/ImageDisplay';
import { getFieldDisplayName } from '@/utils/fieldNames';

interface MatchTableResult {
  field: string;
  extractedText: string;
  originalText: string;
  matchPercentage: number;
  status: 'match' | 'partial' | 'mismatch';
  phieuchuyenImage?: string; // Path to cropped image from Phiếu chuyển document
  hopdongImage?: string;     // Path to cropped image from Hợp đồng document
}

interface MatchTableProps {
  results: MatchTableResult[];
  cacheBuster?: string | number;
  isEditMode?: boolean;
  onFieldEdit?: (field: string, sourceType: 'phieuchuyen' | 'hopdong', newValue: string) => void;
}

const mapStatusToBackgroundColor = (status: 'match' | 'partial' | 'mismatch'): string => {
  switch (status) {
    case 'match': return 'bg-green-100 text-green-800';
    case 'partial': return 'bg-yellow-100 text-yellow-800';
    case 'mismatch': return 'bg-red-100 text-red-800';
    default: return 'bg-red-100 text-red-800';
  }
};

const MatchTable: React.FC<MatchTableProps> = ({ results, cacheBuster, isEditMode = false, onFieldEdit }) => {
  const [editingCell, setEditingCell] = useState<{field: string, type: 'phieuchuyen' | 'hopdong'} | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (field: string, type: 'phieuchuyen' | 'hopdong', currentValue: string) => {
    if (!isEditMode) return;
    setEditingCell({ field, type });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (editingCell && onFieldEdit) {
      onFieldEdit(editingCell.field, editingCell.type, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Trường</th>
            <th className="border border-gray-300 p-2 text-left">Phiếu chuyển</th>
            <th className="border border-gray-300 p-2 text-left">Hợp đồng</th>
            <th className="border border-gray-300 p-2 text-left">Tỉ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2 font-medium">{getFieldDisplayName(result.field)}</td>
              <td className="border border-gray-300 p-2">
                <div className="space-y-2">
                  {result.phieuchuyenImage && (
                    <ImageDisplay 
                      imagePath={result.phieuchuyenImage}
                      alt={`Phiếu chuyển - ${getFieldDisplayName(result.field)}`}
                      className="mb-2"
                      cacheBuster={cacheBuster}
                    />
                  )}
                  {editingCell?.field === result.field && editingCell?.type === 'phieuchuyen' ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleCellSave}
                      autoFocus
                      className="w-full text-sm border border-blue-500 rounded p-1 min-h-[60px] resize-none"
                      rows={2}
                    />
                  ) : (
                    <div 
                      className={`text-sm min-h-[60px] p-1 rounded ${isEditMode ? 'cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-300' : ''}`}
                      onClick={() => handleCellClick(result.field, 'phieuchuyen', result.extractedText)}
                    >
                      {result.extractedText || (isEditMode ? 'Click để chỉnh sửa...' : '')}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="space-y-2">
                  {result.hopdongImage && (
                    <ImageDisplay 
                      imagePath={result.hopdongImage}
                      alt={`Hợp đồng - ${getFieldDisplayName(result.field)}`}
                      className="mb-2"
                      cacheBuster={cacheBuster}
                    />
                  )}
                  {editingCell?.field === result.field && editingCell?.type === 'hopdong' ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleCellSave}
                      autoFocus
                      className="w-full text-sm border border-blue-500 rounded p-1 min-h-[60px] resize-none"
                      rows={2}
                    />
                  ) : (
                    <div 
                      className={`text-sm min-h-[60px] p-1 rounded ${isEditMode ? 'cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-300' : ''}`}
                      onClick={() => handleCellClick(result.field, 'hopdong', result.originalText)}
                    >
                      {result.originalText || (isEditMode ? 'Click để chỉnh sửa...' : '')}
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className={`px-2 py-1 rounded text-center font-medium ${mapStatusToBackgroundColor(result.status)}`}>
                  {result.matchPercentage.toFixed(1)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;