'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Point worker to public path (postinstall script should copy worker here)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface ReactPdfViewerProps {
  url: string;
  className?: string;
}

export default function ReactPdfViewer({ url, className }: ReactPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageTexts, setPageTexts] = useState<Array<{page:number; text:string}> | null>(null);
  const [query, setQuery] = useState<string>('');
  const [matches, setMatches] = useState<Array<{page:number; count:number}>>([]);
  const [pageWidth, setPageWidth] = useState<number>(800);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      const w = Math.min(containerRef.current.clientWidth, 1000);
      setPageWidth(w);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
    // extract text for all pages (simple synchronous loop)
    try {
      const out: Array<{page:number; text:string}> = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i);
        const tc = await p.getTextContent();
        const pageStr = tc.items.map((it: any) => it.str).join(' ');
        out.push({ page: i, text: pageStr });
      }
      setPageTexts(out);
    } catch (e) {
      // ignore extraction errors
      setPageTexts(null);
    }
  };

  const runSearch = (q: string) => {
    setQuery(q);
    if (!q) {
      setMatches([]);
      return;
    }
    if (!pageTexts) return;
    const ql = q.toLowerCase();
    const found: Array<{page:number; count:number}> = [];
    for (const p of pageTexts) {
      const c = (p.text || '').toLowerCase().split(ql).length - 1;
      if (c > 0) found.push({ page: p.page, count: c });
    }
    setMatches(found);
    if (found.length > 0) setPage(found[0].page);
  };

  const gotoPrev = () => {
    if (!matches.length) return;
    const idx = matches.findIndex(m => m.page === page);
    const prev = idx <= 0 ? matches.length - 1 : idx - 1;
    setPage(matches[prev].page);
  };
  const gotoNext = () => {
    if (!matches.length) return;
    const idx = matches.findIndex(m => m.page === page);
    const next = idx < 0 || idx === matches.length - 1 ? 0 : idx + 1;
    setPage(matches[next].page);
  };

  return (
    <div className={className} ref={containerRef}>
      <div className="flex gap-2 items-center mb-3">
        <input
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          placeholder="Tìm trong PDF..."
          className="border rounded px-2 py-1 flex-1"
        />
        <div className="text-sm text-gray-600">{matches.reduce((s,m) => s + m.count, 0)} kết quả</div>
        <div className="flex gap-1">
          <button onClick={gotoPrev} className="bg-gray-200 px-3 py-1 rounded">‹</button>
          <button onClick={gotoNext} className="bg-gray-200 px-3 py-1 rounded">›</button>
        </div>
      </div>

      <div className="border rounded p-2 max-h-[70vh] overflow-auto">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={page} width={pageWidth} />
        </Document>
        <div className="mt-2 text-sm text-gray-600">Trang {page} / {numPages}</div>
        {matches.length > 0 && (
          <div className="mt-2">
            <div className="font-medium">Kết quả theo trang:</div>
            <ul className="list-disc pl-5">
              {matches.map(m => (
                <li key={m.page}>
                  Trang {m.page}: {m.count} kết quả <button className="ml-2 text-blue-600" onClick={() => setPage(m.page)}>Xem</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
