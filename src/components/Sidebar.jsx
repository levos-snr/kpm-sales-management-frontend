import React from 'react';
import { Users, Package, MessageSquare, ClipboardList, Settings, HelpCircle, MapPin, Calendar, DollarSign, User, ShoppingBasket, UsersRound, Store, ListChecksIcon as ListCheck, ClipboardMinus, CalendarIcon as Calendar1, DatabaseBackup, CalendarCheck2, ClockIcon as ClockArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useStore from '../store';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <Button
    variant={active ? 'secondary' : 'ghost'}
    className={`
      w-full justify-start py-2 px-3
      transition-colors duration-200
      hover:bg-gray-100
      ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}
    `}
    onClick={() => onClick(label.toLowerCase())}
  >
    <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const { user } = useStore();
  const menuItems = {
    admin: [
      { icon: Package, label: 'Dashboard' },
      { icon: Users, label: 'Team' },
      { icon: Package, label: 'Products' },
      { icon: ClipboardList, label: 'Tasks' }
    ],
    manager: [
      { icon: Package, label: 'Dashboard' },
      { icon: Users, label: 'Team' },
      { icon: Package, label: 'Products' },
      { icon: ClipboardList, label: 'Tasks' }
    ],
    sales_rep: [
      { icon: ClipboardMinus, label: 'Dashboard' },
      { icon: ClipboardList, label: 'Tasks' },
      { icon: ShoppingBasket, label: 'Inventory' },
      { icon: CalendarCheck2, label: 'Shedule' },
      { icon: Store, label: 'Customers' },
      { icon: ListCheck, label: 'Catalog' },
      { icon: ClockArrowDown, label: 'Orders' },
      { icon: Calendar1, label: 'Visit Planner' },
      { icon: DatabaseBackup, label: 'Data Recording' },
      { icon: UsersRound, label: 'Team Announcements' }
    ]
  };

  const renderMenuItems = () => menuItems[user.role] || menuItems.admin;

  return (
    <aside className="w-64 h-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
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
      </div>
    </aside>
  );
};

export default Sidebar;