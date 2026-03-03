import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AnalysisDashboard from './components/AnalysisDashboard';

export interface ChatHistoryItem {
  id: number;
  product: string;
  lastMessage: string;
  timestamp: string;
}

function App() {
  const [view, setView] = useState<'chat' | 'analysis'>('chat');
  const [resetKey, setResetKey] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const handleExecute = () => {
    setView('analysis');
  };

  const handleNewChat = () => {
    setResetKey(prev => prev + 1);
    setActiveChatId(null);
  };

  const handleChatUpdate = (product: string, lastMessage: string) => {
    setChatHistory(prev => {
      // If active chat exists, update it
      if (activeChatId !== null) {
        return prev.map(item =>
          item.id === activeChatId
            ? { ...item, product, lastMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : item
        );
      }
      // Otherwise create a new entry
      const newId = Date.now();
      setActiveChatId(newId);
      return [
        { id: newId, product, lastMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev
      ].slice(0, 10); // Keep max 10
    });
  };

  const handleSelectChat = (id: number) => {
    setActiveChatId(id);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light text-text-primary">
      {view === 'chat' && (
        <Sidebar
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
        />
      )}

      <div className="flex-1 flex flex-col h-full bg-background-light relative">
        {view === 'chat' ? (
          <ChatInterface key={resetKey} onExecute={handleExecute} onChatUpdate={handleChatUpdate} />
        ) : (
          <AnalysisDashboard />
        )}
      </div>
    </div>
  );
}

export default App;
