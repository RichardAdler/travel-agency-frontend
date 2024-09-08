// app/components/global/chatwidget/ChatWidget.js
'use client';
import React from 'react';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import ChatButton from './ChatButton';
import AuthPopup from '../AuthPopup';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const ChatWidget = ({ isOpen, toggleChat }) => {
    const [messages, setMessages] = React.useState([]);
    const [threadId, setThreadId] = React.useState('');
    const [user] = useAuthState(auth);
    const [authPopupMode, setAuthPopupMode] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            if (user) {
                localStorage.removeItem('chatMessages');
                localStorage.removeItem('chatThreadId');

                const conversationRef = doc(db, 'conversations', user.uid);
                const conversationDoc = await getDoc(conversationRef);
                if (conversationDoc.exists()) {
                    setMessages(conversationDoc.data().messages);
                    setThreadId(conversationDoc.data().threadId);
                } else {
                    setMessages([]);
                    setThreadId('');
                }
            } else {
                localStorage.removeItem('chatMessages');
                localStorage.removeItem('chatThreadId');
                setMessages([]);
                setThreadId('');
            }
        };
        fetchData();
    }, [user]);

    const deleteConversation = () => {
        if (user) {
            const conversationRef = doc(db, 'conversations', user.uid);
            deleteDoc(conversationRef).catch(error => {
                console.error('Error deleting conversation from Firestore:', error);
            });
        }
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('chatThreadId');
        setMessages([]);
        setThreadId('');
    };

    const openAuthPopup = (mode) => {
        setAuthPopupMode(mode);
    };

    const closeAuthPopup = () => {
        setAuthPopupMode(null);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* The floating chat button */}
            <ChatButton toggleChat={toggleChat} />
            
            {/* Chat window that opens when isOpen is true */}
            {isOpen && (
                <div className={`absolute bottom-16 right-0 w-96 h-[600px] ${user ? 'bg-white' : 'bg-gray-200 opacity-95'} border border-gray-300 rounded-lg shadow-lg flex flex-col z-40`}>
                    <ChatHeader toggleChat={toggleChat} />
                    {user ? (
                        <>
                            <MessagesList messages={messages} />
                            <div className="text-center">
                                <button
                                    onClick={deleteConversation}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete Conversation
                                </button>
                                <MessageInput 
                                    messages={messages} 
                                    setMessages={setMessages} 
                                    threadId={threadId}
                                    setThreadId={setThreadId}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full text-center p-4">
                            <p className="text-gray-700 font-semibold">
                                Please log in to start a conversation.
                            </p>
                            <button 
                                onClick={() => openAuthPopup('login')}
                                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md"
                            >
                                Log In
                            </button>
                        </div>
                    )}
                </div>
            )}
            {authPopupMode && <AuthPopup onClose={closeAuthPopup} initialMode={authPopupMode} />}
        </div>
    );
};

export default ChatWidget;
