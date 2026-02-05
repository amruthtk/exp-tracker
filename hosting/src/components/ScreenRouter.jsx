import React from 'react';
import { useApp } from '../context/AppContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import PINScreen from './screens/PINScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddBillScreen from './screens/AddBillScreen';
import ConfigureSplitScreen from './screens/ConfigureSplitScreen';
import ManageGroupsScreen from './screens/ManageGroupsScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import ProfileScreen from './screens/ProfileScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const ScreenRouter = () => {
  const { currentScreen } = useApp();

  const screens = {
    splash: <SplashScreen />,
    login: <LoginScreen />,
    pin: <PINScreen />,
    dashboard: <DashboardScreen />,
    addBill: <AddBillScreen />,
    configureSplit: <ConfigureSplitScreen />,
    manageGroups: <ManageGroupsScreen />,
    createGroup: <CreateGroupScreen />,
    profile: <ProfileScreen />,
    analytics: <AnalyticsScreen />,
  };

  return screens[currentScreen] || <SplashScreen />;
};

export default ScreenRouter;