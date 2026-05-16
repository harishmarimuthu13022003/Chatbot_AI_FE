import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { chatService } from '../services/api';

const ChatPage = ({ handleLogout }) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const history = await chatService.getHistory();
      setChats(history);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const loadChat = async (chatId) => {
    setCurrentChatId(chatId);
    setLoading(true);
    try {
      const msgs = await chatService.getChatMessages(chatId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async (firstMessageContent) => {
    try {
      // First create chat
      const title = firstMessageContent.substring(0, 30) + (firstMessageContent.length > 30 ? "..." : "");
      const newChat = await chatService.createChat(title);
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      return newChat.id;
    } catch (error) {
      console.error("Failed to create chat", error);
      return null;
    }
  };

  const handleSendMessage = async (content) => {
    let chatIdToUse = currentChatId;
    
    // Create temp message for UI
    const tempMsgId = Date.now().toString();
    const newUserMsg = { id: tempMsgId, role: 'user', content };
    setMessages(prev => [...prev, newUserMsg]);

    if (!chatIdToUse) {
      chatIdToUse = await createNewChat(content);
      if (!chatIdToUse) return; // Handle error appropriately
    }

    // Add loading indicator message
    const loadingMsgId = 'loading-' + Date.now();
    setMessages(prev => [...prev, { id: loadingMsgId, role: 'assistant', content: '...', isLoading: true }]);

    try {
      const response = await chatService.sendMessage(chatIdToUse, content);
      
      // Replace loading msg with actual response
      setMessages(prev => prev.map(msg => msg.id === loadingMsgId ? response : msg));
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => prev.map(msg => msg.id === loadingMsgId ? { id: loadingMsgId, role: 'assistant', content: 'Sorry, an error occurred while fetching the response.' } : msg));
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  return (
    <div className="app-container">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        onSelectChat={loadChat} 
        onNewChat={startNewChat}
        onLogout={handleLogout}
      />
      <ChatArea 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        loading={loading}
      />
    </div>
  );
};

export default ChatPage;
