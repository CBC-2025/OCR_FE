'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Dropzone from '@/components/upload/Dropzone';
import { extractPdf, ExtractPdfResponse } from '@/libs/rootApi';
import { useResultContext } from '@/context/JobContext';

const UploadPage: React.FC = () => {
    const router = useRouter();
    const { setCurrentResult, isProcessing, setIsProcessing } = useResultContext();

    const handleFiles = useCallback(async (files: File[]) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        
        setIsProcessing(true);

        try {
            // Call helper which posts to external OCR service
            const result: ExtractPdfResponse = await extractPdf(file);

            // Store result in context
            // Create an object URL for the original uploaded file so the frontend can display it
            let objectUrl: string | undefined;
            try {
                objectUrl = URL.createObjectURL(file as Blob);
            } catch (e) {
                // If creating object URL fails, leave undefined
                objectUrl = undefined;
            }

            setCurrentResult({
                extractedData: result.extracted_data,
                imageFiles: result.image_files,
                comparison: result.comparison,
                uploadedAt: new Date().toISOString(),
                originalFileUrl: objectUrl,
            });

            // Navigate to results page
            router.push('/results');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Upload/extract failed', err);
            alert(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsProcessing(false);
        }
    }, [setCurrentResult, setIsProcessing, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Tải tài liệu lên để nhận dạng ký tự quang học (OCR)</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Tự động trích xuất và so sánh thông tin. <br />
                Định dạng được hỗ trợ: PDF, hình ảnh.
            </p>
            
            {/* {isProcessing && (
                <div className="mt-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-blue-600">Đang xử lý ...</p>
                    <p className="text-sm text-gray-500">Điều này có thể mất một chút thời gian</p>
                </div>
            )} */}
            <Dropzone onDrop={handleFiles} disabled={isProcessing}/>
        </div>
    );
};

export default UploadPage;