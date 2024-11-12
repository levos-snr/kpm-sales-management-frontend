import React from 'react';
import { DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, change, isPositive }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        {change} from last month
      </p>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      icon: DollarSign,
      change: '+20.1%',
      isPositive: true
    },
    {
      title: 'New Customers',
      value: '+2350',
      icon: Users,
      change: '+18.2%',
      isPositive: true
    },
    {
      title: 'Active Users',
      value: '+12,234',
      icon: Users,
      change: '-2.5%',
      isPositive: false
    },
    {
      title: 'Total Sales',
      value: '12,234',
      icon: DollarSign,
      change: '+4.1%',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;