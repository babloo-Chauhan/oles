import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const role = localStorage.getItem('role');

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠', roles: ['ADMIN', 'CANDIDATE'] },
        { name: 'Admin Panel', href: '/admin', icon: '⚙️', roles: ['ADMIN'] },
        { name: 'Results', href: '/results', icon: '📊', roles: ['ADMIN', 'CANDIDATE'] },
    ];

    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(role)
    );

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? '' : 'closed'} lg:translate-x-0`}>
             

                <nav className="mt-6 px-4">
                    <div className="space-y-2">
                        {filteredNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="text-lg mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className=" bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                  
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="mr-2">🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''} lg:ml-64`}>
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800 colorful-heading">
                                    {location.pathname === '/dashboard' && 'Dashboard'}
                                    {location.pathname === '/admin' && 'Admin Panel'}
                                    {location.pathname === '/results' && 'Results'}
                                    {location.pathname.startsWith('/exam/') && 'Exam'}
                                </h1>
                                <p className="text-sm text-gray-500 colorful-subtitle">
                                    Welcome back, {localStorage.getItem('username')}!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 centered-container centered-section">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
