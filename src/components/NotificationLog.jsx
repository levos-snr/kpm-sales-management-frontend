import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationLog = () => {
  const [open, setOpen] = useState(false);
  
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #12345 was placed by John Doe",
      time: "5 minutes ago",
      type: "order"
    },
    {
      id: 2,
      title: "Payment Success",
      message: "Payment received for Order #12344",
      time: "1 hour ago",
      type: "payment"
    },
    {
      id: 3,
      title: "Low Stock Alert",
      message: "Product 'Widget X' is running low",
      time: "2 hours ago",
      type: "alert"
    }
  ];

  const getNotificationColor = (type) => {
    const colors = {
      order: "bg-blue-100 text-blue-600",
      payment: "bg-green-100 text-green-600",
      alert: "bg-red-100 text-red-600"
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" className="text-xs">
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="px-2 py-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationLog;