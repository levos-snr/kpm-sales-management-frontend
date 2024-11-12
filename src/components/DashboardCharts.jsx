// components/DashboardCharts.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RevenueChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
      <CardDescription>Monthly revenue statistics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="name" 
              className="text-xs" 
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              className="text-xs" 
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeWidth={2}
              dot={{ fill: '#4F46E5', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const PerformanceChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Sales Performance</CardTitle>
      <CardDescription>Daily sales and orders comparison</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="name" 
              className="text-xs" 
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              className="text-xs" 
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
              formatter={(value) => [value.toLocaleString(), '']}
            />
            <Bar 
              dataKey="sales" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
              name="Sales"
            />
            <Bar 
              dataKey="orders" 
              fill="#818CF8" 
              radius={[4, 4, 0, 0]}
              name="Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export const DashboardCharts = () => {
  // Sample data - replace with your actual data source
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const performanceData = [
    { name: 'Mon', sales: 1200, orders: 900 },
    { name: 'Tue', sales: 1400, orders: 1000 },
    { name: 'Wed', sales: 1600, orders: 1100 },
    { name: 'Thu', sales: 1400, orders: 900 },
    { name: 'Fri', sales: 1800, orders: 1200 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RevenueChart data={salesData} />
      <PerformanceChart data={performanceData} />
    </div>
  );
};