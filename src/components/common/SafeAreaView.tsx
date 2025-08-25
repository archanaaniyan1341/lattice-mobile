import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';

interface SafeAreaViewProps {
  children: React.ReactNode;
  style?: any;
}

const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default SafeAreaView;