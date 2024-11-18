import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import { TabContent } from './TabContent';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsOpen(false);
        }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <TabContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default Layout;