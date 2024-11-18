import React from 'react';
import {
  Users,
  Package,
  MessageSquare,
  ClipboardList,
  Settings,
  HelpCircle,
  MapPin,
  Calendar,
  DollarSign,
  User,
  ShoppingBasket,
  UsersRound,
  Store ,
  ListCheck,
  ClipboardMinus,
  Calendar1 ,
  DatabaseBackup,
  CalendarCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useStore from '../store';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <Button
    variant={active ? 'secondary' : 'ghost'}
    className="w-full justify-start transition-colors duration-200 hover:bg-gray-100"
    onClick={() => onClick(label.toLowerCase())}
  >
    <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
    <span className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
      {label}
    </span>
  </Button>
);

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const { user } = useStore();

  const adminMenuItems = [
    { icon: Package, label: 'Dashboard' },
    { icon: Users, label: 'Team' },
    { icon: Package, label: 'Products' },
    { icon: ClipboardList, label: 'Tasks' }
  ];

  const managerMenuItems = [
    { icon: Package, label: 'Dashboard' },
    { icon: Users, label: 'Team' },
    { icon: Package, label: 'Products' },
    { icon: ClipboardList, label: 'Tasks' }
  ];

  const salesRepMenuItems = [
    { icon: Package, label: 'Home' },
    { icon: ClipboardList, label: 'Tasks' },
    { icon: ShoppingBasket, label: 'Inventory' },
    { icon: CalendarCheck2, label: 'Visit Scheduling ' },
    { icon: Store, label: 'Customer' },
    { icon: ListCheck, label: 'Product Catalog' },
    { icon: ClipboardMinus , label: 'Sales Reports' },
    { icon: Calendar1, label: 'Visit Planner ' },
    { icon: DatabaseBackup, label: 'Data Recording' },
    { icon: UsersRound, label: 'Team Announcements' },
    
    
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
    <aside className={`
      fixed top-0 left-0 h-full
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      transition-transform duration-300 ease-in-out
      bg-white border-r border-gray-200
      w-64 z-30 lg:relative lg:block
      overflow-y-auto
    `}>
      <div className="sticky top-0 bg-white p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
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