import { useState, useEffect } from 'react';

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(new Date());
  const [brushStrokes, setBrushStrokes] = useState([]);
  const [currentBid, setCurrentBid] = useState(4.04);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Tạo brush stroke effect khi di chuột
      const newStroke = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        opacity: 0.3
      };
      setBrushStrokes(prev => [...prev.slice(-5), newStroke]);
    };
    
    const timer = setInterval(() => {
      setTime(new Date());
      // Fake bidding animation
      setCurrentBid(prev => prev + (Math.random() - 0.5) * 0.01);
    }, 2000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const artQuotes = [
    "\"Every masterpiece tells its own story...\"",
    "\"Art is the language of the soul\"",
    "\"In every brushstroke lies a universe\"",
    "\"This page is being reimagined...\"",
    "\"Perhaps this artwork has found its collector\""
  ];

  const randomQuote = artQuotes[Math.floor(Math.random() * artQuotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-50 relative overflow-hidden">
      {/* Artist's palette colors following cursor */}
      {brushStrokes.map((stroke, i) => (
        <div
          key={stroke.id}
          className="fixed pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: stroke.x - 6,
            top: stroke.y - 6,
            width: 12 - i * 2,
            height: 12 - i * 2,
            background: `hsl(${(time.getSeconds() * 6 + i * 60) % 360}, 45%, 65%)`,
            borderRadius: '50%',
            opacity: stroke.opacity - i * 0.05,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Canvas texture background */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
             backgroundSize: '20px 20px'
           }} />

      {/* Gallery frames on walls */}
      <div className="absolute top-20 left-12 w-32 h-24 border-4 border-amber-800/20 bg-gradient-to-br from-amber-50 to-amber-100 opacity-30 transform rotate-3" />
      <div className="absolute top-32 right-16 w-28 h-36 border-4 border-stone-700/20 bg-gradient-to-br from-stone-50 to-stone-100 opacity-25 transform -rotate-2" />
      <div className="absolute bottom-40 left-20 w-40 h-28 border-4 border-slate-600/20 bg-gradient-to-br from-slate-50 to-slate-100 opacity-20 transform rotate-1" />

      <div className="flex items-center justify-center min-h-screen p-8 pb-24">
        <div className="text-center max-w-3xl">
          {/* 404 as art piece */}
          <div className="relative mb-12">
            <div className="relative inline-block">
              <h1 
                className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-900 via-stone-700 to-slate-800 select-none relative"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '0.1em',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  transform: `rotate(${Math.sin(time.getSeconds() / 10) * 1}deg)`
                }}
              >
                404
                {/* Artist signature */}
                <div className="absolute -bottom-6 -right-8 text-xs text-slate-400 font-light tracking-wider transform rotate-12">
                  ~404 artist
                </div>
              </h1>
              
              {/* Frame around 404 */}
              <div className="absolute -inset-8 border-2 border-amber-200/30 bg-gradient-to-br from-white/40 to-stone-100/40 backdrop-blur-sm transform rotate-1" 
                   style={{borderRadius: '2px'}} />
            </div>
            
            {/* Gallery lighting effect */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-gradient-to-b from-yellow-100/60 to-transparent blur-sm" />
          </div>

          {/* Elegant description */}
          <div className="mb-10 space-y-6">
            <div className="relative">
              <p className="text-2xl font-light text-slate-700 italic mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                {randomQuote}
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mx-auto" />
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-stone-200/50 shadow-sm">
              <p className="text-slate-600 leading-relaxed mb-4">
                The page you're looking for might have been moved to another gallery wing, 
                or this artwork is currently undergoing authentication and curation.
              </p>
              
              {/* Mock auction info */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-slate-500">Live Auction</span>
                </div>
                <div className="text-slate-400">|</div>
                <div className="font-mono text-slate-600">
                  Current: {currentBid.toFixed(2)} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Elegant navigation */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <button
              onClick={() => window.history.back()}
              className="group px-8 py-4 bg-white border border-stone-300 text-slate-700 rounded-sm
                         hover:bg-stone-50 hover:border-stone-400 transition-all duration-300
                         shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-100 to-transparent 
                             translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                <span>←</span>
                <span>Return to Previous Gallery</span>
              </span>
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-sm
                         hover:from-amber-700 hover:to-amber-800 transition-all duration-300
                         shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                             translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                <span>🎨</span>
                <span>Browse Main Collection</span>
              </span>
            </button>
          </div>

          {/* Art market info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/40 backdrop-blur-sm rounded p-4 border border-stone-200/30">
              <div className="text-2xl font-bold text-slate-700">{Math.floor(Math.random() * 100 + 200)}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Active Auctions</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded p-4 border border-stone-200/30">
              <div className="text-2xl font-bold text-slate-700">{(Math.random() * 50 + 100).toFixed(1)}K</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">NFTs Sold</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded p-4 border border-stone-200/30">
              <div className="text-2xl font-bold text-slate-700">{(Math.random() * 10 + 15).toFixed(1)}M $</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Total Volume</div>
            </div>
          </div>

          {/* Floating art elements */}
          <div className="absolute top-1/4 left-8 opacity-20">
            <div className="w-3 h-12 bg-gradient-to-b from-amber-400 to-amber-600 transform rotate-45 animate-pulse" />
          </div>
          <div className="absolute top-1/3 right-12 opacity-15">
            <div className="w-8 h-8 border-2 border-slate-400 rounded-full animate-spin" style={{animationDuration: '8s'}} />
          </div>
          <div className="absolute bottom-1/4 left-16 opacity-10">
            <div className="w-6 h-6 bg-gradient-to-br from-stone-400 to-stone-600 transform rotate-12" />
          </div>
        </div>
      </div>

      {/* Gallery footer */}
      <div className="absolute -bottom-2 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm py-6">
        <div className="text-center text-xs text-slate-400">
          <p className="mb-1">Curated Digital Art Gallery & NFT Marketplace</p>
          <p className="opacity-60">Where blockchain meets fine art</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;