import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import ScreenRouter from './components/ScreenRouter';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // 1. Logo stays in center for 2 seconds
    const timer1 = setTimeout(() => {
      setLoading(false); // Triggers move to top-left
    }, 2000);

    // 2. Dashboard content fades in after logo moves
    const timer2 = setTimeout(() => {
      setShowApp(true);
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <AppProvider>
      <div className={`relative min-h-screen ${loading ? "bg-black" : "bg-gray-50"} overflow-y-auto no-scrollbar font-sans transition-colors duration-1000`}>

        {/* CSS to hide scrollbars while maintaining functionality */}
        <style>{`
          ::-webkit-scrollbar { display: none; }
          html, body { 
            background: ${loading ? "black" : "#f9fafb"} !important; 
            -ms-overflow-style: none; 
            scrollbar-width: none; 
            transition: background-color 1000ms;
          }
        `}</style>

        {/* --- LAYER 1: THE ANIMATED LOGO --- */}
        {/* This div handles the physical movement from Center to Top-Left */}
        <div
          className={`absolute z-[110] transition-all duration-1000 ease-[0.22,1,0.36,1] ${loading
            ? "fixed inset-0 flex items-center justify-center bg-black"
            : "top-6 left-6"
            }`}
        >
          <motion.div layout className="flex items-center gap-3">
            <motion.div
              className={`rounded-[2rem] flex items-center justify-center transition-all duration-1000 ${loading
                ? "p-6 bg-white shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
                : "p-2 bg-white shadow-sm border border-gray-100"}`}
              animate={!loading ? {} : {}}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Zap className={`text-blue-600 fill-blue-600 transition-all duration-1000 ${loading ? "w-16 h-16" : "w-5 h-5"}`} />
            </motion.div>

            <AnimatePresence>
              {loading && (
                <motion.h1
                  initial={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: -50,
                    filter: "blur(10px)",
                    transition: { duration: 0.8, ease: "anticipate" }
                  }}
                  className="font-black italic tracking-tighter flex items-baseline text-7xl text-white"
                >
                  <span>F</span>
                  <span className="relative inline-block">
                    ı
                    <motion.div
                      className="absolute bg-current rounded-full"
                      style={{
                        width: '0.15em',
                        height: '0.15em',
                        left: '65%',
                        bottom: '0.7em',
                        transform: 'translateX(-50%)'
                      }}
                      animate={{
                        y: [0, -30, 0],
                        scaleY: [1, 0.6, 1.3, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        times: [0, 0.3, 0.6, 1],
                        ease: "easeOut"
                      }}
                    />
                  </span>
                  <span>nTrack</span>
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- LAYER 2: THE ACTUAL CONTENT (Dashboard/Router) --- */}
        <AnimatePresence>
          {showApp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <ScreenRouter />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppProvider>
  );
};

export default App;