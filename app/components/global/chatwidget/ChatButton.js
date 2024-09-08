import React from 'react';
import { FaComments } from 'react-icons/fa';

const ChatButton = ({ toggleChat }) => (
    <div
        id="chat-button"
        className="hover:bg-turquoise w-12 h-12 bg-[#E16A3D] rounded-full flex justify-center items-center cursor-pointer shadow-lg fixed bottom-4 right-4 z-50"
        onClick={toggleChat}
    >
        <FaComments className="text-white w-6 h-6" />
    </div>
);

export default ChatButton;
