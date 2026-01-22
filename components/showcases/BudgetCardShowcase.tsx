import React, { useEffect, useRef, useState, useMemo, memo } from 'react';

type MonthKey = 'may' | 'jun' | 'jul' | 'aug';

interface BudgetMonthData {
    totalBudget: number;
    spent: number;
}

type BudgetDataMap = Record<string, BudgetMonthData>;

// Mock Data
const budgetData: BudgetDataMap = {
    may: { totalBudget: 9200, spent: 7800 },
    jun: { totalBudget: 11000, spent: 5200 },
    jul: { totalBudget: 10354, spent: 4625 },
    aug: { totalBudget: 12000, spent: 3100 }
};

const monthLabels: Record<MonthKey, string> = {
    may: 'May',
    jun: 'June',
    jul: 'July',
    aug: 'August'
};

interface BudgetCardProps {
    theme?: 'dark' | 'light';
}

const BudgetCard: React.FC<BudgetCardProps> = memo(({ theme = 'dark' }) => {
    const [selectedMonth, setSelectedMonth] = useState<MonthKey>('jul');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentData = budgetData[selectedMonth];
    const remaining = currentData.totalBudget - currentData.spent;
    const percentage = Math.round((currentData.spent / currentData.totalBudget) * 100);

    const isDark = theme === 'dark';

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Theme-specific styles - useMemo to avoid re-calculating on every render if theme hasn't changed
    const styles = useMemo(() => isDark ? {
        // Dark theme
        outerGlow: 'bg-purple-600/5',
        cardContainer: 'bg-black/40 border-white/[0.02]',
        innerHighlight: 'bg-neutral-800/10',
        mainCard: 'bg-[#0c0c0c] shadow-[inset_0_1px_2px_rgba(255,255,255,0.04)]',
        headerText: 'text-neutral-500',
        monthButton: {
            background: 'linear-gradient(180deg, #1a1a1a 0%, #111111 50%, #080808 100%)',
            boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.08) inset, 0 -1px 0 0 rgba(0, 0, 0, 0.8) inset, 0 8px 16px -4px rgba(0, 0, 0, 0.6)'
        },
        monthButtonText: 'text-neutral-300 hover:text-white',
        monthButtonShine: 'via-white/30',
        dropdown: 'bg-[#1a1a1a] border-white/10',
        dropdownItem: 'hover:bg-white/5',
        dropdownItemText: 'text-neutral-400',
        dropdownItemActive: 'text-purple-400',
        totalText: 'raised-text',
        labelText: 'text-neutral-500',
        progressTrack: 'bg-[#222] border-white/5',
        progressBar: 'from-[#310e61] via-[#8b5cf6] to-[#e9d5ff]',
        statsLabel: 'text-neutral-500',
        statsValue: 'raised-text-light',
        percentageBadge: {
            background: 'linear-gradient(180deg, #1a1a1a 0%, #111111 50%, #080808 100%)',
            boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.08) inset, 0 -1px 0 0 rgba(0, 0, 0, 0.8) inset, 0 4px 8px -2px rgba(0, 0, 0, 0.5)'
        },
        percentageText: 'raised-text-xs',
        buttonClass: 'premium-button',
        buttonTextClass: 'button-text'
    } : {
        // Light theme
        outerGlow: 'bg-purple-400/10',
        cardContainer: 'bg-white/25 border-white/20',
        innerHighlight: 'bg-white/40',
        mainCard: 'bg-white/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]',
        headerText: 'text-gray-500',
        monthButton: {
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(245, 245, 245, 1) 50%, rgba(235, 235, 235, 1) 100%)',
            boxShadow: '0 1px 0 0 rgba(255, 255, 255, 1) inset, 0 -1px 0 0 rgba(0, 0, 0, 0.05) inset, 0 2px 4px rgba(0, 0, 0, 0.08)'
        },
        monthButtonText: 'text-gray-600 hover:text-gray-900',
        monthButtonShine: 'via-white/60',
        dropdown: 'bg-white border-gray-200',
        dropdownItem: 'hover:bg-gray-50',
        dropdownItemText: 'text-gray-600',
        dropdownItemActive: 'text-purple-600',
        totalText: 'raised-text-light-theme',
        labelText: 'text-gray-500',
        progressTrack: 'bg-gray-200/80 border-gray-300/50',
        progressBar: 'from-[#c4b5fd] via-[#8b5cf6] to-[#6d28d9]',
        statsLabel: 'text-gray-500',
        statsValue: 'raised-text-light-theme-sm',
        percentageBadge: {
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(245, 245, 245, 1) 50%, rgba(235, 235, 235, 1) 100%)',
            boxShadow: '0 1px 0 0 rgba(255, 255, 255, 1) inset, 0 -1px 0 0 rgba(0, 0, 0, 0.05) inset, 0 2px 4px rgba(0, 0, 0, 0.08)'
        },
        percentageText: 'raised-text-light-theme-xs',
        buttonClass: 'premium-button-light',
        buttonTextClass: 'button-text-light'
    }, [isDark]);

    return (
        <div className="relative w-full max-w-[440px]">
            {/* Card outer glow - Reduced blur on mobile */}
            <div className={`absolute inset-[-30px] ${styles.outerGlow} blur-[30px] md:blur-[60px] rounded-[80px] opacity-30`}></div>

            {/* Card Container - Reduced backdrop-blur on mobile */}
            <div className={`relative p-[10px] rounded-[36px] ${styles.cardContainer} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xs md:backdrop-blur-[10px] transition-[background-color,border-color] duration-500 overflow-hidden border`}>

                {/* Inner highlight */}
                <div className={`absolute top-[-20%] left-[-20%] w-[60%] h-[60%] ${styles.innerHighlight} blur-[30px] md:blur-[60px] pointer-events-none`}></div>

                {/* Main Card Content */}
                <article className={`relative ${styles.mainCard} rounded-[32px] p-8 flex flex-col gap-6`}>

                    {/* Header */}
                    <header className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center w-full">
                            <h2 className={`${styles.headerText} font-medium text-[11px] tracking-wider uppercase`}>
                                Monthly Budget
                            </h2>

                            {/* Month Selector */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`flex items-center gap-1.5 ${styles.monthButtonText} transition-colors duration-200 py-0.5 px-2 border-r border-l border-b ${isDark ? 'border-white/5' : 'border-gray-200/50'} rounded-[6px] focus:outline-none relative overflow-hidden group`}
                                    style={styles.monthButton}
                                >
                                    {/* Inset Top Gradient (Replacing Border) - Theme Aware */}
                                    <div className={`absolute top-0 left-0 right-0 h-[2px] ${isDark ? 'bg-linear-to-b from-white/10 to-transparent' : 'bg-linear-to-b from-gray-500/20 to-transparent'} pointer-events-none`}></div>

                                    {/* Inset Side Gradients - Theme Aware */}
                                    <div className={`absolute inset-y-0 left-0 w-[5px] ${isDark ? 'bg-linear-to-r from-white/10 via-white/5 to-transparent' : 'bg-linear-to-r from-gray-400/30 via-gray-200/10 to-transparent'} pointer-events-none`}></div>
                                    <div className={`absolute inset-y-0 right-0 w-[5px] ${isDark ? 'bg-linear-to-l from-white/10 via-white/5 to-transparent' : 'bg-linear-to-l from-gray-400/30 via-gray-400/10 to-transparent'} pointer-events-none`}></div>

                                    {/* Top Shine Effect - Theme Aware Intensity */}
                                    <div className={`absolute top-0 left-0 right-0 h-[10px] ${isDark ? 'bg-linear-to-b from-white/30 via-white/5 to-transparent' : 'bg-linear-to-b from-white/40 via-white/10 to-transparent'} pointer-events-none`}></div>
                                    
                                    {/* Inner shine (Original) */}
                                    <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent ${isDark ? 'via-white/40' : 'via-white/70'} to-transparent opacity-80`}></div>

                                    <span className="text-[11px] font-medium tracking-tight relative z-10">{monthLabels[selectedMonth]}</span>
                                    <svg
                                        className={`w-2 h-2 transition-transform duration-300 relative z-10 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute right-0 top-full mt-3 w-32 ${styles.dropdown} border rounded-2xl shadow-2xl overflow-hidden z-50 transition-[opacity,transform] duration-300 origin-top-right ${isDropdownOpen
                                        ? 'opacity-100 scale-100 translate-y-0'
                                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                        }`}
                                >
                                    {(Object.keys(budgetData) as MonthKey[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedMonth(key);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${styles.dropdownItem} ${selectedMonth === key ? `${styles.dropdownItemActive} font-semibold` : styles.dropdownItemText
                                                }`}
                                        >
                                            {monthLabels[key]}
                                            {selectedMonth === key && (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Total Budget */}
                        <section>
                            <h1 className={`${styles.totalText} text-[56px] font-normal tracking-tighter leading-[1] tabular-nums mt-2`}>
                                {formatCurrency(currentData.totalBudget)}
                            </h1>
                        </section>
                    </header>

                    {/* Progress Bar */}
                    <section>
                        <div className="space-y-3">
                            <label className={`text-[10px] font-medium ${styles.labelText} tracking-wider uppercase`}>
                                Monthly spending limit
                            </label>
                            <div className="h-[8px] w-full bg-[#181818] rounded-full overflow-visible relative">

                                {/* Base Track */}
                                <div className={`absolute inset-0 ${styles.progressTrack} rounded-full overflow-hidden border`}>
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${styles.progressBar} relative z-10`}
                                        style={{ width: `${percentage}%`, transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                                    ></div>
                                </div>

                                {/* Glow layers - only on desktop or high performance */}
                                <div className="hidden md:block">
                                    <div
                                        className="absolute top-1/2 rounded-full z-0 pointer-events-none"
                                        style={{
                                            left: `${percentage}%`,
                                            width: '60px',
                                            height: '24px',
                                            transform: 'translate(-50%, -50%)',
                                            transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            background: 'radial-gradient(ellipse 100% 100%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.12) 40%, rgba(139,92,246,0.04) 70%, transparent 100%)',
                                            filter: 'blur(8px)'
                                        }}
                                    ></div>

                                    <div
                                        className="absolute top-1/2 rounded-full z-5 pointer-events-none glow-breath"
                                        style={{
                                            left: `${percentage}%`,
                                            width: '40px',
                                            height: '20px',
                                            transform: 'translate(-50%, -50%)',
                                            transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            background: 'radial-gradient(ellipse 100% 100%, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0.2) 35%, rgba(139,92,246,0.08) 60%, transparent 100%)',
                                            filter: 'blur(5px)'
                                        }}
                                    ></div>

                                    <div
                                        className="absolute top-1/2 rounded-full z-10 pointer-events-none glow-pulse"
                                        style={{
                                            left: `${percentage}%`,
                                            width: '24px',
                                            height: '16px',
                                            transform: 'translate(-50%, -50%)',
                                            transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            background: 'radial-gradient(ellipse 100% 100%, rgba(196,181,253,0.8) 0%, rgba(196,181,253,0.5) 30%, rgba(167,139,250,0.2) 60%, transparent 100%)',
                                            filter: 'blur(3px)'
                                        }}
                                    ></div>
                                </div>

                                {/* Minimalist glow for mobile */}
                                <div className="md:hidden">
                                    <div
                                        className="absolute top-1/2 rounded-full z-10 pointer-events-none"
                                        style={{
                                            left: `${percentage}%`,
                                            width: '12px',
                                            height: '12px',
                                            transform: 'translate(-50%, -50%)',
                                            transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            background: 'rgba(196,181,253,0.8)',
                                            filter: 'blur(2px)',
                                            boxShadow: '0 0 4px rgba(139,92,246,0.5)'
                                        }}
                                    ></div>
                                </div>

                                <div
                                    className="absolute top-1/2 rounded-full z-15 pointer-events-none hidden md:block"
                                    style={{
                                        left: `${percentage}%`,
                                        width: '14px',
                                        height: '14px',
                                        transform: 'translate(-50%, -50%)',
                                        transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        background: 'radial-gradient(circle, transparent 30%, rgba(233,213,255,0.4) 50%, rgba(233,213,255,0.6) 60%, transparent 75%)',
                                        filter: 'blur(1px)'
                                    }}
                                ></div>

                                <div
                                    className="absolute top-1/2 rounded-full z-20 pointer-events-none"
                                    style={{
                                        left: `${percentage}%`,
                                        width: '10px',
                                        height: '10px',
                                        transform: 'translate(-50%, -50%)',
                                        transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(233,213,255,0.7) 40%, rgba(196,181,253,0.3) 70%, transparent 100%)',
                                        filter: 'blur(1.5px)'
                                    }}
                                ></div>

                                <div
                                    className="absolute top-1/2 rounded-full z-25 pointer-events-none"
                                    style={{
                                        left: `${percentage}%`,
                                        width: '5px',
                                        height: '5px',
                                        transform: 'translate(-50%, -50%)',
                                        transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        background: 'white',
                                        filter: 'blur(0.5px)',
                                        boxShadow: '0 0 3px 1px rgba(255,255,255,0.9), 0 0 6px 2px rgba(233,213,255,0.6)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="grid grid-cols-2 pt-1">
                        <div className="flex flex-col gap-1.5">
                            <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${styles.statsLabel}`}>Spent</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[15px] font-normal tabular-nums leading-none ${styles.statsValue}`}>
                                    {formatCurrency(currentData.spent)}
                                </span>

                                <span
                                    className={`percentage-badge relative overflow-hidden text-[9px] font-bold px-1 py-px rounded-[4px] border-r border-l border-b ${isDark ? 'border-white/10' : 'border-gray-200/50'} flex items-center justify-center -translate-y-0.5`}
                                    style={styles.percentageBadge}
                                >
                                    {/* Inset Top Gradient (Replacing Border) - Theme Aware */}
                                    <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${isDark ? 'bg-linear-to-b from-white/15 to-transparent' : 'bg-linear-to-b from-gray-500/20 to-transparent'} pointer-events-none`}></div>

                                    {/* Inset Side Gradients - Theme Aware */}
                                    <div className={`absolute inset-y-0 left-0 w-[3px] ${isDark ? 'bg-linear-to-r from-white/10 via-white/5 to-transparent' : 'bg-linear-to-r from-gray-400/30 via-gray-200/10 to-transparent'} pointer-events-none`}></div>
                                    <div className={`absolute inset-y-0 right-0 w-[3px] ${isDark ? 'bg-linear-to-l from-white/10 via-white/5 to-transparent' : 'bg-linear-to-l from-gray-400/30 via-gray-400/10 to-transparent'} pointer-events-none`}></div>

                                    {/* Top Shine Effect */}
                                    <div className={`absolute top-0 left-0 right-0 h-[6px] ${isDark ? 'bg-linear-to-b from-white/30 via-white/5 to-transparent' : 'bg-linear-to-b from-white/40 via-white/10 to-transparent'} pointer-events-none`}></div>
                                    
                                    <span className={`relative z-10 leading-none ${styles.percentageText}`}>{percentage}%</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
                            <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${styles.statsLabel}`}>Remaining</span>
                            <span className={`text-[15px] font-normal tabular-nums leading-none ${styles.statsValue}`}>
                                {formatCurrency(remaining)}
                            </span>
                        </div>
                    </section>

                    {/* Premium Button */}
                    <footer className="flex justify-center">
                        <button className={`${styles.buttonClass} w-auto py-2 px-6 rounded-full focus:outline-none`}>
                            <div className={isDark ? 'button-shine' : 'button-shine-light'}></div>
                            <div className={`${isDark ? 'button-inner-shadow' : 'button-inner-shadow-light'} rounded-full`}></div>
                            <span className={`${styles.buttonTextClass} text-[11px] font-semibold tracking-widest uppercase`}>View Details</span>
                        </button>
                    </footer>
                </article>
            </div>

            {/* Bottom Glow - Reduced blur on mobile */}
            <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-[100%] h-32 ${isDark ? 'bg-purple-600/5' : 'bg-purple-400/10'} blur-[50px] md:blur-[110px] -z-10`}></div>
        </div>
    );
});

interface BudgetCardShowcaseProps {
    theme?: 'dark' | 'light';
}

// Full showcase with background - Memoized to prevent re-renders when parent state changes
export const BudgetCardShowcase: React.FC<BudgetCardShowcaseProps> = memo(({ theme = 'dark' }) => {
    const isDark = theme === 'dark';

    const backgroundImage = isDark
        ? "url('https://r2.flowith.net/gemini-proxy-go/1767182681261/7bc14414-7cd2-4229-9ac6-e9099d12cb02.jpg')"
        : "url('https://r2.flowith.net/gemini-proxy-go/1767044206425/d8652e42-8edd-4ebd-aa73-3a34ffa3d336.jpg')";

    return (
        <div className={`w-full h-full ${isDark ? 'bg-[#030303]' : 'bg-[#f8f9fc]'} flex items-center justify-center p-8 relative overflow-hidden`}>

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage }}
            ></div>
            <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : ''}`}></div>

            {/* Background Effects - Reduced blur on mobile */}
            <div className={`absolute top-[-15%] right-[-10%] w-[70%] h-[70%] ${isDark ? 'bg-purple-600/8' : 'bg-purple-400/15'} rounded-full blur-[90px] md:blur-[180px]`}></div>
            <div className={`absolute bottom-[-15%] left-[-15%] w-[60%] h-[60%] ${isDark ? 'bg-blue-600/8' : 'bg-blue-400/10'} rounded-full blur-[80px] md:blur-[160px]`}></div>
            <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(#ffffff06_1px,transparent_1px)]' : 'bg-[radial-gradient(#00000008_1px,transparent_1px)]'} [background-size:40px_40px] opacity-15`}></div>

            <BudgetCard theme={theme} />
        </div>
    );
});

