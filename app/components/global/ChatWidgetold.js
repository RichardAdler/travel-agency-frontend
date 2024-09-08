'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaComments } from 'react-icons/fa';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [hasMounted, setHasMounted] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [chatClosed, setChatClosed] = useState(false);
    const inactivityTimeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [collectedData, setCollectedData] = useState({});
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedMessages = localStorage.getItem('chatMessages');
            const storedIsOpen = localStorage.getItem('isOpen') === 'true';
            const storedChatClosed = localStorage.getItem('chatClosed') === 'true';

            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            }

            setIsOpen(storedIsOpen);
            setChatClosed(storedChatClosed);

            setHasMounted(true);
        }
    }, []);

    useEffect(() => {
        if (hasMounted && typeof window !== 'undefined') {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            localStorage.setItem('isOpen', isOpen);
            localStorage.setItem('chatClosed', chatClosed);
        }
    }, [messages, isOpen, chatClosed, hasMounted]);

    useEffect(() => {
        if (isOpen && !chatClosed) {
            resetInactivityTimeout();
        }
    }, [isOpen, chatClosed]);

    const resetInactivityTimeout = () => {
        clearTimeout(inactivityTimeoutRef.current);
        clearTimeout(closeTimeoutRef.current);
        setInactive(false);

        inactivityTimeoutRef.current = setTimeout(() => {
            setInactive(true);
            closeTimeoutRef.current = setTimeout(() => {
                closeChat();
            }, 2 * 60 * 1000); // 2 minutes
        }, 10 * 60 * 1000); // 10 minutes
    };

    const createDownloadLink = (chatMessages) => {
        const chatHistory = chatMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        const blob = new Blob([chatHistory], { type: 'text/plain' });
        return URL.createObjectURL(blob);
    };

    const closeChat = () => {
        const chatMessages = messages.slice(0, -2); // Exclude the last two agent messages
        const downloadLink = createDownloadLink(chatMessages);
        setDownloadLink(downloadLink);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'Agent', text: `The chat has now closed. You can download the conversation in text format using the link below.` },
            { sender: 'Agent', text: `<a href="${downloadLink}" download="chatHistory.txt" class="text-blue-600 underline">Download Conversation</a>` },
        ]);
        localStorage.removeItem('chatMessages');
        setChatClosed(true);
        setInactive(false);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !chatClosed) {
            resetInactivityTimeout();
        }
    };

    const handleChatGPTResponse = (response) => {
        let updatedData = { ...collectedData };

        // Extracting travel dates
        const dateMatch = response.match(/(?:\bon\b\s*|(?:arriving|staying)\s+)(\d{1,2}(?:th|st|nd|rd)?\s*\w+\s*\d{4})/i);
        if (dateMatch) {
            updatedData.travelDates = new Date(dateMatch[1]).toISOString().split('T')[0];
        } else if (response.toLowerCase().includes('tomorrow')) {
            // If the user mentions 'tomorrow', calculate the next day's date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            updatedData.travelDates = tomorrow.toISOString().split('T')[0];
        }

        // Extracting destination
        const destinationMatch = response.match(/(?:\bto\b|\bin\b|\bat\b)\s*([\w\s]+?)(?=\s+(?:on|for|with|during|next|tomorrow|to|in|$))/i);
        if (destinationMatch) {
            updatedData.destination = destinationMatch[1].trim();
        }

        // Extracting number of adults
        const adultsMatch = response.match(/(?:\bfor\b|\bwith\b)\s*(\d+)\s*adults?/i);
        if (adultsMatch) {
            updatedData.numAdults = parseInt(adultsMatch[1], 10);
        } else if (response.toLowerCase().includes('alone') || response.toLowerCase().includes('myself')) {
            updatedData.numAdults = 1;
        }

        // Defaulting number of children and infants to 0 if not specified
        if (!updatedData.hasOwnProperty('numChildren')) {
            updatedData.numChildren = 0;
        }
        if (!updatedData.hasOwnProperty('numInfants')) {
            updatedData.numInfants = 0;
        }

        // If travel type is specified
        const travelTypeMatch = response.match(/(?:\blooking for\b|\binterested in\b)\s*(adventure|leisure|cultural|beach|mountain|cruise|city)/i);
        if (travelTypeMatch) {
            updatedData.travelType = travelTypeMatch[1].toLowerCase();
        }

        // Update the state with the new data
        setCollectedData(updatedData);

        console.log('Collected Data:', updatedData);
    };

    const sendMessage = async () => {
        if (input.trim() === '' || chatClosed) return;

        resetInactivityTimeout();

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await axios.post(`${backendUrl}/chat`, { message: input });
            const botResponse = response.data.response;
            setMessages([...newMessages, { sender: 'Agent', text: botResponse }]);
            handleChatGPTResponse(botResponse);
        } catch (error) {
            console.error('Error fetching data from backend:', error);
        }
    };

    const restartChat = () => {
        setMessages([]);
        setChatClosed(false);
        setIsOpen(true);
        resetInactivityTimeout();
    };

    if (!hasMounted) {
        return null; // Render nothing on the server
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <div className={`${isOpen ? 'block' : 'hidden'} w-96 h-[600px] bg-white border border-gray-300 rounded-lg flex flex-col shadow-lg`}>
                <div className="bg-deep-sea-blue text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">Welcome to Holiday Havens ✈️</h3>
                        <p className='text-sm'>How can I help you plan your next trip?</p>
                    </div>
                    <button onClick={toggleChat} className="text-2xl">×</button>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto text-sm">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-turquoise text-white' : 'bg-gray-200 text-black'} m-2`}>
                                <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                            </div>
                        </div>
                    ))}
                    {inactive && !chatClosed && (
                        <div className="text-center text-red-500 mt-4">
                            Are you still there? The chat will close in 2 minutes if there's no response.
                        </div>
                    )}
                </div>
                {!chatClosed && (
                    <div className="p-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                        />
                        <button onClick={sendMessage} className="bg-turquoise text-white py-2 px-4 rounded-md whitespace-nowrap">Send</button>
                    </div>
                )}
                {chatClosed && (
                    <div className="p-4 flex flex-col items-center gap-2">
                        <button onClick={restartChat} className="bg-turquoise text-white py-2 px-4 rounded-md">Chat with an Agent Again</button>
                    </div>
                )}
            </div>
            <div id="chat-button" className="hover:bg-turquoise w-12 h-12 bg-[#E16A3D] rounded-full flex justify-center items-center cursor-pointer shadow-lg my-2 z-50" onClick={toggleChat}>
                <FaComments className="text-white w-6 h-6" />
            </div>
        </div>
    );
};

export default ChatWidget;
