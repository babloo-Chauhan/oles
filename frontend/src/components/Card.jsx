import React from 'react';

const Card = ({
    children,
    className = '',
    elevated = false,
    hover = true,
    onClick,
    ...props
}) => {
    // Default card styling: subtle border, rounded corners, white background and padding
    const baseClasses = 'border border-gray-200 rounded-lg bg-white p-4';
    const elevatedClasses = elevated ? 'shadow-lg ring-1 ring-gray-100' : '';
    const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-0.5 transition-transform' : '';
    const clickClasses = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseClasses} ${elevatedClasses} ${hoverClasses} ${clickClasses} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
