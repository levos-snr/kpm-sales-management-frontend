import React from 'react';
import  DashboardStats  from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivity } from './RecentActivity';

export const DashboardContent = () => {
  return (
    <>
      <DashboardStats />
      <DashboardCharts />
      <RecentActivity />
    </>
  );
};