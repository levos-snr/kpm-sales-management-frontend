
import React, { useState,useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart, Activity, Users, Package, Download, FileDown, DollarSign, CheckCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import useStore from '../store';

const fetchDashboardOverview = async () => {
  const response = await axios.get('/dashboard/overview');
  return response.data;
};



const fetchRecentActivities = async () => {
  const response = await axios.get('/dashboard/recent_activities');
  return response.data;
};

const salerep = async () => {
  const response = await axios.get('/sales_reps');
  return response.data;
};

export default function AdvancedDashboard() {
  const { activeTab, setActiveTab, user } = useStore();

  

  
  const { data: overviewData, isLoading: isOverviewLoading, error: overviewError } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: fetchDashboardOverview,
  });

  const { data: recentActivities, isLoading: isActivitiesLoading, error: activitiesError } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: fetchRecentActivities,
  });
  
  const { data: salesReps, isLoading: isSalesRepsLoading, error: salesRepsError } = useQuery({
    queryKey: ['salesReps'],
    queryFn: salerep,
  });
  
  
  


  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
  };
   
  const StatCard = ({ icon: Icon, title, value, subtext }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );

  if (isOverviewLoading || isActivitiesLoading) return <div>Loading...</div>;
  if (overviewError || activitiesError) return <div>An error occurred: {overviewError?.message || activitiesError?.message}</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.first_name || 'Sales Representative'}
            </p>
          </div>
          <div className="flex gap-4">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign Out Button */}
            <Button 
              variant="outline"
              onClick={() => useStore.getState().clearAuth()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="map">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={DollarSign}
                title="Total Sales"
                value={`Ksh. ${overviewData.total_sales.toLocaleString()}`}
                subtext="Last 30 days"
              />
              <StatCard
                icon={Users}
                title="New Customers"
                value={overviewData.new_customers}
                subtext="Last 30 days"
              />
              <StatCard
                icon={Users}
                title="Active Sales Reps"
                value={overviewData.active_sales_reps}
                subtext="Currently active"
              />
              <StatCard
                icon={CheckCircle}
                title="Completed Tasks"
                value={overviewData.completed_tasks}
                subtext="Last 30 days"
              />
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>
                          {activity.type === 'Sale' 
                            ? `${activity.customer} - ${activity.amount}`
                            : activity.location}
                        </TableCell>
                        <TableCell>{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Performance data visualization would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p>An interactive map showing visited locations would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}