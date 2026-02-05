import React from 'react';
import { Home, Users, Wallet, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FloatingNav = ({ onAddClick }) => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 items-end pointer-events-none">
      {/* Floating Nav Bar */}
      <div className="pointer-events-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-full h-18 px-8 flex items-center gap-8 border border-white/20 relative z-20">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Home className="w-7 h-7" fill="currentColor" />
          <div className="w-1 h-1 rounded-full bg-primary" />
        </button>

        <button
          onClick={() => setCurrentScreen('manageGroups')}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors"
        >
          <Users className="w-7 h-7" />
          <div className="w-1 h-1 rounded-full bg-primary opacity-0" />
        </button>

        {/* Spacer for FAB */}
        <div className="w-12" />

        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <Wallet className="w-7 h-7" />
          <div className="w-1 h-1 rounded-full bg-primary opacity-0" />
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="w-1 h-1 rounded-full bg-primary opacity-0" />
        </button>
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-auto z-30">
        <button
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 text-white w-16 h-16 rounded-[1.5rem] rotate-45 shadow-xl shadow-primary/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-8 h-8 -rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;