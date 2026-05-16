import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Menu } from 'lucide-react';

const ChatArea = ({ messages, onSendMessage, loading, onToggleSidebar }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="main-content">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="btn-icon" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <span style={{ marginLeft: 12, fontWeight: 600 }}>CHAT AI</span>
      </div>

      <div className="chat-header">
        CHAT AI
      </div>

      {messages.length === 0 ? (
        <div className="welcome-screen">
          <div className="welcome-icon" style={{ width: 80, height: 80, marginBottom: 24 }}>
            <Bot size={40} />
          </div>
          <h2>How can I help you today?</h2>
          <p>Send a message to start chatting with AI.</p>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                {msg.isLoading ? (
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="chat-input-wrapper">
        <form className="chat-input-container" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
