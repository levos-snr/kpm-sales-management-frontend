import React, { useEffect } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserAvatarMenu from './UserAvatarMenu';
import NotificationLog from './NotificationLog';
import useStore from '../store';

const Navbar = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.user,
      (user) => setUser(user)
    );
    return unsubscribe;
  }, [setUser]);

  return (
    <div className="flex items-center justify-between h-full">
      {/* Left Section */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </Button>
        
        <div className="hidden lg:flex items-center space-x-4">
          {/* will put something */}
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <NotificationLog />
        </div>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2" />
        
        <UserAvatarMenu user={user} />
      </div>
    </div>
  );
};

export default Navbar;