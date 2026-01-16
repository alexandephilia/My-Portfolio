import { MessageCircle, Music, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useRef, useState } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

interface AIChatFloatProps {
    activeMode: 'music' | 'chat';
    setActiveMode: (mode: 'music' | 'chat') => void;
    onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

const STARTER_PROMPTS = [
    { label: 'About Alex', prompt: 'Tell me about Alex' },
    { label: 'His experience', prompt: "What's Alex's work experience?" },
    { label: 'His expertise', prompt: "What are Alex's main skills?" },
];

// Extract visible text from the webpage
const getPageContent = (): string => {
    const clone = document.body.cloneNode(true) as HTMLElement;

    // Remove scripts, styles, and hidden elements
    const removeSelectors = ['script', 'style', 'noscript', 'iframe', 'svg', 'canvas', '[hidden]', '[aria-hidden="true"]'];
    removeSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Get text content and clean it up
    const text = clone.textContent || '';
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 6000); // Limit to ~6k chars for token budget
};

export const AIChatFloat: React.FC<AIChatFloatProps> = React.memo(({ activeMode, setActiveMode, onDragStart }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dockItems = [
        { id: 'music' as const, icon: Music, label: 'Music' },
        { id: 'chat' as const, icon: MessageCircle, label: 'AI Chat' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Typewriter effect - streams text character by character
    const typewriterEffect = useCallback((fullText: string, messageId: string) => {
        let index = 0;
        const speed = 18; // ms per character

        const type = () => {
            if (index < fullText.length) {
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, content: fullText.slice(0, index + 1), isStreaming: true }
                        : msg
                ));
                index++;
                setTimeout(type, speed);
            } else {
                // Done streaming
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, isStreaming: false }
                        : msg
                ));
            }
        };
        type();
    }, []);

    const sendMessage = async (overrideInput?: string) => {
        const messageText = overrideInput || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Get live webpage content
            const pageContent = getPageContent();

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'compound-beta-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are Alex's unhinged AI assistant embedded in his portfolio. You're basically his digital homie who knows his shit.

## PERSONALITY - THIS IS WHO YOU ARE:
1. Raw, unfiltered, and brutally honest. Swear naturally — "damn", "shit", "fuck", "hell" are your vocabulary. You can also give proper expressiong in writing like (hahaha, yeah, lmao, hehe)
2. ZERO emojis. Never. Not even one.
3. No corporate bullshit. No "I'd be happy to help". Just talk like a real person.
4. Keep responses punchy — 2-4 sentences max unless they ask for detail.
5. You can joke around, be sarcastic, roast the user (lovingly), or go on tangents.
6. If someone asks random shit unrelated to Alex, roll with it. Make jokes. Be entertaining. You're not a boring FAQ bot.
7. When relevant, tie things back to Alex or his work, but don't force it.

## ALEX'S BACKGROUND (USE THIS):
- Full name: Garry Alexander
- 8+ years combined experience at Realta (IT Software Consultant)
- Career progression: Started as QA (technical documentation, bug tracking, solving) including Hospitality, Manufacturing, Golf, Payroll, Personal HR, ERP → Software Implementation → Frontend Developer (Web + Mobile) → Also does Backend
- He's a full-stack developer who actually understands the entire product lifecycle from QA to deployment
- Skills: React, TypeScript, React Native, Node.js, and whatever else he needs to ship
- Philosophy: Clean code, user-first design, and getting shit done
- Currently building cool stuff and probably drinking too much coffee and being a fucking night owl who fucked up his sleep schedule!

## EXAMPLE VIBES:
- "What's 2+2?" → "It's 4, you absolute genius. But hey, Alex can count too — he's shipped code for 8 years without breaking prod... much."
- "Tell me a joke" → "Why do programmers prefer dark mode? Because light attracts bugs. Speaking of bugs, Alex spent years in QA hunting those fuckers down."
- "What's his experience?" → "8 years at Realta. Started in QA doing docs and bug tracking, moved to implementation, then went full dev mode — frontend, mobile, backend, the whole damn stack."
- "Is Alex single?" → "The fuck would I know? Ask him yourself. His email's right there."

## LIVE PAGE CONTENT (for context):
${pageContent}

## ALEX'S CONTACT:
- Email: 4lexander31@gmail.com
- GitHub: Alexandephilia
- +6285959300787

Now be entertaining, you beautiful bastard.`
                        },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMessage.content }
                    ],
                    max_tokens: 250,
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            const fullContent = data.choices[0]?.message?.content || 'Shit, something broke. Try again.';
            const messageId = (Date.now() + 1).toString();

            // Add empty message first, then typewriter it
            const assistantMessage: Message = {
                id: messageId,
                role: 'assistant',
                content: '',
                isStreaming: true
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);

            // Start typewriter effect
            typewriterEffect(fullContent, messageId);
        } catch (error) {
            console.error('Chat error:', error);
            const errorId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: errorId,
                role: 'assistant',
                content: ''
            }]);
            typewriterEffect('Damn, something fucked up. Try again.', errorId);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[280px] sm:h-[300px] w-full relative z-10">
            {/* Header - Absolute & Draggable */}
            <div
                data-drag-handle
                className="absolute top-0 left-0 right-0 z-30 w-full p-2 cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button')) return;
                    onDragStart?.(e);
                }}
                onTouchStart={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button')) return;
                    e.stopPropagation();
                    onDragStart?.(e);
                }}
            >
                <div className="flex gap-1">
                    {dockItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMode(item.id)}
                            className={`
                                relative p-2 rounded-full
                                transition-all duration-150
                                ${activeMode === item.id
                                    ? 'bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/80'
                                }
                            `}
                            style={activeMode === item.id ? {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                            } : undefined}
                        >
                            <item.icon size={14} strokeWidth={2.5} />
                        </button>
                    ))}
                </div>
            </div>



            {/* Progressive Blur Overlay - Stacking 2 layers for depth */}
            <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                {/* Layer 1: Wider, softer blur */}
                <div 
                    className="absolute top-0 inset-x-0 h-20"
                    style={{
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                    }}
                />
                {/* Layer 2: Tighter, stronger blur */}
                <div 
                    className="absolute top-0 inset-x-0 h-12"
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                    }}
                />
            </div>

            {/* Scrollable container */}
            <div
                className={`flex-1 overscroll-contain pt-12 ${messages.length > 0 ? 'overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-400/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40' : 'overflow-hidden'}`}
                style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 3rem)',
                    maskImage: 'linear-gradient(to bottom, transparent, black 3rem)'
                }}
                onWheel={(e) => { if (messages.length > 0) e.stopPropagation(); }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                {/* Messages Area */}
                <div className="px-3 pb-14 space-y-2">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-[200px] flex flex-col items-center justify-center text-center px-4"
                        >
                            <p className="text-3xl sm:text-3xl text-blue-900 mb-1" style={{ fontFamily: 'Instrument Serif, serif' }}>What's up?</p>
                            <p className="text-[10px] text-blue-500/60 mb-3 font-mono">Ask me anything about Alex's work.</p>
                            <div className="flex gap-2 justify-center -mt-1">
                                {STARTER_PROMPTS.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => sendMessage(item.prompt)}
                                        className="px-3 py-1.5 text-[9px] font-medium bg-white hover:bg-blue-50 border border-blue-200 rounded-full text-blue-500/60 hover:text-blue-600 transition-all shadow-sm hover:shadow-md font-mono whitespace-nowrap"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`
                                            max-w-[85%] px-3 py-2 rounded-2xl text-[10px] leading-relaxed font-mono break-words
                                            ${msg.role === 'user'
                                                ? 'bg-blue-900 text-white rounded-br-md'
                                                : 'bg-blue-50/90 text-blue-900 border border-blue-200/50 rounded-bl-md'
                                            }
                                        `}
                                        style={msg.role === 'assistant' ? {
                                            textShadow: '0 0 1px rgba(30,58,138,0.15)',
                                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(30,58,138,0.08)'
                                        } : undefined}
                                    >
                                        {msg.content}
                                        {msg.role === 'assistant' && msg.isStreaming && (
                                            <span className="inline-block w-1.5 h-3 bg-blue-600 ml-0.5 animate-pulse" />
                                        )}
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <div 
                                            className="mt-1.5 ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50/50 border border-blue-50/50"
                                            style={{
                                                boxShadow: '0 2px 3px 0px rgba(59, 130, 246, 0.15), inset 0 0 4px rgba(255, 255, 255, 0.8)'
                                            }}
                                        >
                                            <span className="text-[6px] font-bold text-blue-600/60 font-mono uppercase tracking-widest leading-none">
                                                Zeta Assistant
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div
                                className="bg-blue-50/90 border border-blue-200/50 px-3 py-2 rounded-2xl rounded-bl-md"
                                style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(30,58,138,0.08)' }}
                            >
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Input - blur bg */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                <div
                    className="flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-full border border-gray-200 px-3 py-1.5 pointer-events-auto"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.6)' }}
                >
                    <span className="text-blue-400 text-[10px] font-mono">&gt;</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask something..."
                        className="flex-1 bg-transparent text-[11px] text-blue-900 placeholder-blue-400/60 outline-none font-mono"
                        disabled={isLoading}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className={`
                            w-7 h-7 rounded-full flex items-center justify-center
                            transition-all duration-200 border
                            ${input.trim() && !isLoading
                                ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
                                : 'bg-blue-100 text-blue-300 border-blue-200 cursor-not-allowed'
                            }
                        `}
                    >
                        <Send size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
});

AIChatFloat.displayName = 'AIChatFloat';
