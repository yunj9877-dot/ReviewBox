import type { ChatHistoryItem } from '../App';

interface SidebarProps {
    onIndexData?: () => void;
    isIndexing?: boolean;
    onNewChat?: () => void;
    chatHistory?: ChatHistoryItem[];
    activeChatId?: number | null;
    onSelectChat?: (id: number) => void;
}

const Sidebar = ({ onIndexData, isIndexing, onNewChat, chatHistory = [], activeChatId, onSelectChat }: SidebarProps) => {
    return (
        <aside className="w-80 h-full border-r border-border-light bg-surface-light flex flex-col flex-shrink-0 transition-all duration-300">
            <div className="p-5 border-b border-border-light/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[20px]">rate_review</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-text-primary leading-tight">Review AI</h1>
                        <p className="text-xs text-text-secondary font-medium">상품 분석 도구</p>
                    </div>
                </div>
            </div>
            <div className="px-4 py-4 space-y-2">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>새 대화</span>
                </button>
                <button
                    onClick={onIndexData}
                    disabled={isIndexing}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {isIndexing ? 'sync' : 'database'}
                    </span>
                    {isIndexing ? '인덱싱 중...' : '샘플 데이터 인덱싱'}
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    최근 대화
                </div>
                {chatHistory.length === 0 && (
                    <p className="px-3 py-4 text-xs text-text-secondary text-center">아직 대화 기록이 없습니다.</p>
                )}
                {chatHistory.map((item) => {
                    const isActive = item.id === activeChatId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelectChat?.(item.id)}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors ${isActive
                                ? 'bg-white shadow-sm border border-border-light/60 text-text-primary'
                                : 'hover:bg-gray-100 text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] group-hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                                {isActive ? 'chat_bubble' : 'chat_bubble_outline'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.product}</p>
                                <p className="text-xs text-text-secondary truncate">{item.lastMessage}</p>
                            </div>
                            <span className="text-xs text-text-secondary flex-shrink-0">{item.timestamp}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border-light bg-surface-light">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span className="text-sm font-medium">설정</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    <span className="text-sm font-medium">도움말 및 피드백</span>
                </a>
                <div className="mt-3 pt-3 border-t border-border-light flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">홍길동</div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-primary">홍길동</span>
                            <span className="text-xs text-text-secondary">Pro 요금제</span>
                        </div>
                    </div>
                    <button className="text-text-secondary hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

