import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`loading-spinner ${sizes[size]}`}></div>
        </div>
    );
};

export const LoadingPage = ({ message = 'Loading...' }) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </div>
    </div>
);

export const LoadingCard = ({ message = 'Loading...' }) => (
    <div className="card text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
    </div>
);

export default LoadingSpinner;
