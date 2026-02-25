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
    width: '360px',
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
    transform: 'rotateX(90deg) translateZ(100px)',
    background: '#F0EDE0',
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
    background: '#222529',
    borderRadius: '40% 40% 40% 40% / 10% 10% 10% 10%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
  },
  crtGlow: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    background: 'transparent',
    borderRadius: '12px',
    zIndex: 2,
    color: '#fff',
    fontFamily: "'VT323', monospace",
    padding: '15px',
    fontSize: '14px',
    textShadow: '0 0 2px rgba(255,255,255,0.5)',
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
  stickerBall: {
    position: 'absolute',
    zIndex: 5,
    boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    width: '40px',
    height: '40px',
    background: '#C05621',
    borderRadius: '50%',
    bottom: '88px',
    left: '20px',
    backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.2) 2px, transparent 3px), linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 45%, transparent 45%)',
    transform: 'translateZ(101px) rotate(-10deg)',
  },
  stickerStar: {
    position: 'absolute',
    zIndex: 5,
    boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    width: '35px',
    height: '35px',
    background: '#fff',
    borderRadius: '8px',
    bottom: '98px',
    left: '65px',
    transform: 'translateZ(102px) rotate(15deg)',
    border: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#2B6CB0',
  },
  stickerText: {
    position: 'absolute',
    zIndex: 5,
    boxShadow: '1px 1px 1px rgba(0,0,0,0.3)',
    width: '60px',
    height: '30px',
    background: '#8B0000',
    color: '#F0E68C',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '10px',
    lineHeight: 1.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    bottom: '54px',
    left: '80px',
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
  window: {
    background: '#fff',
    color: '#000',
    borderRadius: '2px',
    padding: '5px',
    marginTop: '10px',
    boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
    fontFamily: "'VT323', monospace",
    fontSize: '10px',
  },
  windowHeader: {
    borderBottom: '1px dotted #000',
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
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

  const fullText = "Mac Mini M4: Small size. Massive power. System optimized.";

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const typeWriter = () => {
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
      className="perspective-2000 flex items-center justify-center h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div style={{ ...customStyles.scene, ...(isHovered ? customStyles.sceneHover : {}) }}>
        <div style={customStyles.computerUnit} className="scale-[0.5] md:scale-[0.65]">
              {/* Front face */}
              <div style={customStyles.front}>
                <div style={customStyles.screenInset}>
                  <div style={customStyles.crt}>
                    {/* CRT scanline overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                      backgroundSize: '100% 2px, 3px 100%',
                      zIndex: 5,
                      pointerEvents: 'none',
                      borderRadius: '12px',
                    }} />
                    <div style={customStyles.crtGlow}>
                      <div style={customStyles.crtUi}>
                        <div style={customStyles.sidebar}>
                          <div style={customStyles.iconList}>
                            <div style={customStyles.iconItem}>
                              <span style={customStyles.iconCircleBlue}></span> System
                            </div>
                            <div style={customStyles.iconItem}>
                              <span style={customStyles.iconCircleOrange}></span> Disk A
                            </div>
                            <div style={customStyles.iconItem}>
                              <span style={customStyles.iconCircle}></span> Trash
                            </div>
                            <div style={customStyles.iconItem}>
                              <span style={customStyles.iconCircle}></span> Write
                            </div>
                            <div style={customStyles.iconItem}>
                              <span style={customStyles.iconCircle}></span> Think
                            </div>
                          </div>
                        </div>
                        <div style={customStyles.mainArea}>
                          <div style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.7 }}>RetroOS 1.0</div>
                          <div style={customStyles.window}>
                            <div style={customStyles.windowHeader}>
                              <span>Daily.txt</span>
                              <span>[x]</span>
                            </div>
                            <div style={customStyles.typingContainer}>
                              <span>{typeText}</span>
                              <span style={{ ...customStyles.cursor, opacity: cursorVisible ? 1 : 0 }}></span>
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
                <div style={customStyles.stickerBall}></div>
                <div style={customStyles.stickerStar}>★</div>
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
              <div style={customStyles.keyboardAssembly}>
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
          ` }} />
    </div>
  );
};
