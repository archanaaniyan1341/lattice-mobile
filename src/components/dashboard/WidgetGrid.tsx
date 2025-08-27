import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useDashboard } from '../../contexts/DashboardContext';
import ChartWidget from './ChartWidget';
import { MaterialIcons } from '@expo/vector-icons';

const WidgetGrid: React.FC = () => {
  const { dashboards, currentDashboardId, deleteWidget, addWidget } = useDashboard();
  
  const currentDashboard = dashboards.find(d => d.id === currentDashboardId);
  const widgets = currentDashboard?.widgets || [];

  const handleAddWidget = () => {
    // Create a simple line chart widget
    addWidget({
      type: 'lineChart',
      title: 'New Chart',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      },
    });
  };

  if (widgets.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="analytics" size={64} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>No widgets yet</Text>
        <TouchableOpacity style={styles.addWidgetButton} onPress={handleAddWidget}>
          <Text style={styles.addWidgetButtonText}>Add Your First Widget</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={widgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.widgetContainer}>
            <ChartWidget
              widget={item}
              onDelete={() => deleteWidget(item.id)}
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddWidget}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Widget</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  widgetContainer: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999999',
    marginVertical: 16,
  },
  addWidgetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addWidgetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WidgetGrid;