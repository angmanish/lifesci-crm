import React from 'react';
import StructuredForm from './StructuredForm';
import ChatInterface from './ChatInterface';
import { PenTool, MessageSquare } from 'lucide-react';

const LogInteractionScreen = () => {
  return (
    <div className="log-screen-layout">
      <div className="panel">
        <div className="panel-header">
          <MessageSquare size={20} color="var(--accent-color)" />
          Chat Assistant
        </div>
        <ChatInterface />
      </div>
      
      <div className="panel">
        <div className="panel-header">
          <PenTool size={20} color="var(--accent-color)" />
          Structured Form (Auto-filled)
        </div>
        <StructuredForm />
      </div>
    </div>
  );
};

export default LogInteractionScreen;
