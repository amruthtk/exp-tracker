import React from 'react';
import {
    ArrowLeft,
    Settings,
    User,
    Shield,
    Bell,
    CreditCard,
    HelpCircle,
    LogOut,
    ChevronRight,
    Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const ProfileScreen = () => {
    const { user, setCurrentScreen } = useApp();

    const menuItems = [
        { id: 'personal', icon: <User className="w-5 h-5" />, label: 'Personal Information', sub: 'Name, email, phone' },
        { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Security', sub: 'PIN, biometrics, privacy' },
        { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications', sub: 'Alerts, announcements' },
        { id: 'payment', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', sub: 'Cards, UPI, bank accounts' },
        { id: 'help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', sub: 'FAQ, contact us, feedback' },
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] flex flex-col pt-20">
            {/* Header */}
            <div className="px-6 flex items-center justify-between mb-8">
                <button
                    onClick={() => setCurrentScreen('dashboard')}
                    className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Profile</h1>
                <div className="w-10 h-10" /> {/* Empty div to keep 'Profile' centered */}
            </div>

            <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-10">
                {/* Profile Info */}
                <div className="mb-10 text-center">
                    <div className="relative inline-block mb-4">
                        <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-1">
                            <img
                                src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
                                alt="Profile"
                                className="w-full h-full rounded-[2.3rem] border-4 border-white object-cover shadow-2xl"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.name || 'Alex Sterling'}</h2>
                    <p className="text-gray-500 font-medium text-sm">Premium Member since Jan 2024</p>
                </div>

                {/* Action Menu */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2">Account Settings</p>
                    {menuItems.map((item, idx) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="w-full flex items-center justify-between p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    {item.icon}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{item.label}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{item.sub}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </motion.button>
                    ))}
                </div>

                {/* Log Out */}
                <div className="mt-10 mb-20 px-2 text-center">
                    <button className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-xs hover:opacity-70 transition-opacity mx-auto">
                        <LogOut className="w-4 h-4" />
                        Logout Account
                    </button>
                    <p className="text-[10px] text-gray-400 mt-6 font-medium">FinTrack v2.4.0 • Built with ❤️</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
