import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dashboard, Widget } from '../types';
import { mockDashboards } from '../data/mockDashboardData';

interface DashboardContextType {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  setCurrentDashboard: (dashboardId: string) => void;
  createDashboard: (title: string) => void;
  deleteDashboard: (dashboardId: string) => void;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  deleteWidget: (widgetId: string) => void;
  updateDashboardTitle: (dashboardId: string, newTitle: string) => void;
  reorderWidgets: (widgets: Widget[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(mockDashboards[0]?.id || null);

  const setCurrentDashboard = (dashboardId: string) => {
    setCurrentDashboardId(dashboardId);
  };

  const createDashboard = (title: string) => {
    const newDashboard: Dashboard = {
      id: Date.now().toString(),
      title,
      widgets: [],
      createdAt: new Date(),
    };
    setDashboards(prev => [newDashboard, ...prev]);
    setCurrentDashboardId(newDashboard.id);
  };

  const deleteDashboard = (dashboardId: string) => {
    setDashboards(prev => prev.filter(dashboard => dashboard.id !== dashboardId));
    if (currentDashboardId === dashboardId) {
      setCurrentDashboardId(dashboards.length > 1 ? dashboards[0].id : null);
    }
  };

  const addWidget = (widgetData: Omit<Widget, 'id'>) => {
    if (!currentDashboardId) return;

    const newWidget: Widget = {
      ...widgetData,
      id: Date.now().toString(),
    };

    setDashboards(prev => prev.map(dashboard => {
      if (dashboard.id === currentDashboardId) {
        return { ...dashboard, widgets: [...dashboard.widgets, newWidget] };
      }
      return dashboard;
    }));
  };

  const deleteWidget = (widgetId: string) => {
    setDashboards(prev => prev.map(dashboard => {
      if (dashboard.id === currentDashboardId) {
        return { ...dashboard, widgets: dashboard.widgets.filter(widget => widget.id !== widgetId) };
      }
      return dashboard;
    }));
  };

  const updateDashboardTitle = (dashboardId: string, newTitle: string) => {
  setDashboards(prev => prev.map(dashboard => 
    dashboard.id === dashboardId ? { ...dashboard, title: newTitle } : dashboard
  ));
};

const reorderWidgets = (reorderedWidgets: Widget[]) => {
  setDashboards(prev => prev.map(dashboard => {
    if (dashboard.id === currentDashboardId) {
      return {
        ...dashboard,
        widgets: reorderedWidgets
      };
    }
    return dashboard;
  }));

};
  return (
    <DashboardContext.Provider value={{
      dashboards,
      currentDashboardId,
      setCurrentDashboard,
      createDashboard,
      deleteDashboard,
      addWidget,
      deleteWidget,
      updateDashboardTitle,
      reorderWidgets
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};