import React from 'react';
import { DashboardContent } from './DashboardContent';
import TeamContent from './TeamContent';
import ProductsContent from './ProductsContent';
import LocationsContent from './LocationsContent';
import TasksContent from './TasksContent';
import Salesinvntory from './Salesinvntory';
import SalesShedule from './SalesShedule';
import SalerepPoducts from './SalerepPoducts';
import CustomersContent from './CustomerDasbord';
import Orders from './Orders';
import useStore from '../store';
import ReportSalesrep from './ReportSalesrep';

export const TabContent = ({ activeTab }) => {
  const { user } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user.role === 'sales_rep' ? 
          <ReportSalesrep userRole={user.role} /> : 
          <DashboardContent userRole={user.role} />;
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
      case 'check in':
        return <SalesShedule userRole={user.role} />;
      case 'catalog':
        return <SalerepPoducts userRole={user.role} />;
      case 'customers':
        return <CustomersContent userRole={user.role} />;
      case 'orders':
        return <Orders userRole={user.role} />;
      default:
        return user.role === 'sales_rep' ? 
          <ReportSalesrep userRole={user.role} /> : 
          <DashboardContent userRole={user.role} />;
    }
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};