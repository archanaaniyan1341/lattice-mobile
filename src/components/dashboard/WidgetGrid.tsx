import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";
import { useDashboard } from "../../contexts/DashboardContext";
import ChartWidget from "./ChartWidget";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownMenu from "./DropdownMenu";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface MenuPosition {
  x: number;
  y: number;
}

const WidgetGrid: React.FC = () => {
  const {
    dashboards,
    currentDashboardId,
    deleteWidget,
    addWidget,
    reorderWidgets,
  } = useDashboard();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    x: 0,
    y: 0,
  });

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId);
  const widgets = currentDashboard?.widgets || [];

  const handleAddWidget = () => {
    addWidget({
      type: "lineChart",
      title: "New Chart",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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

  const showMenu = (index: number, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedIndex(index);
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
    setSelectedIndex(null);
  };

  const moveUp = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const newWidgets = [...widgets];
      const temp = newWidgets[selectedIndex];
      newWidgets[selectedIndex] = newWidgets[selectedIndex - 1];
      newWidgets[selectedIndex - 1] = temp;

      reorderWidgets(newWidgets);
    }
  };

  const moveDown = () => {
    if (selectedIndex !== null && selectedIndex < widgets.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const newWidgets = [...widgets];
      const temp = newWidgets[selectedIndex];
      newWidgets[selectedIndex] = newWidgets[selectedIndex + 1];
      newWidgets[selectedIndex + 1] = temp;

      reorderWidgets(newWidgets);
    }
  };

  const moveToTop = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const newWidgets = [...widgets];
      const [movedItem] = newWidgets.splice(selectedIndex, 1);
      newWidgets.unshift(movedItem);

      reorderWidgets(newWidgets);
    }
  };

  const moveToBottom = () => {
    if (selectedIndex !== null && selectedIndex < widgets.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const newWidgets = [...widgets];
      const [movedItem] = newWidgets.splice(selectedIndex, 1);
      newWidgets.push(movedItem);

      reorderWidgets(newWidgets);
    }
  };

  const menuOptions =
    selectedIndex !== null
      ? [
          {
            label: "Move to Top",
            icon: "vertical-align-top",
            onPress: moveToTop,
            disabled: selectedIndex === 0,
          },
          {
            label: "Move Up",
            icon: "arrow-upward",
            onPress: moveUp,
            disabled: selectedIndex === 0,
          },
          {
            label: "Move Down",
            icon: "arrow-downward",
            onPress: moveDown,
            disabled: selectedIndex === widgets.length - 1,
          },
          {
            label: "Move to Bottom",
            icon: "vertical-align-bottom",
            onPress: moveToBottom,
            disabled: selectedIndex === widgets.length - 1,
          },
          {
            label: "Cancel",
            icon: "close",
            onPress: hideMenu,
          },
        ]
      : [];

  if (widgets.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="analytics" size={64} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>No widgets yet</Text>
        <TouchableOpacity
          style={styles.addWidgetButton}
          onPress={handleAddWidget}
        >
          <Text style={styles.addWidgetButtonText}>Add Your First Widget</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {widgets.map((widget, index) => (
          <View key={widget.id} >
            <TouchableOpacity
              style={styles.dragHandle}
              onLongPress={(event) => showMenu(index, event)}
              delayLongPress={300}
            >
              <ChartWidget
                widget={widget}
                onDelete={() => deleteWidget(widget.id)}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddWidget}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Widget</Text>
      </TouchableOpacity>

      <DropdownMenu
        visible={menuVisible}
        onClose={hideMenu}
        options={menuOptions}
        position={menuPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  widgetContainer: {
    backgroundColor: "#FFFFFF",
    // borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
   // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dragHandle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 6,
  },
  dragText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#999999",
    marginVertical: 16,
  },
  addWidgetButton: {
    backgroundColor: "#836cc7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addWidgetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#836cc7",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default WidgetGrid;
