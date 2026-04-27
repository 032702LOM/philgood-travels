import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Hi there! 👋 Welcome to PhilGood Travels. How can we help you today?' }
    ]);
    
    // UI States that we want to persist across page loads
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [widgetView, setWidgetView] = useState('menu');

    useEffect(() => {
        // 1. Establish Session ID
        let currentSessionId = localStorage.getItem('chatSessionId');
        if (!currentSessionId) {
            currentSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatSessionId', currentSessionId);
        }
        setSessionId(currentSessionId);

        // 2. Connect WebSockets exactly ONCE
        const newSocket = io(import.meta.env.VITE_API_URL, {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        setSocket(newSocket);

        // 3. Join Room and Listen for Admin Replies
        newSocket.emit('join_chat', currentSessionId);

        newSocket.on('connect', () => {
            console.log("✅ Global Chat Connected to Room:", currentSessionId);
            newSocket.emit('join_chat', currentSessionId);
        });

        newSocket.on('receive_message', (message) => {
            if (message.sender === 'admin') {
                setChatMessages((prev) => [...prev, message]);
                // Automatically open the chat if an admin replies while it's closed!
                setIsChatOpen(true); 
                setWidgetView('chat');
            }
        });

        // Cleanup on unmount (only happens if the whole app closes)
        return () => newSocket.disconnect(); 
    }, []);

    // Global function to send a message
    const sendMessage = (text) => {
        if (!text.trim() || !socket) return;

        const messageData = {
            sessionId: sessionId,
            sender: 'user',
            text: text
        };

        socket.emit('send_message', messageData);
        setChatMessages(prev => [...prev, messageData]);
    };

    // Global function to wipe the chat
    const endChat = async () => {
        if (!window.confirm("Are you sure you want to end and clear this chat?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/chats/${sessionId}`);
        } catch (error) {
            console.error("Error ending chat:", error);
        }

        localStorage.removeItem('chatSessionId');
        setChatMessages([{ sender: 'bot', text: 'Hi there! 👋 Welcome to PhilGood Travels. How can we help you today?' }]);
        
        const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', newSessionId);
        setSessionId(newSessionId);
        
        if (socket) socket.emit('join_chat', newSessionId);
        setWidgetView('menu');
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen) setWidgetView('menu'); 
    };

    return (
        <ChatContext.Provider value={{ 
            socket, sessionId, chatMessages, 
            isChatOpen, widgetView, setWidgetView, 
            toggleChat, sendMessage, endChat 
        }}>
            {children}
        </ChatContext.Provider>
    );
};