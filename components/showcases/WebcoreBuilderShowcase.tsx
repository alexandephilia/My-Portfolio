import {
    CalendarClock,
    ChevronDown,
    Code2,
    Database,
    Layers,
    LayoutTemplate,
    PanelLeft,
    PlusSquare,
    Settings2,
    Sparkles,
    Workflow,
    Zap
} from 'lucide-react';
import React, { useState, memo } from 'react';

enum TabType {
    ELEMENTS = 'Elements',
    SYMBOL = 'Symbol'
}

enum PanelType {
    LAYOUT = 'Layout',
    WORKFLOW = 'Workflow'
}

const Sidebar: React.FC = memo(() => {
    const iconClass = "w-5 h-5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer";
    const itemClass = "w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors mb-4";

    return (
        <div className="w-[60px] flex flex-col items-center py-6 border-r border-gray-100 bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#fafafa_100%)]">
            <div className={itemClass}>
                <LayoutTemplate className={iconClass} />
            </div>
            <div className={itemClass}>
                <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className={itemClass}>
                <PlusSquare className={iconClass} />
            </div>
            <div className={itemClass}>
                <Code2 className={iconClass} />
            </div>
            <div className={itemClass}>
                <Layers className={iconClass} />
            </div>
            <div className={itemClass}>
                <Database className={iconClass} />
            </div>
            <div className={itemClass}>
                <Settings2 className={iconClass} />
            </div>
        </div>
    );
});

const BuilderCard: React.FC = memo(() => {
    return (
        <div className="w-full h-[260px] relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white group">
            {/* Image section */}
            <div className="absolute top-0 left-0 right-0 h-[62%]">
                <img
                    src="https://r2.flowith.net/gemini-proxy-go/1767044205483/58c8d357-a61f-4870-917f-ea8547d74e2a.jpg"
                    alt="AI Builder Preview"
                    className="w-full h-full object-cover opacity-95 blur-[0.5px]"
                />
                {/* Badge */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-[4px] md:backdrop-blur-[5px] border border-white/20 text-white text-xs font-medium shadow-lg">
                        AI Builder
                    </div>
                </div>
            </div>

            {/* Gradient overlay - extends from bottom covering the seam */}
            <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-linear-to-t from-white from-70% via-white/76 via-80% to-transparent pointer-events-none z-5" />

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 flex flex-col justify-end z-10">
                <p className="text-gray-700 text-[12px] leading-relaxed mb-4 font-medium text-center">
                    To design a layout with AI, add a new section and interact.
                </p>
                <div className="flex gap-3">
                    <button className="premium-button flex-1 py-2 rounded-full text-xs font-medium">
                        <div className="button-shine"></div>
                        <div className="button-inner-shadow rounded-full"></div>
                        <span className="button-text">Try AI</span>
                    </button>
                    <button className="premium-button-light flex-1 py-2 rounded-full text-xs font-medium">
                        <div className="button-shine-light"></div>
                        <div className="button-inner-shadow-light rounded-full"></div>
                        <span className="button-text-light">Close</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

const Dashboard: React.FC = memo(() => {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.ELEMENTS);
    const [activePanel, setActivePanel] = useState<PanelType>(PanelType.LAYOUT);

    return (
        <div className="flex flex-col min-w-[960px] h-full bg-transparent overflow-hidden">
            <header className="h-14 flex items-center px-4 bg-[radial-gradient(ellipse_at_top_left,#ffffff_40%,#f3f4f6_100%)] border-b border-gray-100 z-20 relative flex-none">
                <div className="flex items-center gap-2">
                    <div className="text-gray-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929" />
                        </svg>
                    </div>
                    <h1 className="text-base font-semibold text-gray-900 tracking-tight">Zeta Inc</h1>
                    <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <span>Webcore App</span>
                        <span className="text-gray-300">/</span>
                        <span>Home</span>
                    </div>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-b from-[#3f95ff] to-[#82b5f4] border border-blue-300/50 shadow-[0_2px_4px_rgba(59,130,246,0.2)] text-white">
                        Draft
                    </span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />

                <div className="w-[300px] flex-none flex flex-col border-r border-gray-100 bg-[radial-gradient(ellipse_at_top_left,#ffffff_40%,#fafafa_100%)] p-4 z-10">
                    <div className="bg-gray-100/80 p-1 rounded-full grid grid-cols-2 gap-1 mb-3 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.08)] flex-none">
                        <button
                            onClick={() => setActiveTab(TabType.ELEMENTS)}
                            className={`text-sm font-medium py-1.5 px-3 rounded-full transition-colors duration-200 relative ${activeTab === TabType.ELEMENTS
                                ? 'bg-linear-to-b from-white to-gray-50 text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,1)] ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                }`}
                        >
                            Elements
                        </button>
                        <button
                            onClick={() => setActiveTab(TabType.SYMBOL)}
                            className={`text-sm font-medium py-1.5 px-3 rounded-full transition-colors duration-200 relative ${activeTab === TabType.SYMBOL
                                ? 'bg-linear-to-b from-white to-gray-50 text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,1)] ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                }`}
                        >
                            Symbol
                        </button>
                    </div>
                    <BuilderCard />
                </div>

                <div className="flex-1 bg-white bg-dot-pattern relative flex flex-col">
                    <div className="absolute top-6 left-6 flex gap-3 z-10">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex items-center">
                            <button
                                onClick={() => setActivePanel(PanelType.LAYOUT)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activePanel === PanelType.LAYOUT ? 'bg-gray-50 text-gray-900' : 'text-gray-500'
                                    }`}
                            >
                                <PanelLeft size={18} />
                                Layout
                            </button>
                            <button
                                onClick={() => setActivePanel(PanelType.WORKFLOW)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activePanel === PanelType.WORKFLOW ? 'bg-gray-50 text-gray-900' : 'text-gray-500'
                                    }`}
                            >
                                <Workflow size={18} />
                                Workflow
                            </button>
                        </div>
                    </div>

                    <div className="mt-24 ml-6 w-80 relative z-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-[radial-gradient(ellipse_at_top,#ffffff_50%,#f9fafb_100%)]">
                                <Zap className="w-5 h-5 text-gray-700 fill-gray-100" />
                                <span className="font-semibold text-gray-800">startTrigger</span>
                            </div>

                            <div className="p-4 bg-[radial-gradient(ellipse_at_top_right,#ffffff_60%,#fafafa_100%)]">
                                <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trigger</div>
                                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors cursor-pointer group shadow-sm">
                                    <CalendarClock className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                                    <span className="text-sm font-medium text-gray-700 flex-1">At 5 minutes past</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="p-4 pt-0 bg-white">
                                <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Headers</div>
                                <div className="h-10 border border-gray-200 border-dashed rounded-xl flex items-center justify-center bg-gray-50">
                                    <span className="text-xs text-gray-400">Add header...</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-32 bg-white rounded-2xl border border-gray-100/50 opacity-60"></div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Full showcase with outer rim and background - EXACT copy from original App.tsx
export const WebcoreBuilderShowcase: React.FC = memo(() => {
    return (
        <div
            className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('https://r2.flowith.net/gemini-proxy-go/1767047299373/10aa2084-aee2-41cb-ac4d-0068729e08b9.jpg')`
            }}
        >
            {/* Outer Glass Frame (The Rim) - Reduced blur on mobile */}
            <div className="relative w-full max-w-[640px] h-[420px] bg-white/30 backdrop-blur-[4px] md:backdrop-blur-md rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3 border border-white/40">
                {/* Inner Container Wrapper */}
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                    {/* LAYER 1: The Background (Solid) */}
                    <div className="absolute inset-0 bg-white/60" />

                    {/* LAYER 2: The Content (Masked) */}
                    <div
                        className="relative w-full h-full"
                        style={{
                            maskImage: 'linear-gradient(to right, black 75%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 75%, transparent 100%)'
                        }}
                    >
                        <Dashboard />
                    </div>
                </div>
            </div>
        </div>
    );
});

