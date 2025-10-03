
'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type DropzoneProps = {
  onDrop?: (files: File[]) => void; // optional so parent may omit or pass incorrectly without crashing
  disabled?: boolean;
};

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, disabled = false}) => {
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;
    if (typeof onDrop === 'function') {
      onDrop(acceptedFiles);
    } else {
      // Defensive fallback to avoid runtime crash; helps debugging when parent forgot to pass handler
      // eslint-disable-next-line no-console
      console.warn('Dropzone: onDrop prop is not a function or not provided', onDrop);
    }
  }, [onDrop, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    disabled,
    accept: {
      'image/*': [], // Accept all image types
      'application/pdf': [] // Accept PDF files
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        disabled 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
          : isDragActive 
            ? 'border-blue-500 bg-blue-100' 
            : 'border-gray-300 cursor-pointer hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className='flex flex-col items-center justify-center' style={{ width: 400, height: 150 }}>
        {disabled ? (
          <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-blue-600">Đang xử lý ...</p>
              <p className="text-sm text-gray-500">Điều này có thể mất một chút thời gian</p>
          </div>
        ) : isDragActive ? (
          <div >Thả file ở đây ...</div>
        ) : (
          <div>Kéo và thả một số file ở đây, hoặc nhấn để chọn file</div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;