import React, { useEffect } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserAvatarMenu from './UserAvatarMenu';
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
    <nav className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center flex-shrink-0 ml-4">
              <span className="text-2xl font-bold text-gray-900">
                FIELDSALE
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden lg:block">
              <div className="flex items-center">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center ml-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <UserAvatarMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;