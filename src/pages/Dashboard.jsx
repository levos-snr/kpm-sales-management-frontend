import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { TabContent } from '../components/TabContent';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-screen flex flex-col">
    <div className="flex-none">
      <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
    </div>  
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-6">
            <TabContent activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
