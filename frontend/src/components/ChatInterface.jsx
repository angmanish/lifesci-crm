import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage } from '../store/interactionSlice';
import { Send, Loader } from 'lucide-react';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const chatHistory = useSelector(state => state.interaction.chatHistory);
  const status = useSelector(state => state.interaction.status);
  const historyEndRef = useRef(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, status]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Format history for backend
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    dispatch(sendChatMessage({ message: input, history: formattedHistory }));
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-content chat-history">
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
            <p>Start typing your interaction notes here...</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>e.g. "I met with Dr. Smith today and discussed..."</p>
          </div>
        )}
        
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        
        {status === 'loading' && (
          <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader size={16} className="spin" style={{ animation: 'spin 2s linear infinite' }} />
            Processing...
          </div>
        )}
        <div ref={historyEndRef} />
      </div>
      
      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input"
          placeholder="Type or dictate your interaction..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={status === 'loading'}
        />
        <button className="btn-send" onClick={handleSend} disabled={status === 'loading'}>
          <Send size={20} />
        </button>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatInterface;
