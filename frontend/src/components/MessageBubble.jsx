import React from 'react';

const generateColorFromName = (name) => {
    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
        'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 
        'bg-teal-500', 'bg-rose-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const MessageBubble = ({ message, isMe }) => {
    const timeOption = { hour: '2-digit', minute: '2-digit' };
    const timeStr = message.createdAt 
        ? new Date(message.createdAt).toLocaleTimeString([], timeOption)
        : new Date().toLocaleTimeString([], timeOption);

    const senderName = message.senderName || 'User';
    const avatarColor = generateColorFromName(senderName);
    const initial = senderName.charAt(0).toUpperCase();

    return (
        <div className={`flex w-full items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${avatarColor}`}>
                {initial}
            </div>

            {/* Bubble Container */}
            <div className={`relative max-w-[80%] md:max-w-[70%] px-3 py-2 rounded-2xl shadow-md ${isMe ? 'bg-[#dcf8c6] rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                {!isMe && (
                    <div className="text-[11px] font-bold text-[#128c7e] mb-1">
                        {senderName}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <span className="text-[14.5px] text-gray-800 leading-snug break-words">
                        {message.text}
                    </span>
                    <span className="text-[10px] text-gray-400 self-end mt-1">
                        {timeStr}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
