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
  const [isIndexing, setIsIndexing] = useState(false);
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

  const handleIndexData = async () => {
    setIsIndexing(true);
    try {
      const response = await fetch('/api/index', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        alert('샘플 데이터 인덱싱 완료!');
      } else {
        alert('인덱싱 실패: ' + data.error);
      }
    } catch (error) {
      alert('에러 발생: ' + error);
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light text-text-primary">
      {view === 'chat' && (
        <Sidebar
          onIndexData={handleIndexData}
          isIndexing={isIndexing}
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
