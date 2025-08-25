export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  threads: Thread[];
  createdAt: Date;
  isExpanded?: boolean; // For UI state
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface Widget {
  id: string;
  type: 'lineChart' | 'barChart' | 'pieChart';
  title: string;
  data: ChartData;
}

export interface Dashboard {
  id: string;
  title: string;
  widgets: Widget[];
  createdAt: Date;
}