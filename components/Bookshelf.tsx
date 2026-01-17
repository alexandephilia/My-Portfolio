import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { floatingTopStaggerItemVariants, staggerContainerVariants } from './animations';

// Hook to detect touch device
const useIsTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();
    }, []);

    return isTouch;
};

// Interactive 3D BookCard Component
interface BookCardProps {
    book: Book;
    onSelect?: (book: Book) => void;
    isActive: boolean;
    onActivate: (id: number | null) => void;
    isTouchDevice: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, isActive, onActivate, isTouchDevice }) => {
    const thickness = 32; // px
    const [isHovered, setIsHovered] = useState(false);

    // On touch devices: use active state (tap to toggle)
    // On desktop: use hover state only
    const isFloating = isTouchDevice ? isActive : isHovered;

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        // Only handle click/tap on touch devices
        if (!isTouchDevice) return;

        e.stopPropagation();
        if (isActive) {
            onActivate(null);
        } else {
            onActivate(book.id);
        }
        onSelect?.(book);
    };

    return (
        <div
            className={`relative w-[90px] md:w-[140px] aspect-2/3 flex flex-col items-center group/book perspective-[1000px] z-0 transition-transform duration-300 ${isFloating ? 'z-50' : ''} ${isActive ? 'is-active' : ''}`}
            onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
            onClick={handleClick}
        >
            <motion.div
                layoutId={`book-card-${book.id}`}
                className="relative w-full h-full cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateY: 0, z: 0, y: 0, rotateX: 0 }}
                animate={{
                    rotateY: isFloating ? -20 : 0,
                    rotateX: isFloating ? 5 : 0,
                    z: isFloating ? 30 : 0,
                    y: isFloating ? -15 : 0,
                }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* FRONT COVER */}
                <div
                    className="absolute inset-0 z-20"
                    style={{
                        transform: `translateZ(${thickness / 2}px)`,
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <motion.div
                        layoutId={`book-cover-wrapper-${book.id}`}
                        className="w-full h-full rounded-[1px] overflow-hidden bg-white relative"
                        style={{
                            boxShadow: 'inset 2px 0 4px rgba(255,255,255,0.4), inset -2px 0 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <motion.img
                            layoutId={`book-image-${book.id}`}
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Spine Groove Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-linear-to-r from-black/20 to-transparent z-30 mix-blend-multiply" />
                        <div className="absolute left-[3px] top-0 bottom-0 w-px bg-white/30 z-30" />

                        {/* Surface Sheen */}
                        <div className="absolute inset-0 bg-linear-to-tr from-white/20 via-transparent to-black/10 pointer-events-none mix-blend-overlay" />

                        {/* Hover/Active Highlight */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/book:opacity-100 group-[.is-active]/book:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                </div>

                {/* SPINE (Left Side) */}
                <div
                    className="absolute top-0 bottom-0 bg-stone-800"
                    style={{
                        width: `${thickness}px`,
                        left: `-${thickness / 2}px`,
                        transform: `rotateY(-90deg)`,
                        transformOrigin: 'center',
                        backgroundColor: book.color,
                    }}
                >
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center border-l border-white/10 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.3)]">
                        <span className="text-[9px] md:text-[10px] text-white/90 font-serif font-bold uppercase tracking-widest rotate-90 whitespace-nowrap opacity-90 drop-shadow-md">
                            {book.author.split(' ').slice(-1)[0]}
                        </span>
                    </div>
                </div>

                {/* PAGES (Right Side) */}
                <div
                    className="absolute top-0 bottom-0 bg-[#f8f5f2]"
                    style={{
                        width: `${thickness}px`,
                        right: `-${thickness / 2}px`,
                        transform: `rotateY(90deg)`,
                        transformOrigin: 'center',
                        backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                        backgroundSize: '3px 100%'
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-l from-black/10 to-transparent"></div>
                </div>

                {/* PAGES (Top) */}
                <div
                    className="absolute left-0 w-full bg-[#f8f5f2]"
                    style={{
                        height: `${thickness}px`,
                        top: `-${thickness / 2}px`,
                        transform: `rotateX(90deg)`,
                        transformOrigin: 'center',
                        backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                        backgroundSize: '100% 3px'
                    }}
                />

                {/* PAGES (Bottom) */}
                <div
                    className="absolute left-0 w-full bg-[#f8f5f2]"
                    style={{
                        height: `${thickness}px`,
                        bottom: `-${thickness / 2}px`,
                        transform: `rotateX(-90deg)`,
                        transformOrigin: 'center',
                    }}
                />

                {/* BACK COVER */}
                <div
                    className="absolute inset-0 bg-[#e7e5e4]"
                    style={{
                        transform: `translateZ(-${thickness / 2}px) rotateY(180deg)`
                    }}
                >
                    <div className="w-full h-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
                </div>

            </motion.div>

            {/* Dynamic Box Shadow on Shelf */}
            <div
                className="absolute -bottom-6 w-[80%] h-4 bg-black/40 blur-md rounded-[50%] opacity-0 group-hover/book:opacity-60 group-[.is-active]/book:opacity-60 transition-opacity duration-300"
                style={{ filter: 'blur(8px)' }}
            />
        </div>
    );
};

// Bookshelf Data - using images from public/books folder
const BOOKS: Book[] = [
    {
        id: 1,
        title: "Design Engineering",
        author: "Garry Alexander",
        coverUrl: "/books/book_1.jpg",
        color: "#2563EB",
        spineText: "DESIGN ENGINEERING"
    },
    {
        id: 2,
        title: "The Art of Code",
        author: "Clean Architecture",
        coverUrl: "/books/book_2.jpg",
        color: "#DC2626",
        spineText: "THE ART OF CODE"
    },
    {
        id: 3,
        title: "Future Interfaces",
        author: "Human Computer",
        coverUrl: "/books/book_3.jpg",
        color: "#059669",
        spineText: "FUTURE INTERFACES"
    },
    {
        id: 4,
        title: "Spatial Computing",
        author: "XR Dynamics",
        coverUrl: "/books/book_4.jpg",
        color: "#7C3AED",
        spineText: "SPATIAL COMPUTING"
    },
    {
        id: 5,
        title: "Creative AI",
        author: "Generative Art",
        coverUrl: "/books/book_5.jpg",
        color: "#DB2777",
        spineText: "CREATIVE AI"
    },
    {
        id: 6,
        title: "System Design",
        author: "Architecture",
        coverUrl: "/books/book_6.jpg",
        color: "#0891B2",
        spineText: "SYSTEM DESIGN"
    },
];

export const Bookshelf: React.FC = () => {
    // Split books into two rows (3:3)
    const topShelfBooks = BOOKS.slice(0, 3);
    const bottomShelfBooks = BOOKS.slice(3, 6);
    const [activeBookId, setActiveBookId] = useState<number | null>(null);
    const isTouchDevice = useIsTouchDevice();

    // Click outside to deactivate (only needed for touch devices)
    useEffect(() => {
        if (!isTouchDevice) return;

        const handleClickOutside = () => {
            if (activeBookId !== null) {
                setActiveBookId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [activeBookId, isTouchDevice]);

    const ShelfBase = () => (
        <div className="w-full max-w-[700px] h-[20px] bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg -mt-4 shadow-[0_9px_15px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center relative z-0">
            <div className="w-full h-[2px] bg-gray-300/50" />
        </div>
    );

    return (
        <div className="w-full py-12 flex flex-col items-center justify-center gap-16">

            {/* Top Shelf (3 Books) */}
            <div className="flex flex-col items-center">
                <motion.div
                    variants={staggerContainerVariants}
                    className="flex flex-wrap justify-center gap-2 md:gap-20 perspective-[1000px] px-2 md:px-4 mb-4"
                >
                    {topShelfBooks.map((book) => (
                        <motion.div key={book.id} variants={floatingTopStaggerItemVariants}>
                            <BookCard
                                book={book}
                                isActive={activeBookId === book.id}
                                onActivate={setActiveBookId}
                                isTouchDevice={isTouchDevice}
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <ShelfBase />
            </div>

            {/* Bottom Shelf (3 Books) */}
            <div className="flex flex-col items-center">
                <motion.div
                    variants={staggerContainerVariants}
                    className="flex flex-wrap justify-center gap-2 md:gap-20 perspective-[1000px] px-2 md:px-4 mb-4"
                >
                    {bottomShelfBooks.map((book) => (
                        <motion.div key={book.id} variants={floatingTopStaggerItemVariants}>
                            <BookCard
                                book={book}
                                isActive={activeBookId === book.id}
                                onActivate={setActiveBookId}
                                isTouchDevice={isTouchDevice}
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <ShelfBase />
            </div>

        </div>
    );
};
