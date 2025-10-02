import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
            <div className="p-4">
                <h2 className="text-lg font-bold">OCR Matching App</h2>
            </div>
            <nav className="mt-4">
                <ul>
                    <li className="hover:bg-gray-700">
                        <Link href="/upload" className="block p-4">Upload</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link href="/dashboard" className="block p-4">Dashboard</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link href="/results" className="block p-4">Results</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link href="/review" className="block p-4">Review</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;