import { Dashboard, ChartData } from '../types';

// Sample chart data for different widget types
export const sampleLineChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [65, 78, 52, 94, 87, 72],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const sampleBarChartData: ChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 65],
      color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const samplePieChartData: ChartData = {
  labels: ['React', 'Vue', 'Angular', 'Svelte', 'Other'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const sampleRevenueChartData: ChartData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      data: [125000, 145000, 165000, 195000],
      color: (opacity = 1) => `rgba(175, 82, 222, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const sampleUserGrowthData: ChartData = {
  labels: ['2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      data: [1000, 2500, 5000, 12000, 25000],
      color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const sampleConversionRateData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [2.5, 3.2, 2.8, 4.1, 3.9, 4.5],
      color: (opacity = 1) => `rgba(90, 200, 250, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

// Mock dashboards with widgets
export const mockDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Product Analytics',
    createdAt: new Date('2023-05-15'),
    widgets: [
      {
        id: '1-1',
        type: 'lineChart',
        title: 'Monthly Active Users',
        data: sampleLineChartData,
      },
      {
        id: '1-2',
        type: 'barChart',
        title: 'Weekly Engagement',
        data: sampleBarChartData,
      },
      {
        id: '1-3',
        type: 'pieChart',
        title: 'Framework Usage',
        data: samplePieChartData,
      },
    ],
  },
  {
    id: '2',
    title: 'Financial Overview',
    createdAt: new Date('2023-06-10'),
    widgets: [
      {
        id: '2-1',
        type: 'lineChart',
        title: 'Quarterly Revenue',
        data: sampleRevenueChartData,
      },
      {
        id: '2-2',
        type: 'barChart',
        title: 'Expense Breakdown',
        data: {
          labels: ['R&D', 'Marketing', 'Operations', 'Salaries', 'Other'],
          datasets: [
            {
              data: [45000, 30000, 25000, 60000, 15000],
              color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        },
      },
    ],
  },
  {
    id: '3',
    title: 'Marketing Performance',
    createdAt: new Date('2023-07-20'),
    widgets: [
      {
        id: '3-1',
        type: 'lineChart',
        title: 'User Growth',
        data: sampleUserGrowthData,
      },
      {
        id: '3-2',
        type: 'lineChart',
        title: 'Conversion Rates',
        data: sampleConversionRateData,
      },
      {
        id: '3-3',
        type: 'barChart',
        title: 'Campaign Performance',
        data: {
          labels: ['Email', 'Social', 'Search', 'Referral', 'Direct'],
          datasets: [
            {
              data: [1200, 850, 1500, 600, 400],
              color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        },
      },
      {
        id: '3-4',
        type: 'pieChart',
        title: 'Traffic Sources',
        data: {
          labels: ['Organic', 'Paid', 'Social', 'Email', 'Direct'],
          datasets: [
            {
              data: [40, 25, 20, 10, 5],
              color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        },
      },
    ],
  },
  {
    id: '4',
    title: 'Empty Dashboard',
    createdAt: new Date('2023-08-01'),
    widgets: [],
  },
];

// Function to generate random chart data for new widgets
export const generateRandomChartData = (type: 'lineChart' | 'barChart' | 'pieChart'): ChartData => {
  const randomData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 1);
  const colors = [
    'rgba(0, 122, 255, 1)',    // Blue
    'rgba(52, 199, 89, 1)',    // Green
    'rgba(255, 149, 0, 1)',    // Orange
    'rgba(255, 59, 48, 1)',    // Red
    'rgba(175, 82, 222, 1)',   // Purple
    'rgba(90, 200, 250, 1)',   // Light Blue
    'rgba(255, 204, 0, 1)',    // Yellow
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (type === 'pieChart') {
    return {
      labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
      datasets: [
        {
          data: randomData,
          color: (opacity = 1) => randomColor.replace('1)', `${opacity})`),
          strokeWidth: 2,
        },
      ],
    };
  }

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: randomData,
        color: (opacity = 1) => randomColor.replace('1)', `${opacity})`),
        strokeWidth: 2,
      },
    ],
  };
};

// Default widget templates for quick creation
export const defaultWidgetTemplates = [
  {
    type: 'lineChart' as const,
    title: 'Line Chart',
    data: sampleLineChartData,
  },
  {
    type: 'barChart' as const,
    title: 'Bar Chart',
    data: sampleBarChartData,
  },
  {
    type: 'pieChart' as const,
    title: 'Pie Chart',
    data: samplePieChartData,
  },
  {
    type:'candlestickChart' as const,
    title: 'Candlestick Chart',
  }
];