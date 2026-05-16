import React from 'react';
import { Plus, MessageSquare, LogOut, X } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ chats, currentChatId, onSelectChat, onNewChat, onLogout, isOpen, onClose }) => {
  // Extract username from token if possible, else default
  let username = "User";
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      username = decoded.sub.split('@')[0]; // simple fallback
    }
  } catch (e) {}

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="btn new-chat-btn" onClick={onNewChat}>
          <Plus size={18} />
          New Chat
        </button>
        <button className="btn-icon close-sidebar-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="history-list">
        {chats.length === 0 ? (
          <div className="history-empty">No conversations yet</div>
        ) : (
          chats.map(chat => (
            <div 
              key={chat.id} 
              className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={16} />
              <span>{chat.title}</span>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <span>{username}</span>
        </div>
        <button className="btn-icon" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
