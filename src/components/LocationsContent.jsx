import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api/task';
import { getUserList } from '../api/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Filter, Search, MoreVertical, CheckCircle2, Clock3, AlertCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store';

const TaskManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    assigned_to: '',
    title: '',
    description: '',
    due_date: '',
    priority: 'normal',
    territory_id: ''
  });
  const currentUser = useStore((state) => state.user)

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUserList
  });

  const teamMembers = Array.isArray(users) 
    ? users.filter(user => 
        (currentUser.role === 'admin' || currentUser.role === 'manager') && 
        (user.role === 'sales_rep' || user.role === 'manager')
      )
    : [];

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateDialogOpen(false);
      setNewTask({
        assigned_to: '',
        title: '',
        description: '',
        due_date: '',
        priority: 'normal',
        territory_id: ''
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleCreateTask = () => {
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateTask = (id, updatedTask) => {
    updateTaskMutation.mutate({ id, data: updatedTask });
  };

  const handleDeleteTask = (id) => {
    deleteTaskMutation.mutate(id);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isUserTask = 
      currentUser.role === 'admin' || 
      (currentUser.role === 'manager' && task.assigned_by === currentUser.id) ||
      (currentUser.role === 'sales_rep' && task.assigned_to === currentUser.id);

    return matchesPriority && matchesStatus && matchesSearch && isUserTask;
  });

  if (isLoadingTasks) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Sales Task Management</CardTitle>
          <div className="flex gap-2">
            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Sales Task</DialogTitle>
                  </DialogHeader>
                  {/* Task creation form */}
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              currentUser={currentUser}  
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TaskCard = ({ task, onUpdate, onDelete, currentUser }) => {
  const queryClient = useQueryClient();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [salesReport, setSalesReport] = useState({
    customer_id: '',
    total_amount: '',
    payment_method: '',
    notes: '',
    products: []
  });

  if (!currentUser) {
    return null; 
  }

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50',
      high: 'text-orange-600 bg-orange-50',
      normal: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    };
    return colors[priority] || colors.normal;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': <CheckCircle2 className="h-4 w-4 text-green-500" />,
      'in_progress': <Clock3 className="h-4 w-4 text-blue-500" />,
      'pending': <AlertCircle className="h-4 w-4 text-yellow-500" />,
      'cancelled': <AlertCircle className="h-4 w-4 text-red-500" />
    };
    return icons[status] || icons.pending;
  };

  const submitReportMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsReportDialogOpen(false);
    }
  });

  const handleSubmitReport = () => {
    submitReportMutation.mutate({
      id: task.id,
      data: { 
        status: 'completed', 
        sales_report: salesReport 
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{task.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onUpdate(task.id, { status: 'in_progress' })}>
                    Start Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                    Complete Task & Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                {task.location ? task.location : 'No location'}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                {task.status.charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2 mt-2">
                {currentUser?.role !== 'sales_rep' && task.assignee && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                )}
                <span className="text-sm text-gray-600">
                  {currentUser?.role === 'sales_rep' ? 'Assigned to you' : `Assigned to: ${task.assignee?.name || 'Unassigned'}`}
                </span>
              </div>
            <div className="text-sm text-gray-500">
              Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sales Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer_id" className="text-right">
                Customer ID
              </Label>
              <Input
                id="customer_id"
                value={salesReport.customer_id}
                onChange={(e) => setSalesReport({...salesReport, customer_id: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_amount" className="text-right">
                Total Amount
              </Label>
              <Input
                id="total_amount"
                type="number"
                value={salesReport.total_amount}
                onChange={(e) => setSalesReport({...salesReport, total_amount: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment_method" className="text-right">
                Payment Method
              </Label>
              <Select
                value={salesReport.payment_method}
                onValueChange={(value) => setSalesReport({...salesReport, payment_method: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={salesReport.notes}
                onChange={(e) => setSalesReport({...salesReport, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskManagement;
