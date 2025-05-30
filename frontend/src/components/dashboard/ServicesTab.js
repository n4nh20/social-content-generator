import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ServicesTab = () => {
    const [step, setStep] = useState('initial'); // 'initial', 'social', 'content', 'ideas'
    const [socialNetwork, setSocialNetwork] = useState('');
    const [subject, setSubject] = useState('');
    const [tone, setTone] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [captions, setCaptions] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState(null);

    const handleGenerateCaptions = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setCaptions([]); // Reset captions before generating new ones

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/content/generate-captions`, {
                socialNetwork,
                subject,
                tone
            });

            if (response.data.captions && response.data.captions.length > 0) {
                setCaptions(response.data.captions);
                toast.success('Đã tạo caption thành công!');
            } else {
                setError('Không thể tạo caption. Vui lòng thử lại.');
                toast.error('Không thể tạo caption. Vui lòng thử lại.');
            }
        } catch (error) {
            setError('Không thể tạo caption. Vui lòng thử lại.');
            console.error('Error:', error);
            toast.error('Không thể tạo caption. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    const handleGenerateIdeas = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setIdeas([]); // Reset ideas before generating new ones

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/content/get-ideas`, {
                topic
            });

            if (response.data.ideas && response.data.ideas.length > 0) {
                setIdeas(response.data.ideas);
                toast.success('Đã tạo ideas thành công!');
            } else {
                setError('Không thể tạo ideas. Vui lòng thử lại.');
                toast.error('Không thể tạo ideas. Vui lòng thử lại.');
            }
        } catch (error) {
            setError('Không thể tạo ideas. Vui lòng thử lại.');
            console.error('Error:', error);
            toast.error('Không thể tạo ideas. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    const handleGenerateCaptionsFromIdea = async (idea) => {
        setLoading(true);
        setError('');
        setCaptions([]); // Reset captions before generating new ones

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/content/create-captions-from-idea`, {
                idea
            });

            if (response.data.captions && response.data.captions.length > 0) {
                setCaptions(response.data.captions);
                setSelectedIdea(idea);
                toast.success('Đã tạo caption từ idea thành công!');
            } else {
                setError('Không thể tạo caption từ idea. Vui lòng thử lại.');
                toast.error('Không thể tạo caption từ idea. Vui lòng thử lại.');
            }
        } catch (error) {
            setError('Không thể tạo caption từ idea. Vui lòng thử lại.');
            console.error('Error:', error);
            toast.error('Không thể tạo caption từ idea. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    const handleSaveCaption = async (caption) => {
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            if (!phoneNumber) {
                toast.error('Vui lòng đăng nhập để lưu caption');
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/content/save`, {
                phoneNumber,
                topic: subject || topic || 'Untitled',
                data: caption,
                socialNetwork: socialNetwork,
                tone: tone
            });

            if (response.data.success) {
                toast.success('Đã lưu caption thành công!');
                alert('Đã lưu caption thành công!');
            } else {
                toast.error('Không thể lưu caption. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error saving caption:', error);
            toast.error('Không thể lưu caption. Vui lòng thử lại.');
        }
    };

    const handleShareCaption = (caption, e) => {
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

    const renderInitialOptions = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-8">Generate post ideas and captions in seconds</h2>
            <button
                onClick={() => setStep('social')}
                className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50"
            >
                <h3 className="text-lg font-semibold">Start from scratch</h3>
                <p className="text-gray-600">Generate new captions to engage, delight, or sell</p>
            </button>
            <button
                onClick={() => setStep('ideas')}
                className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50"
            >
                <h3 className="text-lg font-semibold">Get inspired</h3>
                <p className="text-gray-600">Generate post ideas and captions for a topic</p>
            </button>
        </div>
    );

    const renderSocialSelect = () => (
        <div>
            <button
                onClick={() => setStep('initial')}
                className="mb-4 text-blue-500 hover:text-blue-700"
            >
                ← Back
            </button>
            <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Select a social network:</h3>
                {['Facebook', 'Instagram', 'Twitter'].map((network) => (
                    <button
                        key={network}
                        onClick={() => {
                            setSocialNetwork(network);
                            setStep('content');
                        }}
                        className={`w-full p-4 text-left rounded-lg border ${socialNetwork === network
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-500'
                            }`}
                    >
                        {network}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderContentForm = () => (
        <div>
            <button
                onClick={() => setStep('social')}
                className="mb-4 text-blue-500 hover:text-blue-700"
            >
                ← Back
            </button>
            <form onSubmit={handleGenerateCaptions} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tone
                    </label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select a tone</option>
                        <option value="Professional">Professional</option>
                        <option value="Casual">Casual</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Humorous">Humorous</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Captions'}
                </button>
            </form>
        </div>
    );

    const renderIdeasForm = () => (
        <div>
            <button
                onClick={() => setStep('initial')}
                className="mb-4 text-blue-500 hover:text-blue-700"
            >
                ← Back
            </button>
            <form onSubmit={handleGenerateIdeas} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Ideas'}
                </button>
            </form>
        </div>
    );

    const renderContent = () => {
        switch (step) {
            case 'initial':
                return renderInitialOptions();
            case 'social':
                return renderSocialSelect();
            case 'content':
                return renderContentForm();
            case 'ideas':
                return renderIdeasForm();
            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {renderContent()}

            {error && (
                <div className="text-red-500 my-4">{error}</div>
            )}

            {ideas.length > 0 && step === 'ideas' && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Select an idea to generate captions:</h3>
                    <div className="space-y-2">
                        {ideas.map((idea, index) => (
                            <button
                                key={index}
                                onClick={() => handleGenerateCaptionsFromIdea(idea)}
                                className={`w-full text-left p-4 rounded-md border ${selectedIdea === idea
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-500'
                                    }`}
                            >
                                {idea}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {captions.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Generated Captions:</h3>
                    <div className="space-y-4">
                        {captions.map((caption, index) => (
                            <div key={index} className="p-4 bg-white rounded-md shadow relative">
                                <p className="mb-4">{caption}</p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleSaveCaption(caption)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save
                                    </button>
                                    <button
                                        onClick={(e) => handleShareCaption(caption, e)}
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
                </div>
            )}
        </div>
    );
};

export default ServicesTab; 