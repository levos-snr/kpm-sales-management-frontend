import React from 'react';
import DashboardStats from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import StatsHeader from '../components/Farhiyasta';

export const DashboardContent = () => {
  return (
    <>
      {/* <DashboardStats /> */}
      <StatsHeader />
      <DashboardCharts />
    </>
  );
};
