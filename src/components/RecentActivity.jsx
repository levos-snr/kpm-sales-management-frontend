// components/RecentActivity.jsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

const ActivityItem = ({ avatar, name, action, amount, time, orderId }) => (
  <div className="flex items-center space-x-4">
    <Avatar className="h-9 w-9">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{action}</p>
      <p className="text-sm text-gray-500">
        Order #{orderId} - ${amount}
      </p>
    </div>
    <div className="text-sm text-gray-500">
      {time}
    </div>
  </div>
);

export const RecentActivity = () => {
  // Sample data - replace with your actual data
  const activities = [
    {
      id: 1,
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      action: 'New order placed',
      amount: '1,234.56',
      orderId: '123456',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '/api/placeholder/32/32',
      action: 'Updated order status',
      amount: '842.19',
      orderId: '123457',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '/api/placeholder/32/32',
      action: 'Completed delivery',
      amount: '2,156.00',
      orderId: '123458',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: '/api/placeholder/32/32',
      action: 'New order placed',
      amount: '965.42',
      orderId: '123459',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: 5,
      name: 'Robert Brown',
      avatar: '/api/placeholder/32/32',
      action: 'Updated order status',
      amount: '1,754.30',
      orderId: '123460',
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              avatar={activity.avatar}
              name={activity.name}
              action={activity.action}
              amount={activity.amount}
              orderId={activity.orderId}
              time={formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};