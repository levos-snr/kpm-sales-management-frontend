import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Bell,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/product'

export default function ComponentStat() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (data) => data.products || [],
    staleTime: 1000 * 60 * 5,
  })

  const stats = [
    {
      title: 'Total Sales',
      value: 'Ksh.528k',
      change: '+2.5%',
      changeType: 'positive',
      badge: { text: 'NEW', color: 'blue' },
      icon: ArrowUpRight,
    },
    {
      title: 'Todays Sales',
      value: 'Ksh.87k',
      change: '+1.2%',
      changeType: 'positive',
      badge: { text: 'USED', color: 'orange' },
      icon: ArrowUpRight,
    },
    {
      title: 'Total Products',
      value: productsData?.length?.toString() || '0',
      change: '-0.8%',
      changeType: 'negative',
      icon: ArrowDownRight,
    },
    {
      title: 'Products Sold',
      value: '22',
      change: '+1.5%',
      changeType: 'positive',
      icon: ArrowUpRight,
    },
    {
      title: 'Todays Visitors',
      value: 'Ksh.87k',
      change: '+0.8%',
      changeType: 'positive',
      icon: ArrowUpRight,
    },
  ];

  const handleDropdownOpen = (index) => {
    setActiveDropdown(index);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  const handleAction = (action, item) => {
    switch (action) {
      case 'view':
        console.log('Viewing details for:', item.title);
        break;
      case 'export':
        console.log('Exporting data for:', item.title);
        break;
      case 'alert':
        console.log('Setting alert for:', item.title);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 bg-white rounded-lg mb-10">
      {stats.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={`border border-gray-100 relative transition-all duration-200 ${
              hoveredCard === index ? 'shadow-lg' : 'shadow-sm'
            }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <DropdownMenu
              onOpenChange={(open) =>
                open ? handleDropdownOpen(index) : handleDropdownClose()
              }
            >
              <DropdownMenuTrigger asChild>
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleAction('view', item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('export', item)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAction('alert', item)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Set Alert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CardContent className="p-4 pt-8 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{item.title}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs bg-${item.badge.color}-100 text-${item.badge.color}-700 rounded-full font-medium`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold tracking-tight">
                  {item.value}
                </span>
                <div
                  className={`flex items-center text-xs ${
                    item.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
