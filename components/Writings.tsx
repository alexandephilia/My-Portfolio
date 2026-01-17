import { AnimatePresence, motion } from 'motion/react';
import { Bold, Code, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Loader2, PenLine, Plus, Quote, Send, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Writing } from '../types';
import { antiFlickerStyle, staggerContainerVariants, staggerItemVariants } from './animations';

const API_URL = '/api/writings';

// Portal component for modals
const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (!mounted) return null;
    return ReactDOM.createPortal(children, document.body);
};

// Slash command menu items
const SLASH_COMMANDS = [
    { id: 'h1', label: 'Heading 1', icon: Heading1, prefix: '# ', description: 'Large section heading' },
    { id: 'h2', label: 'Heading 2', icon: Heading2, prefix: '## ', description: 'Medium section heading' },
    { id: 'h3', label: 'Heading 3', icon: Heading3, prefix: '### ', description: 'Small section heading' },
    { id: 'bold', label: 'Bold', icon: Bold, prefix: '**', suffix: '**', description: 'Make text bold' },
    { id: 'italic', label: 'Italic', icon: Italic, prefix: '*', suffix: '*', description: 'Make text italic' },
    { id: 'quote', label: 'Quote', icon: Quote, prefix: '> ', description: 'Capture a quote' },
    { id: 'bullet', label: 'Bullet List', icon: List, prefix: '- ', description: 'Create a bullet list' },
    { id: 'numbered', label: 'Numbered List', icon: ListOrdered, prefix: '1. ', description: 'Create a numbered list' },
    { id: 'code', label: 'Code', icon: Code, prefix: '`', suffix: '`', description: 'Inline code snippet' },
];

// Notion-like Editor Component
interface NotionEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const NotionEditor: React.FC<NotionEditorProps> = ({ value, onChange, placeholder }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [slashFilter, setSlashFilter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    // Hint position top is transient interaction data - stored in ref to avoid re-renders
    const hintTopRef = useRef(0);
    // Force update trigger for hint position changes
    const [, forceHintUpdate] = useState(0);

    const filteredCommands = SLASH_COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(slashFilter.toLowerCase())
    );

    // Calculate hint position - called from event handlers, not useEffect
    const updateHintPosition = useCallback(() => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const cursorPos = textarea.selectionStart;
        const textBefore = value.slice(0, cursorPos);
        const linesBefore = textBefore.split('\n').length - 1;
        const lineHeight = 27;
        const newTop = linesBefore * lineHeight;
        
        if (hintTopRef.current !== newTop) {
            hintTopRef.current = newTop;
            forceHintUpdate(n => n + 1); // Trigger re-render only when position changes
        }
    }, [value]);

    // Compute hint visibility inline - derived from state, not synced via effect
    const computeHintShow = useMemo(() => {
        if (showSlashMenu) return false;
        if (!textareaRef.current) return value.length === 0;
        
        const cursorPos = textareaRef.current.selectionStart;
        const textBefore = value.slice(0, cursorPos);
        const lastNewline = textBefore.lastIndexOf('\n');
        const lineStart = lastNewline + 1;
        const nextNewline = value.indexOf('\n', lineStart);
        const lineEnd = nextNewline === -1 ? value.length : nextNewline;
        const entireLineContent = value.slice(lineStart, lineEnd);
        
        return entireLineContent.length === 0;
    }, [value, showSlashMenu]);

    const getCaretCoordinates = () => {
        if (!textareaRef.current) return { top: 0, left: 0 };
        const textarea = textareaRef.current;
        const rect = textarea.getBoundingClientRect();

        // Create a mirror div to calculate position
        const mirror = document.createElement('div');
        const style = window.getComputedStyle(textarea);
        mirror.style.cssText = `
            position: absolute; visibility: hidden; white-space: pre-wrap;
            word-wrap: break-word; overflow-wrap: break-word;
            width: ${style.width}; font: ${style.font};
            padding: ${style.padding}; line-height: ${style.lineHeight};
        `;

        const textBefore = value.slice(0, textarea.selectionStart);
        mirror.textContent = textBefore;
        const span = document.createElement('span');
        span.textContent = '|';
        mirror.appendChild(span);
        document.body.appendChild(mirror);

        const spanRect = span.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();
        document.body.removeChild(mirror);

        return {
            top: rect.top + (spanRect.top - mirrorRect.top) + 24,
            left: rect.left + (spanRect.left - mirrorRect.left)
        };
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showSlashMenu) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    insertCommand(filteredCommands[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowSlashMenu(false);
                setSlashFilter('');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart;
        onChange(newValue);

        // Check for slash command trigger - works anywhere in text
        const textBefore = newValue.slice(0, cursorPos);
        // Find the last slash that could be a command trigger (after space, newline, or at start)
        const slashMatch = textBefore.match(/(?:^|[\s])\/([a-zA-Z0-9]*)$/);

        if (slashMatch) {
            const filter = slashMatch[1] || '';
            setSlashFilter(filter);
            setShowSlashMenu(true);
            setSelectedIndex(0);
            setSlashMenuPosition(getCaretCoordinates());
        } else {
            setShowSlashMenu(false);
            setSlashFilter('');
        }
    };

    const insertCommand = (command: typeof SLASH_COMMANDS[0]) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const cursorPos = textarea.selectionStart;
        const textBefore = value.slice(0, cursorPos);
        const textAfter = value.slice(cursorPos);

        // Find the slash position - could be after space or at line start
        const slashMatch = textBefore.match(/(?:^|[\s])\/([a-zA-Z0-9]*)$/);
        if (!slashMatch) return;

        // Calculate where the slash starts (accounting for potential space before it)
        const matchStart = textBefore.length - slashMatch[0].length;
        const hasSpaceBefore = slashMatch[0].startsWith(' ') || slashMatch[0].startsWith('\n') || slashMatch[0].startsWith('\t');
        const slashStart = hasSpaceBefore ? matchStart + 1 : matchStart;
        const beforeSlash = value.slice(0, slashStart);

        let newText: string;
        let newCursorPos: number;

        if (command.suffix) {
            // Wrap-style command (bold, italic, code)
            newText = beforeSlash + command.prefix + command.suffix + textAfter;
            newCursorPos = beforeSlash.length + command.prefix.length;
        } else {
            // Prefix-style command (headings, lists, quotes)
            newText = beforeSlash + command.prefix + textAfter;
            newCursorPos = beforeSlash.length + command.prefix.length;
        }

        onChange(newText);
        setShowSlashMenu(false);
        setSlashFilter('');

        // Set cursor position after state update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="relative">
            {/* Placeholder hint that follows cursor to empty lines */}
            {computeHintShow && (
                <div
                    ref={overlayRef}
                    className="absolute pointer-events-none text-gray-300 text-[15px] leading-[1.8]"
                    style={{ top: hintTopRef.current }}
                >
                    {placeholder}
                </div>
            )}

            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onSelect={updateHintPosition}
                onClick={updateHintPosition}
                className="w-full min-h-[300px] outline-none text-[15px] md:text-[15px] text-[16px] leading-[1.8] text-gray-800 resize-none bg-transparent"
                style={{ caretColor: '#111', fontSize: '16px' }}
            />

            {/* Slash command menu */}
            {showSlashMenu && filteredCommands.length > 0 && (
                <div
                    className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[300] min-w-[220px] max-h-[300px] overflow-y-auto overscroll-contain touch-pan-y"
                    style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
                    onTouchMove={(e) => e.stopPropagation()}
                    onWheel={(e) => {
                        const target = e.currentTarget;
                        const isAtTop = target.scrollTop === 0;
                        const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight;

                        // Prevent scroll propagation when at boundaries
                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                    }}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Formatting
                    </div>
                    {filteredCommands.map((cmd, index) => (
                        <button
                            key={cmd.id}
                            onClick={() => insertCommand(cmd)}
                            className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <cmd.icon size={16} className="text-gray-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{cmd.label}</div>
                                <div className="text-xs text-gray-400">{cmd.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Markdown renderer with custom style
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,

                p: ({ children }) => <p className="text-gray-700 leading-[1.8] mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-600">{children}</blockquote>
                ),
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
                    }
                    return (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4">
                            <code className="text-sm font-mono">{children}</code>
                        </pre>
                    );
                },
                a: ({ href, children }) => (
                    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => <hr className="my-6 border-gray-200" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export const Writings: React.FC = () => {
    const [writings, setWritings] = useState<Writing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminKey, setAdminKey] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);
    const [inspirationalQuote, setInspirationalQuote] = useState<string | null>(null);

    // Fetch random quote when editor opens
    useEffect(() => {
        if (showAddForm) {
            // Always fetch a new quote when modal opens
            setInspirationalQuote(null);
            fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random')
                .then(res => res.json())
                .then(data => {
                    if (data[0]?.q) {
                        setInspirationalQuote(data[0].q);
                    }
                })
                .catch(() => {
                    // Fallback quotes if API fails
                    const fallbacks = [
                        "Start writing, no matter what.",
                        "The first draft is just you telling yourself the story.",
                        "Write what should not be forgotten.",
                        "There is no greater agony than bearing an untold story inside you.",
                        "You can always edit a bad page. You can't edit a blank page.",
                        "Start where you are. Use what you have. Do what you can.",
                    ];
                    setInspirationalQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
                });
        }
    }, [showAddForm]);

    // Locked scroll logic
    useEffect(() => {
        if (!showAddForm && !selectedWriting) return;

        const scrollY = window.scrollY;
        // Lock body
        const originalStyle = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            top: document.body.style.top,
            width: document.body.style.width
        };

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
             // Unlock
            document.body.style.overflow = originalStyle.overflow;
            document.body.style.position = originalStyle.position;
            document.body.style.top = originalStyle.top;
            document.body.style.width = originalStyle.width;
            window.scrollTo(0, scrollY);
        };
    }, [showAddForm, selectedWriting]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const key = params.get('key');
        if (key) {
            setAdminKey(key);
            setIsAdmin(true);
            sessionStorage.setItem('adminKey', key);
            window.history.replaceState({}, '', window.location.pathname);
        } else {
            const storedKey = sessionStorage.getItem('adminKey');
            if (storedKey) {
                setAdminKey(storedKey);
                setIsAdmin(true);
            }
        }
    }, []);

    useEffect(() => {
        fetchWritings();
    }, []);

    const fetchWritings = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setWritings(data);
        } catch (err) {
            // Silently fail for non-admin users - just show empty state
            setWritings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey}`,
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError('Invalid admin key');
                    setIsAdmin(false);
                    return;
                }
                throw new Error('Failed to create');
            }

            const newWriting = await res.json();
            setWritings(prev => [newWriting, ...prev]);
            setNewTitle('');
            setNewContent('');
            setShowAddForm(false);
        } catch (err) {
            setError('Failed to add writing');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this writing?')) return;

        try {
            const res = await fetch(API_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey}`,
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error('Failed to delete');
            setWritings(prev => prev.filter(w => w.id !== id));
            if (selectedWriting?.id === id) setSelectedWriting(null);
        } catch (err) {
            setError('Failed to delete writing');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const getPreview = (content: string) => {
        return content
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/>\s/g, '')
            .slice(0, 200);
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-10 flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10" style={antiFlickerStyle}>
            {/* Header */}
            <motion.div
                variants={staggerContainerVariants}
                className="flex items-center justify-between mb-8"
            >
                <div className="flex flex-col">
                    <motion.h2 variants={staggerItemVariants} className="text-2xl font-serif text-gray-900 italic">Writings</motion.h2>
                    <motion.p variants={staggerItemVariants} className="text-xs text-gray-400 mt-1">Thoughts, ideas, and reflections</motion.p>
                </div>
                {isAdmin && (
                    <motion.button
                        variants={staggerItemVariants}
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-medium transition-transform bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-[0_3px_6px_rgba(0,0,0,0.25)] active:shadow-sm active:translate-y-[1px]"
                    >
                        <Plus size={14} />
                        New Writing
                    </motion.button>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
                </div>
            )}

            {/* Add Form Modal - Notion Style */}
            <Portal>
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-start justify-center pt-[5vh] md:pt-[10vh] px-4 overflow-y-auto overscroll-contain touch-none"
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl mb-10 rounded-[24px] p-[3px] border-[3px] border-white/50"
                                style={{
                                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)',
                                    boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                                }}
                            >
                                <form
                                    onSubmit={handleSubmit}
                                    data-modal-content
                                    className="bg-white rounded-[20px] w-full overflow-hidden"
                                >
                                    {/* Title Input */}
                                    <div className="px-8 pt-8">
                                        <input
                                            type="text"
                                            placeholder="Untitled"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full text-3xl md:text-4xl font-bold text-gray-900 placeholder-gray-300 outline-none border-none bg-transparent"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Content Editor */}
                                    <div className="px-8 py-6">
                                        <NotionEditor
                                            value={newContent}
                                            onChange={setNewContent}
                                            placeholder="Start writing, or press '/' for commands..."
                                        />
                                    </div>

                                    {/* Footer with styled buttons */}
                                    <div className="flex flex-col gap-3 px-8 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                                        <div className="text-xs text-gray-400 italic leading-relaxed">
                                            {inspirationalQuote
                                                ? `"${inspirationalQuote}"`
                                                : "Loading inspiration..."
                                            }
                                        </div>
                                        <div className="flex gap-3 justify-end flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2 rounded-lg text-xs font-medium transition-transform bg-gradient-to-b from-white to-gray-100 border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] text-gray-600 hover:text-gray-900 hover:shadow-[0_3px_6px_rgba(0,0,0,0.08)] active:shadow-sm active:translate-y-[1px]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-transform bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-[0_3px_6px_rgba(0,0,0,0.25)] active:shadow-sm active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Send size={14} />
                                                )}
                                                Publish
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>

            {/* Reading Modal */}
            <Portal>
                <AnimatePresence>
                    {selectedWriting && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-start justify-center pt-[5vh] md:pt-[10vh] px-4 overflow-y-auto overscroll-contain"
                            onClick={() => setSelectedWriting(null)}
                            onTouchMove={(e) => {
                                // Allow scrolling within the modal content
                                const target = e.target as HTMLElement;
                                if (!target.closest('article')) {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl mb-10 rounded-[24px] p-[4px]"
                                style={{
                                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)',
                                    boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 10px, rgba(0, 0, 0, 0.05) 0px 4px 4px'
                                }}
                            >
                                <article
                                    data-modal-content
                                    className="bg-white rounded-[20px] w-full overflow-hidden"
                                >
                                    <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900 leading-tight">
                                                    {selectedWriting.title}
                                                </h1>
                                                <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
                                                    <span>{formatDate(selectedWriting.createdAt)}</span>
                                                    <span>·</span>
                                                    <span>{getReadingTime(selectedWriting.content)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedWriting(null)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                            >
                                                <X size={20} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-8 py-8">
                                        <MarkdownContent content={selectedWriting.content} />
                                    </div>
                                </article>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>

            {/* Writings List */}
            {writings.length === 0 ? (
                <div className="text-center py-20">
                    <PenLine className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">No writings yet</p>
                </div>
            ) : (
                <motion.div
                    variants={staggerContainerVariants}
                    className="space-y-6"
                >
                    {writings.map((writing, index) => (
                        <motion.article
                            key={writing.id}
                            variants={staggerItemVariants}
                            onClick={() => setSelectedWriting(writing)}
                            className="group cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-3xl md:text-4xl font-serif italic text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
                                        {writing.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                        <span>{formatDate(writing.createdAt)}</span>
                                        <span>·</span>
                                        <span>{getReadingTime(writing.content)}</span>
                                    </div>
                                    <div className="relative mt-3">
                                        <div className="text-sm text-gray-500 leading-relaxed line-clamp-2 prose prose-sm prose-gray max-w-none">
                                            <MarkdownContent content={writing.content.slice(0, 300)} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                                        Read more <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                    </span>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDelete(writing.id, e)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            {index < writings.length - 1 && (
                                <div className="border-b border-dashed border-gray-200 mt-6" />
                            )}
                        </motion.article>
                    ))}
                </motion.div>
            )}
        </div>
    );
};
