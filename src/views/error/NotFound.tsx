import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <main className="grid min-h-screen content-center place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-green-500 text-white">
            <img className="w-40 h-40" alt="carbon track" src="/png/logo.png" />
            <h2 className="self-center font-bold text-white text-3xl">404 - Not Found</h2>
            <p className="text-xl p-2 mb-2">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="p-2 border-2 rounded-sm hover:text-blue-600">Go back to the homepage</Link>
        </main>
    );
};

export default NotFound;
