import { NextRequest, NextResponse } from 'next/server';
import { extractPdf, ExtractPdfResponse } from '@/libs/rootApi';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không có tệp nào được tải lên' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Loại tệp không hợp lệ. Chỉ cho phép tệp PDF và hình ảnh.' 
      }, { status: 400 });
    }

    // Validate file size (e.g., max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Kích thước tệp quá lớn. Kích thước tối đa là 20MB.' 
      }, { status: 400 });
    }

    // Call the backend API to extract PDF data
    const result: ExtractPdfResponse = await extractPdf(file);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Lỗi tải lên:', error);

    let errorMessage = 'Lỗi khi xử lý tệp';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}