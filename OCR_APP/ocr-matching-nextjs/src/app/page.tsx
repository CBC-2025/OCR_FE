'use client';
// import React from 'react';
// import Link from 'next/link';
// import { useResultContext } from '@/context/JobContext';

// const HomePage: React.FC = () => {
//     const { currentResult } = useResultContext();

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="max-w-2xl mx-auto text-center p-8">
//                 <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                     OCR Document Matching
//                 </h1>
//                 <p className="text-lg text-gray-600 mb-8">
//                     Upload and compare documents automatically using OCR technology. 
//                     Extract information from Phiếu chuyển and Hợp đồng, then review matching results.
//                 </p>
                
//                 <div className="space-y-4">
//                     <Link 
//                         href="/upload" 
//                         className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Upload New Documents
//                     </Link>
                    
//                     {currentResult && (
//                         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                             <p className="text-blue-800 font-medium mb-2">You have processed results available</p>
//                             <div className="space-x-2">
//                                 <Link 
//                                     href="/results" 
//                                     className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                                 >
//                                     View Results
//                                 </Link>
//                                 <Link 
//                                     href="/review" 
//                                     className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                                 >
//                                     Review & Edit
//                                 </Link>
//                             </div>
//                         </div>
//                     )}
//                 </div>
                
//                 <div className="mt-12 text-sm text-gray-500">
//                     <h3 className="font-semibold mb-2">How it works:</h3>
//                     <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
//                         <li>Upload your documents (PDF or images)</li>
//                         <li>OCR extracts text from both documents</li>
//                         <li>System compares and highlights differences</li>
//                         <li>Review and edit results as needed</li>
//                     </ol>
//                 </div>
//             </div>
//         </div>
       
//     );
// };

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/upload');
    }, [router]);

    return null;
};

export default HomePage;