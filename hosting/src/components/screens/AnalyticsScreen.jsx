import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart as PieIcon,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const AnalyticsScreen = () => {
    const { setCurrentScreen } = useApp();
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // --- MOCK DATABASE OF TRANSACTIONS ---
    const allTransactions = useMemo(() => [
        // Income
        { id: 101, type: 'income', name: 'Salary', amount: 45000, category: 'SALARY', date: '2026-02-01' },
        { id: 102, type: 'income', name: 'Freelance', amount: 5000, category: 'OTHER', date: '2026-02-15' },

        // Expenses - February
        { id: 1, type: 'expense', name: 'Netflix', amount: 649, category: 'Entertainment', date: '2026-02-05' },
        { id: 2, type: 'expense', name: 'Taco Bell', amount: 1250, category: 'Food & Drinks', date: '2026-02-04' },
        { id: 3, type: 'expense', name: 'Rent', amount: 12000, category: 'Other', date: '2026-02-01' },
        { id: 4, type: 'expense', name: 'Uber', amount: 450, category: 'Transport', date: '2026-02-03' },
        { id: 5, type: 'expense', name: 'Zara', amount: 3500, category: 'Shopping', date: '2026-02-10' },
        { id: 6, type: 'expense', name: 'Movie', amount: 800, category: 'Entertainment', date: '2026-02-12' },

        // Expenses - January
        { id: 7, type: 'expense', name: 'Gym', amount: 2000, category: 'Other', date: '2026-01-15' },
        { id: 8, type: 'expense', name: 'Dining', amount: 3000, category: 'Food & Drinks', date: '2026-01-20' },
    ], []);

    // --- FILTER LOGIC ---
    const filteredData = useMemo(() => {
        const now = new Date();
        let start = new Date(startDate);
        let end = new Date(endDate);

        if (selectedPeriod === 'Weekly') {
            start = new Date(now.setDate(now.getDate() - 7));
            end = new Date();
        } else if (selectedPeriod === 'Monthly') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (selectedPeriod === 'Annually') {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
        } else if (selectedPeriod === 'Period') {
            start = new Date(startDate);
            end = new Date(endDate);
        }

        const filtered = allTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= start && tDate <= end;
        });

        const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        // Calculate Categories
        const catMap = {};
        filtered.filter(t => t.type === 'expense').forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        });

        const catData = Object.keys(catMap).map(name => ({
            name,
            amount: catMap[name],
            percent: Math.round((catMap[name] / (expense || 1)) * 100),
            color: name === 'Food & Drinks' ? '#3b82f6' :
                name === 'Shopping' ? '#8b5cf6' :
                    name === 'Entertainment' ? '#f59e0b' :
                        name === 'Transport' ? '#10b981' : '#64748b'
        })).sort((a, b) => b.amount - a.amount);

        return { income, expense, balance: income - expense, categories: catData, start, end };
    }, [selectedPeriod, startDate, endDate, allTransactions]);

    // Pie Chart Calculation
    const renderPieChart = () => {
        if (filteredData.categories.length === 0) return <circle cx="0" cy="0" r="1" fill="#f1f5f9" />;

        let cumulativePercent = 0;
        return filteredData.categories.map((cat, i) => {
            const startPercent = cumulativePercent;
            cumulativePercent += cat.percent;

            const x1 = Math.cos(2 * Math.PI * (startPercent / 100));
            const y1 = Math.sin(2 * Math.PI * (startPercent / 100));
            const x2 = Math.cos(2 * Math.PI * (cumulativePercent / 100));
            const y2 = Math.sin(2 * Math.PI * (cumulativePercent / 100));

            const largeArcFlag = cat.percent > 50 ? 1 : 0;
            const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
                <motion.path
                    key={cat.name}
                    d={pathData}
                    fill={cat.color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                />
            );
        });
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] flex flex-col">
            {/* Header Area */}
            <div className="pt-20 px-6 pb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-8 relative">
                    <button
                        onClick={() => setCurrentScreen('dashboard')}
                        className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 active:scale-95 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                            <span>{filteredData.start.toLocaleDateString()}</span>
                            <Calendar className="w-3 h-3" />
                            <span className="mx-1 opacity-50">~</span>
                            <span>{filteredData.end.toLocaleDateString()}</span>
                            <Calendar className="w-3 h-3" />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-all group"
                            >
                                <span className="text-xs font-black uppercase tracking-widest text-gray-900">{selectedPeriod}</span>
                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showPeriodDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[1.5rem] shadow-2xl p-2 z-[110]"
                                    >
                                        {['Weekly', 'Monthly', 'Annually', 'Period'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSelectedPeriod(option);
                                                    setShowPeriodDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedPeriod === option ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <h1 className="text-5xl font-black italic tracking-tighter text-[#1a1c3d] mb-2 leading-none text-left">
                    Analytics
                </h1>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] text-left">Deep insights into your capital</p>
                    <AnimatePresence>
                        {selectedPeriod === 'Period' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <div className="flex flex-col px-2">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="text-[10px] font-bold text-gray-900 bg-transparent outline-none focus:text-blue-600 transition-colors"
                                    />
                                </div>
                                <div className="h-6 w-[1px] bg-gray-200" />
                                <div className="flex flex-col px-2">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="text-[10px] font-bold text-gray-900 bg-transparent outline-none focus:text-blue-600 transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex-1 px-6 pb-40 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#1a1c3d] to-[#0f1129] rounded-[2rem] p-6 shadow-xl text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-left">
                                <Wallet className="w-4 h-4 text-blue-400" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Balance</p>
                        </div>
                        <p className="text-3xl font-black tracking-tight text-left">₹{filteredData.balance.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-left">
                                <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Income</p>
                        </div>
                        <p className="text-3xl font-black tracking-tight text-gray-900 text-left">₹{filteredData.income.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-left">
                                <ArrowUpRight className="w-4 h-4 text-rose-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expense</p>
                        </div>
                        <p className="text-3xl font-black tracking-tight text-gray-900 text-left">₹{filteredData.expense.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-left">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Period Progress</h2>
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {Math.min(100, Math.round((filteredData.expense / (filteredData.income || 1)) * 100))}% of Income
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 tracking-widest">
                                        Expense Ratio
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black inline-block text-blue-600">
                                        ₹{filteredData.expense.toLocaleString()} / ₹{filteredData.income.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-blue-50 border border-blue-100 p-[2px]">
                                <motion.div
                                    key={selectedPeriod + startDate + endDate}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (filteredData.expense / (filteredData.income || 1)) * 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-left">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8">Spend Distribution</h2>
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="-1 -1 2 2">
                                {renderPieChart()}
                                <circle cx="0" cy="0" r="0.6" fill="white" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <PieIcon className="w-6 h-6 text-gray-300 mb-1" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Category</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            {filteredData.categories.length > 0 ? filteredData.categories.map((cat, i) => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.percent}%</span>
                                        <span className="text-sm font-black text-gray-900 w-20 text-right">₹{cat.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-400 text-sm py-10 font-bold uppercase tracking-widest">No data for this period</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsScreen;
