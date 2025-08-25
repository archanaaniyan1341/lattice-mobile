import React from 'react';
import { ChatProvider } from './src/contexts/ChatContext';
import { DashboardProvider } from './src/contexts/DashboardContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import SafeAreaView from './src/components/common/SafeAreaView';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatProvider>
        <DashboardProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </DashboardProvider>
      </ChatProvider>
    </SafeAreaView>
  );
};

export default App;