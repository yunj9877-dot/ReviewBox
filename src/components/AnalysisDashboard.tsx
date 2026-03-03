import React from 'react';

const AnalysisDashboard: React.FC = () => {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border-light bg-card-light/80 backdrop-blur-md">
                <div className="px-6 md:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-text-main">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-xl">reviews</span>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">ReviewAI</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-sm font-medium text-text-muted hover:text-primary transition-colors" href="#">대시보드</a>
                            <a className="text-sm font-medium text-text-main" href="#">분석</a>
                            <a className="text-sm font-medium text-text-muted hover:text-primary transition-colors" href="#">설정</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input className="h-9 w-64 rounded-md border border-border-light bg-background-light pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="제품 검색..." type="text" />
                        </div>
                        <button className="size-9 rounded-full bg-background-light flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border border-border-light">홍</div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <a className="hover:text-primary transition-colors" href="#">제품</a>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-text-main font-medium">Sony WH-1000XM5</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-text-main">리뷰 요약</h1>
                            <p className="text-text-muted mt-1">다양한 출처에서 수집된 1,240개의 리뷰를 기반으로 한 AI 분석 결과입니다.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border-light bg-card-light hover:bg-background-light h-10 px-4 py-2 text-text-main shadow-sm gap-2">
                                <span className="material-symbols-outlined text-[18px]">share</span>
                                리포트 내보내기
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 shadow-sm gap-2">
                                <span className="material-symbols-outlined text-[18px]">refresh</span>
                                분석 업데이트
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card-light rounded-xl border border-border-light shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border-light flex flex-col sm:flex-row gap-6 items-start">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-background-light rounded-lg border border-border-light flex items-center justify-center p-2 flex-shrink-0">
                                <span className="material-symbols-outlined text-6xl text-text-muted">headphones</span>
                            </div>
                            <div className="flex-1 space-y-3 w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main">Sony WH-1000XM5</h3>
                                        <p className="text-sm text-text-muted">무선 노이즈 캔슬링 헤드폰</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-green-100 text-green-800 hover:bg-green-200">
                                        훌륭함
                                    </span>
                                </div>

                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-black text-text-main">4.8</span>
                                    <div className="flex flex-col mb-1">
                                        <div className="flex text-yellow-400 text-lg">
                                            <span className="material-symbols-outlined filled-icon">star</span>
                                            <span className="material-symbols-outlined filled-icon">star</span>
                                            <span className="material-symbols-outlined filled-icon">star</span>
                                            <span className="material-symbols-outlined filled-icon">star</span>
                                            <span className="material-symbols-outlined filled-icon text-yellow-200">star_half</span>
                                        </div>
                                        <span className="text-xs text-text-muted font-medium">전체 리뷰 1,240개 기준</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    <div className="flex justify-between text-xs font-medium text-text-muted">
                                        <span>감정 분포</span>
                                        <span>긍정 92%</span>
                                    </div>
                                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-background-light">
                                        <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                        <div className="h-full bg-gray-300" style={{ width: '10%' }}></div>
                                        <div className="h-full bg-rose-500" style={{ width: '5%' }}></div>
                                    </div>
                                    <div className="flex gap-4 text-xs text-text-muted mt-1">
                                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500"></div> 긍정 (85%)</div>
                                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-gray-300"></div> 중립 (10%)</div>
                                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-rose-500"></div> 부정 (5%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-light bg-background-light/30">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
                                    <span className="material-symbols-outlined filled-icon">thumb_up</span>
                                    <h4>장점</h4>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 shrink-0">check_circle</span>
                                        <span>업계 최고의 노이즈 캔슬링 기술.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 shrink-0">check_circle</span>
                                        <span>매우 편안한 경량 디자인.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 shrink-0">check_circle</span>
                                        <span>빠른 충전과 뛰어난 배터리 수명.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4 text-rose-600 font-semibold">
                                    <span className="material-symbols-outlined filled-icon">thumb_down</span>
                                    <h4>단점</h4>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-rose-500 text-lg mt-0.5 shrink-0">cancel</span>
                                        <span>접이식 디자인이 아니어서 이동 시 부피가 큼.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-rose-500 text-lg mt-0.5 shrink-0">cancel</span>
                                        <span>자동 ANC 최적화 기능이 일관되지 않을 수 있음.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-text-main">
                                        <span className="material-symbols-outlined text-rose-500 text-lg mt-0.5 shrink-0">cancel</span>
                                        <span>이전 모델보다 가격이 상승함.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card-light rounded-xl border border-border-light shadow-sm p-6 flex flex-col gap-6">
                        <h3 className="font-bold text-lg text-text-main">주요 키워드</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light border border-border-light">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <span className="material-symbols-outlined">sound_detection_loud_sound</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-text-main">음질</span>
                                        <span className="text-xs text-text-muted">리뷰 840건에서 언급됨</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">9.2/10</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light border border-border-light">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <span className="material-symbols-outlined">battery_charging_full</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-text-main">배터리 수명</span>
                                        <span className="text-xs text-text-muted">리뷰 620건에서 언급됨</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">9.5/10</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light border border-border-light">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <span className="material-symbols-outlined">mic</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-text-main">통화 품질</span>
                                        <span className="text-xs text-text-muted">리뷰 315건에서 언급됨</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">8.8/10</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border-light">
                            <p className="text-xs text-text-muted mb-3">관련도 점수</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-primary">98%</span>
                                <span className="text-sm text-text-muted mb-1">검색어와 일치</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-text-main">참고한 리뷰</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-muted">정렬:</span>
                            <select className="text-sm bg-transparent border-none font-medium text-text-main focus:ring-0 cursor-pointer outline-none">
                                <option>관련도순</option>
                                <option>최신순</option>
                                <option>별점 높은순</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { author: 'Jane Doe', source: 'Amazon • 구매 인증됨', initial: 'JD', rating: 5, date: '관련도 95%', title: '지금까지 써본 최고의 헤드폰', content: '가격 때문에 망설였지만 노이즈 캔슬링은 정말 차원이 다릅니다. 디자인은 세련되었지만 XM4의 접이식 기능이 그립긴 하네요...', color: 'from-blue-400 to-indigo-500' },
                            { author: 'Sarah Miller', source: 'BestBuy • 테크 애호가', initial: 'SM', rating: 4, date: '관련도 88%', title: '소리는 좋지만 착용감이 불편함', content: '밀폐형 헤드폰 치고 사운드 스테이지가 놀랍습니다. 하지만 2시간 정도 계속 쓰면 머리띠가 정수리를 누르는 느낌이 듭니다.', color: 'from-emerald-400 to-teal-500' },
                            { author: 'Mike K.', source: 'TechRadar • 전문 리뷰', initial: 'MK', rating: 4.5, date: '관련도 92%', title: '훌륭한 후속작', content: '소니가 또 해냈네요. 중음역대 ANC가 눈에 띄게 좋아졌습니다. 통화 품질은 XM4보다 훨씬 개선되어 사무실 업무용으로도 쓸만합니다...', color: 'from-orange-400 to-pink-500' },
                            { author: 'Elena L.', source: 'Target • 구매 인증됨', initial: 'EL', rating: 5, date: '관련도 76%', title: '출퇴근용으로 완벽해요', content: '지하철 소음을 완전히 차단해줘요. 드디어 팟캐스트를 조용히 들을 수 있게 됐어요. 배터리도 일주일 출퇴근 내내 갑니다.', color: 'from-purple-400 to-indigo-600' },
                            { author: 'David R.', source: 'Google 리뷰', initial: 'DR', rating: 3, date: '관련도 81%', title: '가격이 너무 비쌈', content: '좋긴 한데, 400달러 값어치는 아닙니다. 경쟁사 제품으로 훨씬 저렴하게 비슷한 성능을 낼 수 있어요. 가격에 비해 플라스틱 재질이 좀 싼티납니다.', color: 'from-gray-500 to-slate-700' },
                            { author: 'Jenny L.', source: 'Youtube 댓글', initial: 'JL', rating: 5, date: '관련도 65%', title: '마이크 성능 놀라움', content: '시끄러운 카페에서 통화하는데 상대방이 배경 소음을 전혀 못 듣네요. 밖에서 걸을 때 바람 소리 감소 기능도 놀라울 정도로 잘 작동합니다.', color: 'from-red-400 to-pink-600' },
                        ].map((review, i) => (
                            <div key={i} className="group bg-card-light rounded-xl border border-border-light p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/30 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-8 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-xs font-bold`}>{review.initial}</div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-main">{review.author}</p>
                                            <p className="text-xs text-text-muted">{review.source}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">{review.date}</span>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 text-sm mb-2">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <span key={idx} className={`material-symbols-outlined ${idx < Math.floor(review.rating) ? 'filled-icon' : idx < review.rating ? 'filled-icon text-yellow-200' : 'text-gray-300'} text-[18px]`}>
                                            {idx < Math.floor(review.rating) ? 'star' : idx < review.rating ? 'star_half' : 'star'}
                                        </span>
                                    ))}
                                </div>
                                <h4 className="font-medium text-text-main mb-1">{review.title}</h4>
                                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed flex-1">
                                    {review.content}
                                </p>
                                <button className="mt-3 text-xs font-medium text-primary hover:underline flex items-center gap-1">
                                    더 보기 <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-6">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border-light bg-card-light hover:bg-background-light h-10 px-8 py-2 text-text-main shadow-sm">
                            리뷰 더 불러오기
                        </button>
                    </div>
                </div>
            </main>

            <footer className="border-t border-border-light bg-card-light py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-text-muted">© 2024 ReviewAI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="text-sm text-text-muted hover:text-text-main" href="#">개인정보 처리방침</a>
                        <a className="text-sm text-text-muted hover:text-text-main" href="#">서비스 이용약관</a>
                        <a className="text-sm text-text-muted hover:text-text-main" href="#">고객센터 문의</a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default AnalysisDashboard;
