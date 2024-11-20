'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import { TabContent } from './TabContent';
import useStore from '../store';
import Navbar from './Navbar';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  const { user } = useStore();
  
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with full height - Removed border-r */}
      <aside 
        className={`
          fixed lg:relative
          w-64 h-screen
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-40 lg:z-0
          bg-white
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-800">FIELDSALE</h1>
        </div>
        
        {/* Sidebar Content */}
        <div className="h-[calc(100vh-4rem)]">
          <Sidebar
            isOpen={isOpen}
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
          />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
          role="button"
          tabIndex={0}
        />
      )}

      {/* Main Content Area with Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - Only has bottom border */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="h-16 pl-0 pr-4 mx-auto">
            <Navbar setSidebarOpen={setIsOpen} sidebarOpen={isOpen} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <TabContent activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;