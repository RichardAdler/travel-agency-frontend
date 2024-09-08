import React, { useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/firebase';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';


const MessageInput = ({ messages, setMessages, threadId, setThreadId }) => {
    const [input, setInput] = useState('');
    const [user] = useAuthState(auth); // Get the current authenticated user
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    const sendMessage = async () => {
        if (input.trim() === '') return;

        const newMessage = { sender: 'user', text: input, timestamp: new Date().toISOString() };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        updateLocalStorage(newMessages);
        setInput('');

        let conversationRef;

        if (user) {
            // Define conversationRef here to be used later
            conversationRef = doc(db, 'conversations', user.uid);
        }

        try {
            // Sending the message to the server via POST request
            const response = await axios.post('${backendUrl}/chat', { message: input, threadId });

            // Update threadId if a new one was created
            if (response.data.threadId) {
                setThreadId(response.data.threadId);
                localStorage.setItem('chatThreadId', response.data.threadId); // Save threadId in local storage

                if (user) {
                    // Store the initial conversation data in Firestore
                    await setDoc(conversationRef, { messages: arrayUnion(newMessage), threadId: response.data.threadId }, { merge: true });
                }
            }

            // Create a buffer to store the assistant's response
            let assistantResponseBuffer = '';

            // Setting up SSE to listen to responses
            const eventSource = new EventSource(`${backendUrl}/chat/stream?threadId=${response.data.threadId || threadId}`);
            
            eventSource.onmessage = (event) => {
                if (event.data === '[DONE]') {
                    eventSource.close();

                    // Save the complete message to Firestore
                    const completeMessage = {
                        sender: 'assistant',
                        text: assistantResponseBuffer.trim(),
                        timestamp: new Date().toISOString()
                    };

                    // Update the state and local storage with the complete message
                    setMessages(prevMessages => [...prevMessages, completeMessage]);
                    updateLocalStorage([...messages, completeMessage]);

                    if (user) {
                        // Update Firestore with the complete assistant's response
                        updateDoc(conversationRef, { messages: arrayUnion(completeMessage) });
                    }

                    return;
                }
            
                if (event.data === '[ERROR]') {
                    eventSource.close();
                    setMessages(prevMessages => [...prevMessages, { sender: 'assistant', text: 'Failed to connect to the server', timestamp: new Date().toISOString() }]);
                    updateLocalStorage(messages);
                    return;
                }
            
                const data = JSON.parse(event.data);
                if (data.response) {
                    assistantResponseBuffer = data.response; // Append new data to the buffer
                }
            };

            eventSource.onerror = (err) => {
                console.error('Error in SSE connection:', err);
                setMessages(prevMessages => [...prevMessages, { sender: 'assistant', text: 'Failed to connect to the server', timestamp: new Date().toISOString() }]);
                updateLocalStorage(messages);
                eventSource.close();
            };

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'assistant', text: 'Failed to connect to the server', timestamp: new Date().toISOString() }]);
            updateLocalStorage(messages);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const updateLocalStorage = (messages) => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    };

    return (
        <div className="p-4 flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress} // Listen for Enter key press
                placeholder="Type your message here..."
                className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button onClick={sendMessage} className="bg-turquoise text-white py-2 px-4 rounded-md">Send</button>
        </div>
    );
};

export default MessageInput;
