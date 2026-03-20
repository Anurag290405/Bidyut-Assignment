import Message from '../models/Message.js';

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
    try {
        // Find recent 50 messages, ordered oldest to newest
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.status(200).json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new message via API
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const message = await Message.create({
            sender: req.user._id,
            senderName: req.user.username,
            text,
        });

        // Broadcast the new message via Socket.io
        req.app.get('io').emit('receiveMessage', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
