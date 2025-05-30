import React, { useState } from 'react';
import axios from 'axios';

const CodeForm = ({ phoneNumber, onValidated }) => {
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/validate-access-code`, {
                phoneNumber,
                accessCode
            });

            if (response.data.success) {
                localStorage.setItem('phoneNumber', phoneNumber);
                onValidated();
            }
        } catch (error) {
            setError('Invalid access code. Please try again.');
            console.error('Error:', error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter Access Code</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                        Access Code
                    </label>
                    <input
                        type="text"
                        id="code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        maxLength={6}
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Validating...' : 'Validate Code'}
                </button>
            </form>
        </div>
    );
};

export default CodeForm; 