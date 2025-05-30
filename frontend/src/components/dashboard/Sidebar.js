import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-8">Content Generator</h1>

            <nav className="space-y-2">
                <Link
                    to="/dashboard/services"
                    className={`block px-4 py-2 rounded-md transition-colors ${isActive('/dashboard/services')
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    Services
                </Link>

                <Link
                    to="/dashboard/profile"
                    className={`block px-4 py-2 rounded-md transition-colors ${isActive('/dashboard/profile')
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    Profile
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar; 