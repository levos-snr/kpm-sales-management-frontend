import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, updateTask, checkIn, checkOut, logUnmappedVisit } from '../api/task';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock3, AlertCircle, Search, MapPin, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store';
import { Toast } from "@/components/ui/toast";
import { Calendar } from "@/components/ui/calendar";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const PRIORITY_COLORS = {
  urgent: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  normal: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50'
};

const STATUS_ICONS = {
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  in_progress: <Clock3 className="h-4 w-4 text-blue-500" />,
  pending: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  cancelled: <AlertCircle className="h-4 w-4 text-red-500" />
};

export default function TasksContent() {
  const queryClient = useQueryClient();
  const currentUser = useStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [salesReport, setSalesReport] = useState({
    customer_id: '',
    total_amount: '',
    payment_method: '',
    notes: '',
    products: []
  });
  const [location, setLocation] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', currentUser.id, selectedDate],
    queryFn: () => getTasks({ assigned_to: currentUser.id, date: format(selectedDate, 'yyyy-MM-dd') }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', currentUser.id, selectedDate] });
      setIsReportDialogOpen(false);
      setSelectedTask(null);
      setSalesReport({
        customer_id: '',
        total_amount: '',
        payment_method: '',
        notes: '',
        products: []
      });
      showToastMessage('Task updated successfully');
    }
  });

  const checkInMutation = useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      setIsCheckedIn(true);
      showToastMessage('Checked in successfully');
    },
    onError: (error) => {
      showToastMessage(`Check-in failed: ${error.message}`);
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      setIsCheckedIn(false);
      showToastMessage('Checked out successfully');
    },
    onError: (error) => {
      showToastMessage(`Check-out failed: ${error.message}`);
    }
  });

  const logUnmappedVisitMutation = useMutation({
    mutationFn: logUnmappedVisit,
    onSuccess: () => {
      showToastMessage('Unmapped visit logged successfully');
    },
    onError: (error) => {
      showToastMessage(`Failed to log unmapped visit: ${error.message}`);
    }
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const handleMarkAsDone = (task) => {
    setSelectedTask(task);
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (selectedTask) {
      updateTaskMutation.mutate({
        id: selectedTask.id,
        data: { 
          status: 'completed', 
          sales_report: salesReport 
        }
      });
    }
  };

  const handleCheckIn = () => {
    if (location) {
      checkInMutation.mutate({ location });
    } else {
      showToastMessage('Unable to get current location');
    }
  };

  const handleCheckOut = () => {
    if (location) {
      checkOutMutation.mutate({ location });
    } else {
      showToastMessage('Unable to get current location');
    }
  };

  const handleLogUnmappedVisit = () => {
    if (location) {
      logUnmappedVisitMutation.mutate({ location });
    } else {
      showToastMessage('Unable to get current location');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="p-6 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>My Tasks</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{format(new Date(task.due_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.normal}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {STATUS_ICONS[task.status] || STATUS_ICONS.pending}
                      {task.status.charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.status !== 'completed' && (
                      <Button onClick={() => handleMarkAsDone(task)}>Mark as Done</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check-In/Check-Out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={handleCheckIn} disabled={isCheckedIn}>
              <MapPin className="mr-2 h-4 w-4" /> Check-In
            </Button>
            <Button onClick={handleCheckOut} disabled={!isCheckedIn}>
              <LogOut className="mr-2 h-4 w-4" /> Check-Out
            </Button>
            <Button onClick={handleLogUnmappedVisit}>
              Log Unmapped Visit
            </Button>
          </div>
        </CardContent>
      </Card>

      {location && (
        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px', width: '100%' }}>
              <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    Your current location
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Sales Report</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReport}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="customer_id">Customer ID</Label>
                <Input
                  id="customer_id"
                  value={salesReport.customer_id}
                  onChange={(e) => setSalesReport({...salesReport, customer_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={salesReport.total_amount}
                  onChange={(e) => setSalesReport({...salesReport, total_amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={salesReport.payment_method}
                  onValueChange={(value) => setSalesReport({...salesReport, payment_method: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={salesReport.notes}
                  onChange={(e) => setSalesReport({...salesReport, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {showToast && (
        <Toast>
          <p>{toastMessage}</p>
        </Toast>
      )}
    </div>
  );
}