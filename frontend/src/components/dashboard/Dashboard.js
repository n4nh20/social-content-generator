import React, { useState } from 'react';
import ServicesTab from './ServicesTab';
import ProfileTab from './ProfileTab';
import { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('services');

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">
                        Content Generator
                    </h1>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'services'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                            <span>Services</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span>Profile</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                {activeTab === 'services' && <ServicesTab />}
                {activeTab === 'profile' && <ProfileTab />}
            </div>
        </div>
    );
};

export default Dashboard; 