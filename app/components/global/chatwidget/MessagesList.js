import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Optional: To support GitHub Flavored Markdown
import { format } from 'date-fns'; // For formatting the date

const MessagesList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Scroll to the last message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto text-sm">
            {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-turquoise text-white' : 'bg-gray-200 text-black'} m-2`}>
                        <ReactMarkdown
                            components={{
                                a: ({ node, ...props }) => (
                                    <a {...props} className="text-blue-500 underline font-bold"></a>
                                ),
                            }}
                            remarkPlugins={[remarkGfm]} // Optional: to support tables, strikethroughs, etc.
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                    <p className={`text-xs ${msg.sender === 'user' ? 'text-right pr-3' : 'text-left pl-3'} text-gray-500`}>
                        {format(new Date(msg.timestamp), 'HH:mm')}
                    </p>
                </div>
            ))}
            {/* Dummy element to scroll into view */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessagesList;
