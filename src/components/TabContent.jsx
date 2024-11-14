import React from 'react';
import { DashboardContent } from './DashboardContent';
import { TeamContent } from './TeamContent';
import ProductsContent from './ProductsContent';
import ReportsContent from './ReportsContent';
import MessageContent from './MessageContent';
import LocationsContent from './LocationsContent';
import SettingsContent from './SettingsContent';
import SupportContent from './SupportContent';
import TasksContent from './TasksContent';
import useStore from '../store';

export const TabContent = ({ activeTab }) => {
  const { user } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent userRole={user.role} />;
      case 'team':
        return <TeamContent userRole={user.role} />;
      case 'products':
        return <ProductsContent userRole={user.role} />;
      case 'reports':
        return <ReportsContent userRole={user.role} />;
      case 'messages':
        return <MessageContent userRole={user.role} />;
      case 'locations':
        return <LocationsContent userRole={user.role} />;
      case 'settings':
        return <SettingsContent userRole={user.role} />;
      case 'support':
        return <SupportContent userRole={user.role} />;
      case 'tasks':
        return <TasksContent userRole={user.role} />;
      default:
        return <DashboardContent userRole={user.role} />;
    }
  };

  return (
    <div className="flex-1 p-6 lg:ml-20">
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  );
};