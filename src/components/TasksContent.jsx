import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, getUserList } from '../api/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock3, AlertCircle, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store';

const LOCATIONS = [
  { id: 1, name: 'Downtown Office', latitude: -1.2921, longitude: 36.8219 },
  { id: 2, name: 'Westlands Branch', latitude: -1.2673, longitude: 36.8065 },
  { id: 3, name: 'Karen Hub', latitude: -1.3189, longitude: 36.7126 }
];

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
  const [filters, setFilters] = useState({ status: null, priority: null, assignedTo: null, location: null });
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'normal',
    assigned_to: '',
    location_id: '',
    status: 'pending'
  });

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isSalesRep = currentUser?.role === 'sales_rep';

  const { data: userList } = useQuery({
    queryKey: ['users'],
    queryFn: getUserList,
    select: (data) => data.users || [],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { data: managerSalesReps } = useQuery({
    queryKey: ['managerSalesReps', currentUser.id],
    queryFn: () => getUserList({ manager_id: currentUser.id }),
    enabled: isManager,
    select: (data) => data.users || [],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false
  });


  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const response = await getTasks();
        return response.data || { tasks: [] };
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
    staleTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsTaskDialogOpen(false);
      resetTaskForm();
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsTaskDialogOpen(false);
      resetTaskForm();
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      due_date: '',
      priority: 'normal',
      assigned_to: '',
      location_id: '',
      status: 'pending'
    });
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      due_date: task.due_date.split('T')[0],
      priority: task.priority,
      assigned_to: task.assigned_to,
      location_id: task.location_id,
      status: task.status
    });
    setIsTaskDialogOpen(true);
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (selectedTask) {
      updateTaskMutation.mutate({
        id: selectedTask.id,
        data: taskForm
      });
    } else {
      createTaskMutation.mutate(taskForm);
    }
  };

  const filteredTasks = Array.isArray(tasks?.tasks)
  ? tasks.tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.assignedTo || task.assigned_to.toString() === filters.assignedTo) &&
        (!filters.location || task.location_id.toString() === filters.location);

      if (isAdmin || isManager) {
        return matchesSearch && matchesFilters;
      } else if (isSalesRep) {
        return matchesSearch && matchesFilters && task.assigned_to === currentUser.id;
      }
      return false;
    })
  : [];

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Tasks Management</CardTitle>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {(isAdmin || isManager) && (
              <Button onClick={() => setIsTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Task
              </Button>
            )}
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
              <TableHead>Location</TableHead>
              {(isAdmin || isManager) && <TableHead>Assigned To</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{format(new Date(task.due_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={PRIORITY_COLORS[task.priority]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {STATUS_ICONS[task.status]}
                    {task.status.charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {LOCATIONS.find(loc => loc.id === task.location_id)?.name}
                </TableCell>
                {(isAdmin || isManager) && (
                  <TableCell>
                    {userList?.find(rep => rep.id === task.assigned_to)?.full_name}
                  </TableCell>
                )}
                <TableCell className="flex gap-2">
                  {(isAdmin || isManager || task.assigned_to === currentUser.id) && (
                    <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => deleteTaskMutation.mutate(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitTask}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={taskForm.priority}
                    onValueChange={(value) => setTaskForm({...taskForm, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(isAdmin || isManager) && (
                  <>
                    <div>
                      <Label htmlFor="assigned_to">Assign To</Label>
                      <Select
                        value={taskForm.assigned_to}
                        onValueChange={(value) => setTaskForm({...taskForm, assigned_to: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sales representative" />
                        </SelectTrigger>
                        <SelectContent>
                          {userList?.map(rep => (
                            <SelectItem key={rep.id} value={rep.id.toString()}>{rep.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={taskForm.location_id}
                        onValueChange={(value) => setTaskForm({...taskForm, location_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map(location => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(value) => setTaskForm({...taskForm, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsTaskDialogOpen(false);
                    resetTaskForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}