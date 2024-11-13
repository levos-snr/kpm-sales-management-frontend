import React from 'react';
import { DashboardContent } from './DashboardContent';
import { TeamContent } from './TeamContent';
import  ProductsContent  from './ProductsContent';
// Import other content components

export const TabContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'team':
        return <TeamContent />;
      case 'products':
        return <ProductsContent />;
      // Add cases for other tabs
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex-1 p-6 lg:ml-20">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};