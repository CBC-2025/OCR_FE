import './globals.css';
import { ResultProvider } from '@/context/JobContext';

export const metadata = {
  title: 'OCR Matching Application',
  description: 'An application for extracting and matching information from documents using OCR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ResultProvider>
          {children}
        </ResultProvider>
      </body>
    </html>
  );
}