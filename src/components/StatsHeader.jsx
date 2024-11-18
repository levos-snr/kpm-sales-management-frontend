import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Target, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState('week')
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    activeSalesReps: 0,
    targetAchievement: 0,
    totalOrders: 0,
    salesTrends: [],
    salesRepPerformance: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesResponse, usersResponse, targetsResponse, ordersResponse] = await Promise.all([
          axios.get('/sales-records'),
          axios.get('/users?role=sales_rep'),
          axios.get('/sales-targets'),
          axios.get('/orders')
        ])

        const totalSales = salesResponse.data.reduce((sum, record) => sum + record.total_amount, 0)
        const activeSalesReps = usersResponse.data.filter(user => user.status === 'active').length
        const targetAchievement = targetsResponse.data.reduce((sum, target) => sum + (target.achieved_amount / target.target_amount) * 100, 0) / targetsResponse.data.length
        const totalOrders = ordersResponse.data.length

        const salesTrends = processSalesTrends(salesResponse.data, targetsResponse.data)
        const salesRepPerformance = processSalesRepPerformance(salesResponse.data, usersResponse.data, targetsResponse.data, ordersResponse.data)

        setSalesData({
          totalSales,
          activeSalesReps,
          targetAchievement,
          totalOrders,
          salesTrends,
          salesRepPerformance
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeFilter])

  const processSalesTrends = (salesRecords, targets) => {
    const trends = salesRecords.reduce((acc, record) => {
      const month = new Date(record.visit_date).toLocaleString('default', { month: 'short' })
      if (!acc[month]) {
        acc[month] = { actual: 0, target: 0 }
      }
      acc[month].actual += record.total_amount
      return acc
    }, {})

    targets.forEach(target => {
      const month = new Date(target.start_date).toLocaleString('default', { month: 'short' })
      if (trends[month]) {
        trends[month].target = target.target_amount
      }
    })

    return Object.entries(trends).map(([month, data]) => ({
      month,
      actual: data.actual,
      target: data.target
    }))
  }

  const processSalesRepPerformance = (salesRecords, users, targets, orders) => {
    return users.map(user => {
      const userSales = salesRecords.filter(record => record.user_id === user.id)
      const userOrders = orders.filter(order => order.user_id === user.id)
      const userTarget = targets.find(target => target.user_id === user.id)

      return {
        name: `${user.first_name} ${user.last_name}`,
        sales: userSales.reduce((sum, record) => sum + record.total_amount, 0),
        target: userTarget ? userTarget.target_amount : 0,
        customers: new Set(userSales.map(record => record.customer_id)).size,
        orders: userOrders.length,
        commission: userSales.reduce((sum, record) => sum + (record.total_amount * 0.05), 0)
      }
    })
  }

  const getMetrics = () => [
    {
      title: 'Total Sales',
      value: `Ksh ${salesData.totalSales.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Active Sales Reps',
      value: salesData.activeSalesReps.toString(),
      change: '+2',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Target Achievement',
      value: `${salesData.targetAchievement.toFixed(1)}%`,
      change: '+5.4%',
      changeType: 'positive',
      icon: Target
    },
    {
      title: 'Total Orders',
      value: salesData.totalOrders.toString(),
      change: '+12.3%',
      changeType: 'positive',
      icon: Activity
    }
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales Performance Dashboard</h1>
          <p className="text-gray-500">Monitor your sales team&apos;s performance and metrics</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMetrics().map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-full ${metric.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <metric.icon className="text-xl" />
                </div>
              </div>
              <p className={`text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.changeType === 'positive' ? <ArrowUpRight /> : <ArrowDownRight />}
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
