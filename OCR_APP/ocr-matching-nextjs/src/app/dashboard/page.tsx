'use client';
import React from 'react';
import Link from 'next/link';
import { useResultContext } from '@/context/JobContext';

const DashboardPage: React.FC = () => {
    const { currentResult, clearResult } = useResultContext();

    if (!currentResult) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h2>
                            <p className="text-gray-500 mb-6">Upload documents to see your OCR results here.</p>
                            <Link 
                                href="/upload" 
                                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Upload Documents
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getResultSummary = () => {
        const total = Object.keys(currentResult.comparison).length;
        let matches = 0;
        let partials = 0;
        let mismatches = 0;

        Object.values(currentResult.comparison).forEach(item => {
            const similarity = item.similarity * 100;
            if (similarity >= 100) matches++;
            else if (similarity >= 85) partials++;
            else mismatches++;
        });

        return { total, matches, partials, mismatches };
    };

    const summary = getResultSummary();

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <div className="flex gap-2">
                            <Link 
                                href="/results" 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                View Results
                            </Link>
                            <Link 
                                href="/review" 
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Review & Edit
                            </Link>
                            <button 
                                onClick={() => {
                                    if (confirm('Clear current results and start over?')) {
                                        clearResult();
                                    }
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Clear Results
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                            <div className="text-sm text-blue-600">Total Fields</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">{summary.matches}</div>
                            <div className="text-sm text-green-600">🟩 Perfect Matches</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-600">{summary.partials}</div>
                            <div className="text-sm text-yellow-600">🟨 Partial Matches</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-red-600">{summary.mismatches}</div>
                            <div className="text-sm text-red-600">🟥 Mismatches</div>
                        </div>
                    </div>

                    {/* Current Result Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-2">Current Results</h3>
                        <div className="text-sm text-gray-600">
                            <p><strong>Uploaded:</strong> {new Date(currentResult.uploadedAt).toLocaleString()}</p>
                            <p><strong>Images:</strong> {currentResult.imageFiles.length} file(s)</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link 
                                href="/upload" 
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="bg-blue-100 p-2 rounded mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">Upload New</div>
                                    <div className="text-sm text-gray-500">Process new documents</div>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/results" 
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="bg-green-100 p-2 rounded mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">View Results</div>
                                    <div className="text-sm text-gray-500">See comparison table</div>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/review" 
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="bg-purple-100 p-2 rounded mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">Review & Edit</div>
                                    <div className="text-sm text-gray-500">Manual corrections</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;