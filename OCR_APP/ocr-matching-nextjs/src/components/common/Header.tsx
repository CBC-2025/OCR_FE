import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">OCR Matching Application</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/upload" className="hover:underline">Upload</a></li>
                    <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;