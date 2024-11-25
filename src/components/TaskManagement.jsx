import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, generateTaskReport } from '../api/task';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ClipboardList, TrendingUp, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

const PRIORITY_COLORS = {
  urgent: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  normal: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50'
};

const TaskManagement = () => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    assignee: '',
    description: '',
    priority: 'normal'
  });
  const [reportParams, setReportParams] = useState({
    type: '',
    startDate: '',
    endDate: ''
  });

  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      setIsScheduleOpen(false);
      setNewTask({ title: '', dueDate: '', assignee: '', description: '', priority: 'normal' });
      toast({
        title: "Success",
        description: "Task scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule task",
        variant: "destructive",
      });
    }
  });

  const generateReportMutation = useMutation({
    mutationFn: generateTaskReport,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Task report generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate task report",
        variant: "destructive",
      });
    }
  });

  const handleScheduleTask = (e) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    generateReportMutation.mutate(reportParams);
  };

  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className=" flex space-y-4 gap-4 items-center justify-center">
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogTrigger asChild>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleTask}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-date" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-assignee" className="text-right">
                  Assignee
                </Label>
                <Select
                  value={newTask.assignee}
                  onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">Schedule Task</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogTrigger asChild>
          <Button>
            <ClipboardList className="mr-2 h-4 w-4" /> Task List
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Task List</DialogTitle>
          </DialogHeader>
          <div className="relative w-full mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div>Loading tasks...</div>
          ) : !Array.isArray(tasks) ? (
            <div>No tasks available</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{format(new Date(task.dueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.normal}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogTrigger asChild>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" /> Task Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Task Report</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGenerateReport}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-type" className="text-right">
                  Report Type
                </Label>
                <Select
                  value={reportParams.type}
                  onValueChange={(value) => setReportParams({...reportParams, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-start-date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="report-start-date"
                  type="date"
                  value={reportParams.startDate}
                  onChange={(e) => setReportParams({...reportParams, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report-end-date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="report-end-date"
                  type="date"
                  value={reportParams.endDate}
                  onChange={(e) => setReportParams({...reportParams, endDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">Generate Report</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;

