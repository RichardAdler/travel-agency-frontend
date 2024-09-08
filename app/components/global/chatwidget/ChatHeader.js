import React from 'react';

const ChatHeader = ({ toggleChat }) => (
    <div className="bg-[#172432] text-white p-6 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-semibold">Welcome to Holiday Havens ✈️</h3>
        <button onClick={toggleChat} className="text-2xl">×</button>
    </div>
);

export default ChatHeader;
