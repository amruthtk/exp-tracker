import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Plus,
  X,
  User,
  Users,
  Film,
  Utensils,
  ShoppingBag,
  Coffee,
  Home,
  BarChart2,
  Settings,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useApp } from '../../context/AppContext';

const DashboardScreen = () => {
  const { user, dashboardData, setBillData, setCurrentScreen } = useApp();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [graphAnimated, setGraphAnimated] = useState(false);
  const graphRef = useRef(null);

  // Animate graph on mount
  useEffect(() => {
    const animateGraph = () => {
      setGraphAnimated(false);
      setTimeout(() => setGraphAnimated(true), 300);
    };

    animateGraph();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        animateGraph();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleAddExpense = (type) => {
    setBillData({
      title: '',
      amount: '',
      selectedMembers: type === 'split' ? [user] : [],
      splitType: 'equal',
      customSplits: {},
      billType: type,
    });
    setShowAddOptions(false);
    setCurrentScreen('addBill');
  };

  const generateGraphPath = (points) => {
    return points.map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prevPoint = points[index - 1];
      const cp1x = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cp2x = prevPoint.x + (point.x - prevPoint.x) * 2 / 3;
      return `C ${cp1x} ${prevPoint.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
    }).join(' ');
  };

  const line1Points = [
    { x: 0, y: 90 }, { x: 40, y: 70 }, { x: 80, y: 75 }, { x: 120, y: 40 },
    { x: 160, y: 45 }, { x: 200, y: 15 }, { x: 240, y: 35 }, { x: 280, y: 25 },
    { x: 320, y: 45 }, { x: 360, y: 5 }, { x: 400, y: 15 }, { x: 420, y: 0 },
  ];

  const line2Points = [
    { x: 0, y: 95 }, { x: 40, y: 85 }, { x: 80, y: 60 }, { x: 120, y: 65 },
    { x: 160, y: 30 }, { x: 200, y: 40 }, { x: 240, y: 20 }, { x: 280, y: 50 },
    { x: 320, y: 30 }, { x: 360, y: 35 }, { x: 400, y: 25 }, { x: 420, y: 20 },
  ];

  const recentActivities = [
    { id: 1, name: 'Netflix Duo', category: 'ENTERTAINMENT', time: 'TODAY', amount: 649, icon: <Film className="w-5 h-5" /> },
    { id: 2, name: 'Taco Bell', category: 'DINNER', time: 'YESTERDAY', amount: 1250, icon: <Utensils className="w-5 h-5" /> },
    { id: 3, name: 'Grocery Mart', category: 'ESSENTIALS', time: '2 DAYS AGO', amount: 840, icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 4, name: 'Starbucks', category: 'COFFEE', time: '3 DAYS AGO', amount: 450, icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] overflow-visible flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col px-4 md:px-6 lg:px-8 pt-18 pb-28 min-h-0 relative mobile-content-wrapper">

        {/* --- 1. GLOBAL OVERLAY (BACKGROUND ONLY) --- */}
        <AnimatePresence>
          {showAddOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddOptions(false)}
              className="fixed inset-0 z-[30] bg-white/20 pointer-events-auto"
            />
          )}
        </AnimatePresence>

        {/* --- 2. HEADER (UNBLURRED & CENTERED) --- */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0 mt-0 relative z-40">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter text-[#1a1c3d]">
              Overview
            </h1>
          </div>

          <button
            onClick={() => setCurrentScreen('profile')}
            className="flex items-center gap-4 group active:scale-95 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{user?.name || 'Alex Sterling'}</p>
              <p className="text-gray-500 text-xs text-[10px] font-black uppercase tracking-widest opacity-60">Premium Member</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-blue-100 to-indigo-100 p-[2px] shadow-lg group-hover:shadow-blue-200 transition-all">
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
                  alt="Profile"
                  className="w-full h-full rounded-[1.1rem] border-2 border-white object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          </button>
        </div>

        {/* --- 3. MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6 flex flex-col">

            {/* TOTAL PORTFOLIO CARD (UNBLURRED) */}
            <div className="relative z-40 transition-all duration-500">
              <div className="bg-gradient-to-br from-[#1a1c3d] to-[#0f1129] rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-600/15 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 group-hover:bg-purple-600/15 transition-all duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase">TOTAL SPENT</p>
                    <div className="h-[1px] w-12 bg-gray-700/50"></div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-baseline gap-1">
                      <p className="text-white text-5xl font-black tracking-tight">
                        ₹{dashboardData?.totalSpent || '14,820'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-black">12%</span>
                    </div>
                  </div>

                  {/* Animated Dual-Line Graph */}
                  <div className="relative h-32 w-full mt-2" ref={graphRef}>
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 420 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="graphGradient1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="graphGradient2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>

                      {/* Secondary Line (Split Trends) */}
                      <g className={`transition-all duration-[1500ms] ${graphAnimated ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <path
                          d={generateGraphPath(line2Points)}
                          fill="none"
                          stroke="url(#lineGradient2)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={`${generateGraphPath(line2Points)} L 420 100 L 0 100 Z`}
                          fill="url(#graphGradient2)"
                        />
                      </g>

                      {/* Primary Line (Direct Trends) */}
                      <g className={`transition-all duration-[1200ms] delay-200 ${graphAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <path
                          d={generateGraphPath(line1Points)}
                          fill="none"
                          stroke="url(#lineGradient1)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={`${generateGraphPath(line1Points)} L 420 100 L 0 100 Z`}
                          fill="url(#graphGradient1)"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER CARDS (BLURRED IN SHAPE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* To Pay Card */}
              <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 transition-all duration-500 overflow-hidden ${showAddOptions ? 'scale-95 opacity-50 pointer-events-none' : ''}`}>
                <div className={`p-6 transition-all duration-500 flex flex-col h-full justify-between ${showAddOptions ? 'blur-md' : ''}`}>
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-4">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total to Pay</p>
                    <p className="text-3xl font-black text-gray-900">₹{dashboardData?.toPay || '2,150'}</p>
                  </div>
                </div>
              </div>

              {/* To Receive Card */}
              <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 transition-all duration-500 overflow-hidden ${showAddOptions ? 'scale-95 opacity-50 pointer-events-none' : ''}`}>
                <div className={`p-6 transition-all duration-500 flex flex-col h-full justify-between ${showAddOptions ? 'blur-md' : ''}`}>
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total to Receive</p>
                    <p className="text-3xl font-black text-gray-900">₹{dashboardData?.toReceive || '4,430'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR (BLURRED IN SHAPE) */}
          <div className={`lg:col-span-4 flex flex-col transition-all duration-500 lg:h-[350px] mobile-recent-activity ${showAddOptions ? 'scale-95 opacity-50 pointer-events-none' : ''}`}>
            <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 p-6 h-full ${showAddOptions ? 'blur-md' : ''}`}>
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Activity</h2>
                <button
                  className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
                  onClick={() => setCurrentScreen('analytics')}
                >
                  VIEW ALL
                </button>
              </div>

              <div className="flex-1 space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{activity.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                          {activity.category} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm group-hover:scale-105 transition-transform">
                        -₹{activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- 4. FLOATING ACTIONS & NAV PILL --- */}
        <div className="fixed bottom-10 left-0 right-0 z-[100] px-6 flex justify-center pointer-events-none text-left">
          <div className="max-w-7xl w-full flex items-center justify-center relative mobile-nav-container">

            {/* The Pill Navigation Bar */}
            <div className="bg-white/90 backdrop-blur-xl h-16 rounded-full shadow-2xl border border-white/20 px-10 flex items-center justify-between gap-12 pointer-events-auto mobile-pill-nav">
              <button className="relative group text-blue-600">
                <Home className="w-6 h-6 stroke-[2.5px]" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              </button>
              <button
                className="text-gray-300 hover:text-gray-400 transition-colors"
                onClick={() => setCurrentScreen('analytics')}
              >
                <BarChart2 className="w-6 h-6 stroke-[2.5px]" />
              </button>

              {/* Mobile spacer for FAB - only visible on mobile */}
              <div className="w-14 lg:hidden mobile-fab-spacer" />

              <button
                className="text-gray-300 hover:text-gray-400 transition-colors"
                onClick={() => setCurrentScreen('manageGroups')}
              >
                <Users className="w-6 h-6 stroke-[2.5px]" />
              </button>
              <button className="text-gray-300 hover:text-gray-400 transition-colors">
                <Settings className="w-6 h-6 stroke-[2.5px]" />
              </button>
            </div>

            {/* Floating Add Section */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-[180px] bottom-4 lg:bottom-auto pointer-events-auto z-[110]">
              <AnimatePresence>
                {showAddOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="absolute bottom-24 right-0 flex items-center gap-4 whitespace-nowrap mobile-add-options"
                  >
                    <button
                      onClick={() => handleAddExpense('self')}
                      className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/50 hover:scale-105 active:scale-95 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900">MY SPEND</span>
                    </button>

                    <button
                      onClick={() => handleAddExpense('split')}
                      className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/50 hover:scale-105 active:scale-95 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900">SPLIT</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowAddOptions(!showAddOptions)}
                className={`w-16 h-16 rounded-[1.5rem] rotate-45 shadow-2xl shadow-blue-600/30 flex items-center justify-center transition-all duration-300 ${showAddOptions ? 'bg-indigo-600' : 'bg-blue-600 hover:scale-110 active:scale-95'}`}
              >
                <div className="-rotate-45">
                  <AnimatePresence mode="wait">
                    {showAddOptions ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <X className="w-8 h-8 text-white stroke-[3px]" />
                      </motion.div>
                    ) : (
                      <motion.div key="plus" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Plus className="w-8 h-8 text-white stroke-[3px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
