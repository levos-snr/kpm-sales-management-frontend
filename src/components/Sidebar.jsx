import React from 'react';
import {
  Users,
  Package,
  MessageSquare,
  ClipboardList,
  Settings,
  HelpCircle,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useStore from '../store';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <Button
    variant={active ? 'secondary' : 'ghost'}
    className="w-full justify-start"
    onClick={() => onClick(label.toLowerCase())}
  >
    <Icon className="mr-3 h-5 w-5 text-gray-500" />
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </Button>
);

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const { user } = useStore();

  const adminMenuItems = [
    { icon: Package, label: 'Dashboard' },
    { icon: Users, label: 'Team' },
    { icon: Package, label: 'Products' },
    { icon: ClipboardList, label: 'Reports' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: MapPin, label: 'Locations' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
  ];

  const managerMenuItems = [
    { icon: Package, label: 'Dashboard' },
    { icon: Users, label: 'Team' },
    { icon: Package, label: 'Products' },
    { icon: ClipboardList, label: 'Reports' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: MapPin, label: 'Locations' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
  ];

  const salesRepMenuItems = [
    { icon: Package, label: 'Dashboard' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
    { icon: ClipboardList, label: 'Tasks' },
  ];

  const renderMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return adminMenuItems;
      case 'manager':
        return managerMenuItems;
      case 'sales_rep':
        return salesRepMenuItems;
      default:
        return adminMenuItems;
    }
  };

  return (
    <aside
      className={`
        ${isOpen ? 'block' : 'hidden'} 
        lg:block 
        w-64 
        bg-white 
        border-r 
        border-gray-200 
        flex-none
        h-full
        overflow-y-hidden
      `}
    >
      <div className="p-4 h-full">
        <nav className="space-y-1">
          {renderMenuItems().map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.label.toLowerCase()}
              onClick={setActiveTab}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;