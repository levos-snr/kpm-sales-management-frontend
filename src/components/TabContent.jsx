import React from 'react';
import { DashboardContent } from './DashboardContent';
import TeamContent  from './TeamContent';
import ProductsContent from './ProductsContent';
import LocationsContent from './LocationsContent';
import TasksContent from './TasksContent';
import SalesrepDashboard from './salerepDash';
import Salesinvntory from './Salesinvntory';
import useStore from '../store';


export const TabContent = ({ activeTab }) => {
  const { user } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <SalesrepDashboard userRole={user.role} />;
      case 'dashboard':
        return <DashboardContent userRole={user.role} />;
      case 'team':
        return <TeamContent userRole={user.role} />;
      case 'products':
        return <ProductsContent userRole={user.role} />;
      case 'locations':
        return <LocationsContent userRole={user.role} />;
      case 'tasks':
        return <TasksContent userRole={user.role} />;
      case 'inventory':
        return <Salesinvntory userRole={user.role} />;
      default:
        return <DashboardContent userRole={user.role} />;
        
    }
  };

  return (
    <div className="flex-1 p-6 lg:ml-10  ">
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  );
};
