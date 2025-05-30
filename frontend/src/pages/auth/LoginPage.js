import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneForm from '../../components/auth/PhoneForm';
import CodeForm from '../../components/auth/CodeForm';

const LoginPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showCodeForm, setShowCodeForm] = useState(false);
    const navigate = useNavigate();

    const handleCodeSent = (phone) => {
        setPhoneNumber(phone);
        setShowCodeForm(true);
    };

    const handleValidated = () => {
        navigate('/dashboard/services');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full">
                {!showCodeForm ? (
                    <PhoneForm onCodeSent={handleCodeSent} />
                ) : (
                    <CodeForm phoneNumber={phoneNumber} onValidated={handleValidated} />
                )}
            </div>
        </div>
    );
};

export default LoginPage; 