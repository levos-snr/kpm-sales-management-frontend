import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CalendarIcon, Timer, MapPin } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import SalesReportForm from './SalesReportForm'
import useStore from '../store'
import { useNavigate } from 'react-router-dom'

const isDev = import.meta.env.MODE === 'development'
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD
axios.defaults.headers.common['Content-Type'] = 'application/json'

const createCheckInOut = async (data) => {
  const response = await axios.post('/attendance/check-in-out', data)
  return response.data
}

const fetchAttendanceRecords = async () => {
  const response = await axios.get('/attendance/check-in-out')
  return response.data
}

const fetchLocationSuggestions = async (query) => {
  if (query.length < 3) return []
  const response = await axios.get('/geocode', { params: { q: query } })
  return response.data.results
}

const fetchCustomers = async () => {
  const response = await axios.get('/customers')
  return response.data
}

export default function CheckInOutSystem() {
  const [date, setDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState('check_in')
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSalesReport, setShowSalesReport] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

  const { user } = useStore()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  // attendance
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ['attendanceRecords'],
    queryFn: fetchAttendanceRecords
  })

  // customers
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  })

  //current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'hh:mm a'))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // location suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationQuery.length >= 3) {
        setIsLoadingSuggestions(true)
        try {
          const suggestions = await fetchLocationSuggestions(locationQuery)
          setLocationSuggestions(suggestions)
        } catch (error) {
          console.error('Error fetching location suggestions:', error)
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setLocationSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [locationQuery])

  const checkInOutMutation = useMutation({
    mutationFn: createCheckInOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendanceRecords'] })
      setIsDialogOpen(false)
      if (actionType === 'check_in') {
        setShowSalesReport(true)
      }
    }
  })

  const handleAction = () => {
    if (!selectedLocation && actionType === 'check_in') {
      console.error('Location is required for check-in');
      return;
    }
  
    const data = {
      action: actionType,
      latitude: selectedLocation ? selectedLocation.lat : null,
      longitude: selectedLocation ? selectedLocation.lng : null
    };
  
    checkInOutMutation.mutate(data, {
      onSuccess: (responseData) => {
        console.log('Check-in/out successful:', responseData);
        queryClient.invalidateQueries({ queryKey: ['attendanceRecords'] });
        setIsDialogOpen(false);
        if (actionType === 'check_in') {
          setShowSalesReport(true);
        }
      },
      onError: (error) => {
        console.error('Check-in/out failed:', error.response?.data?.error || error.message);
        // TODO: error message to user
      }
    });
  };
  
  const openDialog = (type) => {
    setActionType(type)
    setIsDialogOpen(true)
    if (type === 'check_in') {
      setLocationQuery('')
      setSelectedLocation(null)
    }
  }

  const handleSalesReportSubmit = async (salesReportData) => {
    try {
      const response = await axios.post('/sales-report', {
        ...salesReportData,
        companyId: user.company_id,
        userId: user.id,
        customerId: selectedCustomerId
      })
      setShowSalesReport(false)
      console.log('Sales report submitted successfully:', response.data)
      navigate('/checkout')
    } catch (error) {
      console.error('Error submitting sales report:', error)
    }
  }

  // 3alculate statistics
  const calculateStats = (records) => {
    if (!records || records.length === 0) return { onTime: 0, late: 0, totalWorkingHours: '00:00:00' }

    let onTimeCount = 0
    let totalWorkingMinutes = 0

    records.forEach(record => {
      const checkInTime = new Date(`2000-01-01 ${record.check_in_time}`)
      if (checkInTime <= new Date(`2000-01-01 09:00 AM`)) {
        onTimeCount++
      }

      if (record.working_hours) {
        const [hours, minutes] = record.working_hours.split(':')
        totalWorkingMinutes += parseInt(hours) * 60 + parseInt(minutes)
      }
    })

    const onTimePercentage = (onTimeCount / records.length) * 100
    const latePercentage = 100 - onTimePercentage

    const totalWorkingHours = Math.floor(totalWorkingMinutes / 60)
    const totalWorkingMinutesRemainder = totalWorkingMinutes % 60

    return {
      onTime: Math.round(onTimePercentage),
      late: Math.round(latePercentage),
      totalWorkingHours: `${totalWorkingHours.toString().padStart(2, '0')}:${totalWorkingMinutesRemainder.toString().padStart(2, '0')}:00`
    }
  }

  const stats = attendanceData ? calculateStats(attendanceData.attendance_records) : { onTime: 0, late: 0, totalWorkingHours: '00:00:00' }

  if (isLoading) return <div>Loading attendance records...</div>
  if (error) return <div>Error loading attendance records: {error.message}</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Time Percentage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTime}%</div>
            <Progress value={stats.onTime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Percentage</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.late}%</div>
            <Progress value={stats.late} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Working Hours</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkingHours}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl font-bold">{currentTime}</div>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => openDialog('check_in')}
                className="w-32"
              >
                Check In
              </Button>
              <Button
                size="lg"
                onClick={() => openDialog('check_out')}
                variant="outline"
                className="w-32"
              >
                Check Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.attendance_records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.check_in_time}</TableCell>
                  <TableCell>{record.check_out_time || 'Not checked out'}</TableCell>
                  <TableCell>{record.working_hours || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={record.check_in_time <= "09:00 AM" ? "success" : "destructive"}>
                      {record.check_in_time <= "09:00 AM" ? "On Time" : "Late"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'check_in' ? 'Check In' : 'Check Out'} Confirmation
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Current Time: {currentTime}</p>
            {actionType === 'check_in' && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                {isLoadingSuggestions && <p className="text-sm text-muted-foreground">Loading suggestions...</p>}
                {locationSuggestions.length > 0 && (
                  <ul className="mt-2 max-h-40 overflow-auto border rounded-md">
                    {locationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(suggestion)
                          setLocationQuery(suggestion.name)
                          setLocationSuggestions([])
                        }}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {selectedLocation && actionType === 'check_in' && (
              <div className="space-y-2">
                <p className="font-semibold">Selected Location:</p>
                <p>{selectedLocation.name}</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={(!selectedLocation && actionType === 'check_in') || checkInOutMutation.isPending}
            >
              {checkInOutMutation.isPending ?
                'Processing...' :
                actionType === 'check_in' ? 'Confirm Check In' : 'Confirm Check Out'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSalesReport} onOpenChange={setShowSalesReport}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Sales Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer</Label>
              <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCustomers ? (
                    <SelectItem value="">Loading customers...</SelectItem>
                  ) : (
                    customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <SalesReportForm
              companyId={user.company_id}
              userId={user.id}
              customerId={selectedCustomerId}
              onSubmit={handleSalesReportSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}