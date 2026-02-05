import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  // --- UI STATE ---
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- USER STATE ---
  const [user, setUser] = useState(null); // Null = Guest Mode
  const [users, setUsers] = useState([]);
  const [pinInput, setPinInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  
  // --- DATA STATE ---
  const [dashboardData, setDashboardData] = useState({ totalSpent: 0, toPay: 0, toReceive: 0 });
  const [savedGroups, setSavedGroups] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  const [billData, setBillData] = useState({
    title: '', amount: '', selectedMembers: [], splitType: 'equal', customSplits: {},
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [newGroup, setNewGroup] = useState({
    name: '', emoji: '👥', selectedMembers: [], isEditing: false,
  });

  // --- FIREBASE LOGIC ---

  const seedTestUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      if (snapshot.empty) {
        const testUsers = [
          { username: 'ajay', name: 'Ajay', pin: '1234', avatar: 'https://i.pravatar.cc/150?img=12' },
          { username: 'vikram', name: 'Vikram', pin: '1234', avatar: 'https://i.pravatar.cc/150?img=13' },
        ];
        for (const user of testUsers) { await addDoc(usersRef, user); }
      }
    } catch (e) { console.error('Seeding failed', e); }
  };

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };

  const fetchUserGroups = async (userId) => {
    if (!userId) return;
    try {
      const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', userId));
      const snapshot = await getDocs(q);
      setSavedGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };

  const createBill = async (data) => {
    if (!user) {
        setIsAuthModalOpen(true); // Force login if guest tries to create
        return;
    }
    const docRef = await addDoc(collection(db, 'bills'), { ...data, userId: user.id });
    return docRef.id;
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await seedTestUsers();
      await fetchUsers();
      setLoading(false);
    };
    init();
  }, []);

  // --- SEARCH LOGIC ---
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, users]);

  const value = {
    currentScreen, setCurrentScreen,
    isAuthModalOpen, setIsAuthModalOpen,
    user, setUser,
    users,
    pinInput, setPinInput,
    usernameInput, setUsernameInput,
    dashboardData, setDashboardData,
    savedGroups, setSavedGroups,
    recentActivities, setRecentActivities,
    billData, setBillData,
    searchQuery, setSearchQuery,
    searchResults, setSearchResults,
    newGroup, setNewGroup,
    loading,
    createBill,
    fetchUserGroups
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};