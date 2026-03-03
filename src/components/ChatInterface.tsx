import React, { useState, useRef, useEffect } from 'react';

interface ChatInterfaceProps {
    onExecute: () => void;
    onChatUpdate?: (product: string, lastMessage: string) => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

const productQuestions: Record<string, { text: string, icon: string }[]> = {
    '소니 WH-1000XM5': [
        { text: '배터리 오래 가나요?', icon: 'battery_charging_full' },
        { text: '음질은 어떤가요?', icon: 'graphic_eq' }
    ],
    '에어팟 프로 2세대': [
        { text: '노이즈 캔슬링 어때?', icon: 'noise_control_off' },
        { text: '통화 품질은 어때?', icon: 'mic' }
    ],
    '보스 QC45': [
        { text: '착용감은 편안해?', icon: 'headphones' },
        { text: '아날로그 버튼 어때?', icon: 'tune' }
    ]
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChatUpdate }) => {
    const [selectedProduct, setSelectedProduct] = useState('소니 WH-1000XM5');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '안녕하세요! **소니 WH-1000XM5** 제품에 대한 리뷰를 분석했습니다. 이 제품의 장단점과 세부 사항에 대해 도와드릴 수 있습니다.\n\n어떤 점이 궁금하신가요?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (textQuery?: string) => {
        const messageText = typeof textQuery === 'string' ? textQuery : input;

        if (!messageText.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        if (typeof textQuery !== 'string') setInput('');
        setIsLoading(true);
        onChatUpdate?.(selectedProduct, messageText);

        try {
            const response = await fetch('/api/search/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, history: messages, product: selectedProduct }),
            });

            const data = await response.json();

            if (data.success) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.answer,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '죄송합니다. 오류가 발생했습니다: ' + error,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-card-light/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-text-primary">{selectedProduct}</h2>
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">분석 완료</span>
                        </div>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">analytics</span>
                            검증된 리뷰 기반
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select
                            value={selectedProduct}
                            onChange={(e) => {
                                const newProduct = e.target.value;
                                setSelectedProduct(newProduct);
                                setMessages([{
                                    id: Date.now().toString(),
                                    role: 'assistant',
                                    content: `안녕하세요! **${newProduct}** 제품에 대한 리뷰를 분석했습니다. 이 제품의 장단점과 세부 사항에 대해 도와드릴 수 있습니다.\n\n어떤 점이 궁금하신가요?`,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }]);
                            }}
                            className="appearance-none bg-surface-light border border-border-light hover:border-blue-300 text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-64 p-2.5 pr-10 cursor-pointer transition-colors outline-none">
                            <option value="소니 WH-1000XM5">소니 WH-1000XM5</option>
                            <option value="에어팟 프로 2세대">에어팟 프로 2세대</option>
                            <option value="보스 QC45">보스 QC45</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-surface-light text-text-secondary hover:text-primary transition-colors border border-transparent hover:border-border-light">
                        <span className="material-symbols-outlined text-[22px]">tune</span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-light text-text-secondary hover:text-primary transition-colors border border-transparent hover:border-border-light">
                        <span className="material-symbols-outlined text-[22px]">share</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth" id="chat-container" ref={chatContainerRef}>
                <div className="max-w-3xl mx-auto space-y-8 pb-10">
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-text-secondary bg-surface-light px-3 py-1 rounded-full border border-border-light/50">오늘</span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ring-4 ${msg.role === 'user' ? 'bg-blue-500 text-white font-bold text-xs ring-blue-50' : 'bg-gray-200 text-gray-500 ring-gray-50'
                                }`}>
                                <span className="material-symbols-outlined text-[20px]">
                                    {msg.role === 'user' ? 'person' : 'smart_toy'}
                                </span>
                            </div>
                            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                                <div className={`flex items-baseline gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-sm font-bold text-text-primary">
                                        {msg.role === 'user' ? '나' : 'Review AI'}
                                    </span>
                                    <span className="text-xs text-text-secondary">{msg.timestamp}</span>
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-blue-500 text-white rounded-tr-none shadow-md'
                                    : 'bg-gray-100 border border-gray-200 rounded-tl-none text-text-primary shadow-sm'
                                    } text-[15px] leading-relaxed whitespace-pre-wrap`}>
                                    {msg.content}
                                </div>
                                {msg.role === 'assistant' && msg === messages[0] && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {productQuestions[selectedProduct]?.map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(q.text)}
                                                disabled={isLoading}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-light hover:border-primary/50 hover:bg-primary-light hover:text-primary text-text-secondary text-sm font-medium rounded-full transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span className="material-symbols-outlined text-[16px]">{q.icon}</span>
                                                {q.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 shadow-sm ring-4 ring-gray-50">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-none w-24 h-12 flex items-center justify-center gap-1 shadow-sm">
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 pt-2 bg-gradient-to-t from-background-light via-background-light to-transparent">
                <div className="max-w-3xl mx-auto relative group/input">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover/input:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white border border-border-light hover:border-blue-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl shadow-lg transition-all duration-300 flex flex-col">
                        <textarea
                            className="w-full bg-transparent border-0 rounded-t-2xl px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/60 focus:ring-0 resize-none min-h-[60px] max-h-[200px]"
                            placeholder="질문을 입력하세요..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        ></textarea>
                        <div className="flex items-center justify-between px-3 pb-3 pt-1">
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-text-secondary hover:text-primary hover:bg-surface-light rounded-lg transition-colors" title="파일 첨부">
                                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                </button>
                                <button className="p-2 text-text-secondary hover:text-primary hover:bg-surface-light rounded-lg transition-colors" title="음성 입력">
                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                </button>
                            </div>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="cursor-pointer bg-primary hover:bg-blue-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-medium transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>전송</span>
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[11px] text-text-secondary mt-3">
                        AI는 실수할 수 있습니다. 중요한 정보는 확인해 주세요.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ChatInterface;
