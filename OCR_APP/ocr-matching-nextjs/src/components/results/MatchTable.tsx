import React from 'react';
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
}

const mapStatusToBackgroundColor = (status: 'match' | 'partial' | 'mismatch'): string => {
  switch (status) {
    case 'match': return 'bg-green-100 text-green-800';
    case 'partial': return 'bg-yellow-100 text-yellow-800';
    case 'mismatch': return 'bg-red-100 text-red-800';
    default: return 'bg-red-100 text-red-800';
  }
};

const MatchTable: React.FC<MatchTableProps> = ({ results }) => {
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
                    />
                  )}
                  <div className="text-sm">{result.extractedText}</div>
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="space-y-2">
                  {result.hopdongImage && (
                    <ImageDisplay 
                      imagePath={result.hopdongImage}
                      alt={`Hợp đồng - ${getFieldDisplayName(result.field)}`}
                      className="mb-2"
                    />
                  )}
                  <div className="text-sm">{result.originalText}</div>
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