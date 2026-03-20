import React from 'react';

const MessageBubble = ({ message, isMe }) => {
    // Format timestamp
    const timeOption = { hour: '2-digit', minute: '2-digit' };
    const timeStr = message.createdAt 
        ? new Date(message.createdAt).toLocaleTimeString([], timeOption)
        : new Date().toLocaleTimeString([], timeOption);

    return (
        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[80%] md:max-w-[60%] px-3 py-1.5 rounded-lg shadow-sm ${isMe ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                
                {/* Sender Name for received messages */}
                {!isMe && (
                    <div className="text-[11px] font-bold text-[#128c7e] mb-0.5">
                        {message.senderName || 'User'}
                    </div>
                )}

                {/* Content & Time */}
                <div className="flex flex-wrap items-end gap-2">
                    <span className="text-sm text-gray-800 leading-snug break-words">
                        {message.text}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto whitespace-nowrap mb[-2px]">
                        {timeStr}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
