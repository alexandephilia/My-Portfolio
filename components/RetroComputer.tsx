import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

const customStyles: Record<string, React.CSSProperties> = {
  scene: {
    position: 'relative',
    transformStyle: 'preserve-3d',
    transform: 'rotateY(-15deg) rotateX(5deg)',
    transition: 'transform 0.5s ease-out',
  },
  sceneHover: {
    transform: 'rotateY(-5deg) rotateX(2deg)',
  },
  computerUnit: {
    position: 'relative',
    width: '300px',
    height: '440px',
    transformStyle: 'preserve-3d',
  },
  face: {
    position: 'absolute',
    background: '#E0DCCF',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  front: {
    width: '360px',
    height: '440px',
    left: '0px', // Center relative to 300px container
    transform: 'translateZ(100px)',
    background: 'linear-gradient(135deg, #F0EDE0 0%, #E0DCCF 100%)',
    boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.8), inset -5px -5px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
    position: 'absolute',
  },
  back: {
    width: '360px',
    height: '440px',
    transform: 'translateZ(-100px) rotateY(180deg)',
    background: '#C4C0B3',
    position: 'absolute',
  },
  left: {
    width: '200px',
    height: '440px',
    transform: 'rotateY(-90deg) translateZ(100px)',
    background: '#E0DCCF',
    boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.05)',
    position: 'absolute',
  },
  right: {
    width: '200px',
    height: '440px',
    transform: 'rotateY(90deg) translateZ(260px)',
    background: '#C4C0B3',
    boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.1)',
    position: 'absolute',
  },
  top: {
    width: '360px',
    height: '200px',
    transform: 'rotateX(90deg) translateZ(0)',
    background: '#eeeae1',
    position: 'absolute',
  },
  bottom: {
    width: '360px',
    height: '200px',
    transform: 'rotateX(-90deg) translateZ(340px)',
    background: '#A09C8F',
    boxShadow: '0 50px 80px rgba(0,0,0,0.3)',
    position: 'absolute',
  },
  screenInset: {
    width: '280px',
    height: '220px',
    background: '#D1CEC7',
    borderRadius: '16px',
    boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.2), inset -2px -2px 8px rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
    position: 'relative',
  },
  crt: {
    width: '260px',
    height: '200px',
    background: '#888', // Classic grey desktop
    borderRadius: '1px 2px 20px 20px / 2px 2px 10px 10px', // Flattened top edge
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
  },
  crtGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    zIndex: 2,
    color: '#fff',
    fontFamily: "'VT323', monospace",
    fontSize: '14px',
    textShadow: '0 0 2px rgba(255,255,255,0.5)',
    borderRadius: '1px 2px 20px 20px / 2px 2px 10px 10px',
  },
  floppySlot: {
    width: '140px',
    height: '12px',
    background: '#333',
    borderRadius: '6px',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)',
    marginLeft: '100px',
    position: 'relative',
  },
  logoBadge: {
    position: 'absolute',
    bottom: '40px',
    left: '25px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerClaude: {
    position: 'absolute',
    zIndex: 5,
    width: '50px',
    height: '50px',
    bottom: '82px',
    left: '15px',
    transform: 'translateZ(101px) rotate(-10deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerStar: {
    position: 'absolute',
    zIndex: 5,
    width: '40px',
    height: '40px',
    bottom: '82px',
    left: '62px',
    transform: 'translateZ(102px) rotate(15deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerText: {
    position: 'absolute',
    zIndex: 5,
    boxShadow: '1px 1px 1px rgba(0,0,0,0.3)',
    width: '60px',
    height: '30px',
    background: '#F5F5DC',
    color: '#000000',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '11px',
    lineHeight: 1.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    bottom: '100px',
    right: '100px',
    transform: 'translateZ(101px) rotate(-2deg)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  grill: {
    position: 'absolute',
    bottom: '25px',
    right: '25px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2px',
    width: '30px',
    height: '20px',
  },
  vent: {
    background: '#333',
    borderRadius: '1px',
    boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.5)',
  },
  keyboardAssembly: {
    position: 'absolute',
    width: '360px',
    height: '140px',
    bottom: '-118px',
    left: '-30px',
    transformStyle: 'preserve-3d',
    transformOrigin: 'top center',
    transform: 'translateZ(164px) rotateX(66deg)',
  },
  kbBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#E0DCCF',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5), inset -5px -5px 15px rgba(0,0,0,0.1)',
    transform: 'translateZ(9px)',
    overflow: 'hidden',
  },
  kbFront: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '18px',
    bottom: 0,
    background: 'linear-gradient(180deg, #cdc9bb 0%, #b5b1a3 100%)',
    transformOrigin: 'bottom center',
    transform: 'translateZ(9px) rotateX(90deg)',
  },
  kbBack: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '18px',
    top: 0,
    background: 'linear-gradient(180deg, #e5e1d4 0%, #c9c5b8 100%)',
    transformOrigin: 'top center',
    transform: 'translateZ(9px) rotateX(-90deg)',
  },
  kbLeft: {
    position: 'absolute',
    top: 0,
    width: '18px',
    height: '100%',
    left: 0,
    background: 'linear-gradient(180deg, #d1cdbf 0%, #b7b3a6 100%)',
    transformOrigin: 'left center',
    transform: 'translateZ(9px) rotateY(90deg)',
  },
  kbRight: {
    position: 'absolute',
    top: 0,
    width: '18px',
    height: '100%',
    right: 0,
    background: 'linear-gradient(180deg, #d1cdbf 0%, #b7b3a6 100%)',
    transformOrigin: 'right center',
    transform: 'translateZ(9px) rotateY(-90deg)',
  },
  keysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '6px',
    padding: '15px',
    transform: 'translateZ(8px)',
    transformStyle: 'preserve-3d',
  },
  key: {
    height: '27px',
    background: '#ECE8DA',
    borderRadius: '4px',
    boxShadow: '0 6px 0 #C4C0B3, 0 8px 7px rgba(0,0,0,0.2)',
    transform: 'translateZ(1px)',
  },
  crtUi: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    width: '30%',
    borderRight: '1px solid rgba(255,255,255,0.2)',
    padding: '10px',
    fontSize: '9px',
    color: '#ccc',
  },
  mainArea: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  menuBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '18px', // Proportional height
    background: '#fff',
    borderBottom: '1px solid #000',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    fontSize: '9px', // Chicago-like size
    fontWeight: 'bold',
    color: '#000',
    gap: '12px',
    zIndex: 10,
  },
  window: {
    background: '#fff',
    color: '#000',
    border: '1px solid #000',
    marginTop: '40px', // More space below the taller menu bar
    width: '130px', // Consistent stable width
    marginRight: 'auto',
    marginLeft: 'auto',
    boxShadow: '1px 1px 0 rgba(0,0,0,1)',
    fontFamily: "'VT323', monospace",
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  windowHeader: {
    height: '12px',
    borderBottom: '1px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)',
    padding: '0 4px',
  },
  closeBox: {
    position: 'absolute',
    left: '4px',
    width: '7px',
    height: '7px',
    border: '1px solid #000',
    background: '#fff',
  },
  windowTitle: {
    fontSize: '8px',
    fontWeight: 'bold',
    background: '#fff',
    padding: '0 4px',
    lineHeight: '10px',
  },
  desktopIcon: {
    position: 'absolute',
    right: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    width: '32px',
  },
  iconGraphic: {
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2px',
  },
  iconLabel: {
    fontSize: '8px',
    fontWeight: 'bold',
    padding: '0 2px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    color: '#000',
    background: 'rgba(255,255,255,0.8)', // Slight background for readability
    marginTop: '2px',
  },
  iconList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  iconItem: {
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  iconCircle: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#555',
    flexShrink: 0,
  },
  iconCircleBlue: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#468CCF',
    flexShrink: 0,
  },
  iconCircleOrange: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#E57D25',
    flexShrink: 0,
  },
  typingContainer: {
    fontFamily: "'VT323', monospace",
    fontSize: '12px',
    lineHeight: 1.2,
    color: '#333',
  },
  cursor: {
    display: 'inline-block',
    width: '8px',
    height: '15px',
    background: '#fff',
    verticalAlign: 'middle',
  },
};

export const RetroComputer: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [typeText, setTypeText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const typeIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(false);

  const fullText = "Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things different..";

  // Pause all timers when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // Resume cursor blink
          if (!cursorIntervalRef.current) {
            cursorIntervalRef.current = setInterval(() => setCursorVisible(v => !v), 500);
          }
        } else {
          // Pause cursor blink
          if (cursorIntervalRef.current) {
            clearInterval(cursorIntervalRef.current);
            cursorIntervalRef.current = null;
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const typeWriter = () => {
      if (!isVisibleRef.current) {
        // Retry after a short delay when not visible
        timeoutRef.current = setTimeout(typeWriter, 500);
        return;
      }
      if (typeIndexRef.current < fullText.length) {
        const idx = typeIndexRef.current;
        setTypeText(fullText.substring(0, idx + 1));
        typeIndexRef.current++;
        timeoutRef.current = setTimeout(typeWriter, 100 + Math.random() * 50);
      } else {
        timeoutRef.current = setTimeout(() => {
          setTypeText('');
          typeIndexRef.current = 0;
          typeWriter();
        }, 3000);
      }
    };
    timeoutRef.current = setTimeout(typeWriter, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="perspective-[2800px] flex items-center justify-center h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div style={{ ...customStyles.scene, ...(isHovered ? customStyles.sceneHover : {}) }}>
        <div style={customStyles.computerUnit} className="scale-[0.58] md:scale-[0.65]">
              {/* Front face */}
              <div style={customStyles.front}>
                <div style={customStyles.screenInset}>
                  <div style={customStyles.crt}>
                    {/* CRT scanline overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                      backgroundSize: '100% 2px, 3px 100%',
                      zIndex: 5,
                      pointerEvents: 'none',
                      borderRadius: '1px 2px 20px 20px / 2px 2px 10px 10px',
                    }} />
                    <div style={customStyles.crtGlow}>
                      {/* Menu Bar */}
                      <div style={customStyles.menuBar}>
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="#000" style={{ marginRight: '-2px' }}>
                          <path d="M17.057 12.783c.032 2.592 2.23 3.447 2.257 3.459-.017.065-.35 1.198-1.155 2.373-.695 1.016-1.417 2.029-2.541 2.05-1.103.018-1.458-.65-2.72-.65-1.261 0-1.652.631-2.701.67-1.088.04-1.921-1.087-2.619-2.096-1.428-2.063-2.52-5.83-1.05-8.375.727-1.263 2.029-2.064 3.445-2.083 1.074-.015 2.083.722 2.741.722.657 0 1.889-.9 3.149-.773.53.023 2.016.213 2.973 1.611-.077.047-1.776 1.033-1.758 3.092zM15.428 5.765c.571-.692.955-1.654.85-2.615-.826.033-1.826.549-2.418 1.24-.531.61-.995 1.59-.87 2.531.92.071 1.867-.464 2.438-1.156z" />
                        </svg>
                        <span>File</span>
                        <span>Edit</span>
                        <span>View</span>
                        <span>Special</span>
                      </div>

                      <div style={customStyles.crtUi}>
                        {/* Desktop Icons */}
                        <div style={{ ...customStyles.desktopIcon, top: '26px' }}>
                          <div style={customStyles.iconGraphic}>
                            <svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="#000" strokeWidth="2">
                              {/* Classic HD icon */}
                              <rect x="4" y="6" width="24" height="20" rx="1" />
                              <circle cx="24" cy="12" r="1.5" fill="#000" />
                              <line x1="8" y1="20" x2="24" y2="20" />
                            </svg>
                          </div>
                          <div style={customStyles.iconLabel}>MacIntosh</div>
                        </div>

                        <div style={{ ...customStyles.desktopIcon, bottom: '20px' }}>
                          <div style={customStyles.iconGraphic}>
                            <svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="#000" strokeWidth="2">
                              {/* Classic Trash icon */}
                              <path d="M6 8h20M9 8v16a2 2 0 002 2h10a2 2 0 002-2V8M12 8V5a2 2 0 012-2h4a2 2 0 012 2v3" />
                              <line x1="12" y1="14" x2="12" y2="20" />
                              <line x1="16" y1="14" x2="16" y2="20" />
                              <line x1="20" y1="14" x2="20" y2="20" />
                            </svg>
                          </div>
                          <div style={customStyles.iconLabel}>Trash</div>
                        </div>

                        <div style={customStyles.mainArea}>
                          <div style={customStyles.window}>
                            <div style={customStyles.windowHeader}>
                              <div style={customStyles.closeBox} />
                              <div style={customStyles.windowTitle}>Terminal</div>
                            </div>
                            <div style={{ padding: '4px' }}>
                              <div style={customStyles.typingContainer}>
                                <span>{typeText}</span>
                                <span style={{ ...customStyles.cursor, opacity: cursorVisible ? 1 : 0, background: '#000', height: '10px', width: '6px' }}></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Badge */}
                <div style={customStyles.logoBadge}>
                  <svg viewBox="0 0 24 24" width="44" height="44">
                    <defs>
                      <linearGradient id="apple-rainbow" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#63B548" />
                        <stop offset="16.6%" stopColor="#63B548" />
                        <stop offset="16.6%" stopColor="#F6C829" />
                        <stop offset="33.3%" stopColor="#F6C829" />
                        <stop offset="33.3%" stopColor="#E57D25" />
                        <stop offset="50%" stopColor="#E57D25" />
                        <stop offset="50%" stopColor="#D83335" />
                        <stop offset="66.6%" stopColor="#D83335" />
                        <stop offset="66.6%" stopColor="#9C4595" />
                        <stop offset="83.3%" stopColor="#9C4595" />
                        <stop offset="83.3%" stopColor="#468CCF" />
                        <stop offset="100%" stopColor="#468CCF" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#apple-rainbow)" d="M17.057 12.783c.032 2.592 2.23 3.447 2.257 3.459-.017.065-.35 1.198-1.155 2.373-.695 1.016-1.417 2.029-2.541 2.05-1.103.018-1.458-.65-2.72-.65-1.261 0-1.652.631-2.701.67-1.088.04-1.921-1.087-2.619-2.096-1.428-2.063-2.52-5.83-1.05-8.375.727-1.263 2.029-2.064 3.445-2.083 1.074-.015 2.083.722 2.741.722.657 0 1.889-.9 3.149-.773.53.023 2.016.213 2.973 1.611-.077.047-1.776 1.033-1.758 3.092zM15.428 5.765c.571-.692.955-1.654.85-2.615-.826.033-1.826.549-2.418 1.24-.531.61-.995 1.59-.87 2.531.92.071 1.867-.464 2.438-1.156z" />
                  </svg>
                </div>

                {/* Floppy Slot */}
                <div style={customStyles.floppySlot}></div>

                {/* Stickers */}
                <div style={customStyles.stickerClaude}>
                  <svg 
                    viewBox="0 0 100 100" 
                    width="52" 
                    height="52"
                    style={{ filter: 'drop-shadow(1px 0px 0px rgba(0,0,0,0.2))' }}
                  >
                    <g transform="translate(50, 50)">
                      {/* White die-cut backing (the sticker paper) */}
                      <g fill="none" stroke="white" strokeWidth="10" strokeLinecap="round">
                        <line x1="0" y1="-40" x2="0" y2="40" transform="rotate(0)" />
                        <line x1="0" y1="-34" x2="0" y2="34" transform="rotate(36)" />
                        <line x1="0" y1="-38" x2="0" y2="38" transform="rotate(72)" />
                        <line x1="0" y1="-32" x2="0" y2="32" transform="rotate(108)" />
                        <line x1="0" y1="-36" x2="0" y2="36" transform="rotate(144)" />
                      </g>
                      {/* Claude logo foreground (the print) */}
                      <g fill="none" stroke="#D97757" strokeWidth="5" strokeLinecap="round">
                        <line x1="0" y1="-40" x2="0" y2="40" transform="rotate(0)" />
                        <line x1="0" y1="-34" x2="0" y2="34" transform="rotate(36)" />
                        <line x1="0" y1="-38" x2="0" y2="38" transform="rotate(72)" />
                        <line x1="0" y1="-32" x2="0" y2="32" transform="rotate(108)" />
                        <line x1="0" y1="-36" x2="0" y2="36" transform="rotate(144)" />
                      </g>
                    </g>
                  </svg>
                </div>
                <div style={customStyles.stickerStar}>
                  <svg viewBox="0 0 100 100" width="35" height="35" style={{ filter: 'drop-shadow(1px 0.5px 0px rgba(0,0,0,0.15))' }}>
                    {/* White die-cut backing */}
                    <path 
                      d="M50 5L62 38H95L68 56L79 88L50 68L21 88L32 56L5 38H38L50 5Z" 
                      fill="white" 
                      stroke="white" 
                      strokeWidth="10" 
                      strokeLinejoin="round" 
                    />
                    {/* Star Surface */}
                    <path 
                      d="M50 5L62 38H95L68 56L79 88L50 68L21 88L32 56L5 38H38L50 5Z" 
                      fill="#F6C829" 
                    />
                  </svg>
                </div>
                <div style={customStyles.stickerText}>DAILY<br />DRIVER</div>

                {/* Grill */}
                <div style={customStyles.grill}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={customStyles.vent}></div>
                  ))}
                </div>
              </div>

              {/* Other faces */}
              <div style={customStyles.back}></div>
              <div style={customStyles.left}></div>
              <div style={customStyles.right}></div>
              <div style={customStyles.top}></div>
              <div style={customStyles.bottom}></div>

              {/* Keyboard Assembly */}
              <div style={customStyles.keyboardAssembly} className="kb-assembly">
                <div style={customStyles.kbBase}>
                  <div style={customStyles.keysGrid}>
                    {/* Row 1 - 12 keys */}
                    {[...Array(12)].map((_, i) => (
                      <div key={`r1-${i}`} className="retro-key" style={customStyles.key}></div>
                    ))}
                    {/* Row 2 */}
                    <div className="retro-key" style={{ ...customStyles.key, gridColumn: 'span 2' }}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={{ ...customStyles.key, gridColumn: 'span 2' }}></div>
                    {/* Row 3 */}
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={{ ...customStyles.key, gridColumn: 'span 6' }}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                    <div className="retro-key" style={customStyles.key}></div>
                  </div>
                </div>
                <div style={customStyles.kbFront}></div>
                <div style={customStyles.kbBack}></div>
                <div style={customStyles.kbLeft}></div>
                <div style={customStyles.kbRight}></div>
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes typeKey {
              0%, 100% { transform: translateZ(1px) translateY(0); box-shadow: 0 6px 0 #C4C0B3, 0 8px 7px rgba(0,0,0,0.2); }
              50% { transform: translateZ(-2px) translateY(5px); box-shadow: 0 1px 0 #C4C0B3, 0 1px 2px rgba(0,0,0,0.05); }
            }
            .retro-key:nth-child(3n+1) { animation: typeKey 1.5s infinite 0.2s; }
            .retro-key:nth-child(7n) { animation: typeKey 2.1s infinite 0.5s; }
            .retro-key:nth-child(2n+4) { animation: typeKey 1.8s infinite 0.9s; }
            .retro-key:nth-child(5n) { animation: typeKey 2.5s infinite 1.2s; }
            .retro-key:nth-child(4n+2) { animation: typeKey 1.2s infinite 0s; }
            
            @media (max-width: 768px) {
              .kb-assembly {
                transform: translateZ(125px) rotateX(55deg) translateX(-30px) !important;
              }
            }
          ` }} />
    </div>
  );
};
