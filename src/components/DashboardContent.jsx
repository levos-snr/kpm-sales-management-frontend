import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CalendarIcon, DollarSign, MapPin, ShoppingCart, TrendingUp, Users, Package, ClipboardList, Target } from 'lucide-react'
import axios from 'axios'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export const DashboardContent = () => {
  const [overviewData, setOverviewData] = useState({
    total_sales: 0,
    new_customers: 0,
    active_sales_reps: 0,
    completed_tasks: 0
  })
  const [salesData, setSalesData] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [productPerformance, setProductPerformance] = useState([])
  const [territories, setTerritories] = useState([])
  const [salesReps, setSalesReps] = useState([])
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedSalesRep, setSelectedSalesRep] = useState('')
  const [salesRepPerformance, setSalesRepPerformance] = useState({
    total_sales: 0,
    visits_completed: 0,
    new_customers: 0,
    tasks_completed: 0
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          overviewResponse,
          salesResponse,
          activitiesResponse,
          productResponse,
          territoriesResponse,
          salesRepsResponse
        ] = await Promise.all([
          axios.get('/dashboard/overview'),
          axios.get('/dashboard/sales_overview'),
          axios.get('/dashboard/recent_activities'),
          axios.get('/dashboard/product_performance'),
          axios.get('/territories'),
          axios.get('/sales_reps')
        ])

        setOverviewData(overviewResponse.data)
        setSalesData(salesResponse.data)
        setRecentActivities(activitiesResponse.data)
        setProductPerformance(productResponse.data)
        setTerritories(territoriesResponse.data)
        setSalesReps(salesRepsResponse.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError(`Error fetching dashboard data: ${error.message}`)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const fetchSalesRepPerformance = async () => {
      if (selectedSalesRep) {
        try {
          const response = await axios.get(`/sales_rep_performance/${selectedSalesRep}`)
          setSalesRepPerformance(response.data)
        } catch (error) {
          console.error('Error fetching sales rep performance:', error)
          setError(`Error fetching sales rep performance: ${error.message}`)
        }
      }
    }

    fetchSalesRepPerformance()
  }, [selectedSalesRep])

  if (error) {
    return (
      <Card className="w-full p-4 bg-red-100 border-red-300">
        <CardContent>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">Please check the console for more details.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales Management Dashboard</h1>
        <div className="flex space-x-2">
          <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Territory" />
            </SelectTrigger>
            <SelectContent>
              {territories.map((territory) => (
                <SelectItem key={territory.id} value={territory.id.toString()}>{territory.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh.{overviewData.total_sales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{overviewData.new_customers}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sales Reps</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.active_sales_reps}</div>
            <p className="text-xs text-muted-foreground">Currently on field</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.completed_tasks}</div>
            <p className="text-xs text-muted-foreground">+201 since last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance vs target</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>
                      {activity.customer || activity.location}
                      {activity.amount && ` - ${activity.amount}`}
                    </TableCell>
                    <TableCell>{new Date(activity.time).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Rep Performance</CardTitle>
            <CardDescription>Select a sales rep to view their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedSalesRep} onValueChange={setSelectedSalesRep}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id.toString()}>{rep.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Ksh.{salesRepPerformance.total_sales.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Visits Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesRepPerformance.visits_completed}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesRepPerformance.new_customers}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesRepPerformance.tasks_completed}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Top selling products</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="space-y-4">
              <div className="flex flex-wrap gap-4 mt-4">
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" /> New Order
                </Button>
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                </Button>
                <Button>
                  <Target className="mr-2 h-4 w-4" /> Set Sales Target
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4">
              <div className="flex flex-wrap gap-4 mt-4">
                <Button>
                  <Users className="mr-2 h-4 w-4" /> Add Customer
                </Button>
                <Button>
                  <MapPin className="mr-2 h-4 w-4" /> Customer Visit
                </Button>
                <Button>
                  <ClipboardList className="mr-2 h-4 w-4" /> Customer Report
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4">
              <div className="flex flex-wrap gap-4 mt-4">
                <Button>
                  <Package className="mr-2 h-4 w-4" /> Add Product
                </Button>
                <Button>
                  <ClipboardList className="mr-2 h-4 w-4" /> Stock Check
                </Button>
                <Button>
                  <TrendingUp className="mr-2 h-4 w-4" /> Inventory Report
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="space-y-4">
              <div className="flex flex-wrap gap-4 mt-4">
                <Button>
                  <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Task
                </Button>
                <Button>
                  <ClipboardList className="mr-2 h-4 w-4" /> Task List
                </Button>
                <Button>
                  <TrendingUp className="mr-2 h-4 w-4" /> Task Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}