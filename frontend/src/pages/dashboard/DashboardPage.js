import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ServicesTab from '../../components/dashboard/ServicesTab';
import ProfileTab from '../../components/dashboard/ProfileTab';

const DashboardPage = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1">
                <Routes>
                    <Route path="services" element={<ServicesTab />} />
                    <Route path="profile" element={<ProfileTab />} />
                    <Route path="*" element={<Navigate to="services" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default DashboardPage; 