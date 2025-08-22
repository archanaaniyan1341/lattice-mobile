import React from 'react';
import { ChatProvider } from './src/contexts/ChatContext';
import { DashboardProvider } from './src/contexts/DashboardContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <DashboardProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </DashboardProvider>
    </ChatProvider>
  );
};

export default App;