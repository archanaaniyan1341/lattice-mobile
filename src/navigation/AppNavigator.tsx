import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Chat') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'grid' : 'grid-outline';
            }

            return <Ionicons name={iconName || 'help-circle'} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#836cc7',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;