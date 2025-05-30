import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfileTab = () => {
    const [savedContents, setSavedContents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedContents();
    }, []);

    const fetchSavedContents = async () => {
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            if (!phoneNumber) {
                toast.error('Vui lòng đăng nhập để xem nội dung đã lưu');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/content/user-contents`, {
                params: {
                    phone_number: phoneNumber
                }
            });

            if (response.data.success) {
                setSavedContents(response.data.data);
            } else {
                toast.error('Không thể tải nội dung đã lưu');
            }
        } catch (error) {
            console.error('Error fetching saved contents:', error);
            toast.error('Không thể tải nội dung đã lưu');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (captionId) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/content/unsave`, {
                captionId
            });
            setSavedContents(savedContents.filter(content => content.id !== captionId));
            toast.success('Caption removed successfully');
        } catch (error) {
            console.error('Error removing caption:', error);
            toast.error('Failed to remove caption');
        }
    };

    const handleShare = (caption, e) => {
        const shareOptions = document.createElement('div');
        shareOptions.className = 'absolute bottom-full mb-2 bg-white rounded-md shadow-lg p-2';
        shareOptions.style.minWidth = '150px';

        // Facebook Share
        const fbShare = document.createElement('button');
        fbShare.className = 'w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center';
        fbShare.innerHTML = `
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Share on Facebook
        `;
        fbShare.onclick = () => {
            const url = 'https://www.facebook.com/sharer/sharer.php';
            const params = new URLSearchParams({
                u: window.location.href,
                quote: caption
            });
            window.open(`${url}?${params}`, '_blank', 'width=600,height=400');
        };

        // Email Share
        const emailShare = document.createElement('button');
        emailShare.className = 'w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center';
        emailShare.innerHTML = `
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Share via Email
        `;
        emailShare.onclick = () => {
            const subject = encodeURIComponent('Check out this caption!');
            const body = encodeURIComponent(caption);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        };

        shareOptions.appendChild(fbShare);
        shareOptions.appendChild(emailShare);

        // Position and show options
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        shareOptions.style.position = 'fixed';
        shareOptions.style.left = `${rect.left}px`;
        shareOptions.style.bottom = `${window.innerHeight - rect.top}px`;

        // Add to document and handle outside clicks
        document.body.appendChild(shareOptions);
        const handleClickOutside = (e) => {
            if (!shareOptions.contains(e.target) && e.target !== button) {
                shareOptions.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8">Saved Content</h2>

            {savedContents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>No saved content yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedContents.map((content) => (
                        <div key={content.id} className="p-4 bg-white rounded-md shadow relative">
                            <div className="mb-2 text-sm text-gray-500">
                                Topic: {content.topic}
                            </div>
                            <p className="mb-4">{content.data}</p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleUnsave(content.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Unsave
                                </button>
                                <button
                                    onClick={(e) => handleShare(content.data, e)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileTab; 