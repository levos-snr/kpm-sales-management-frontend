import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, UserPlus, Shield, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useStore from '../store';
import { getUsers, createUser, updateUser, deleteUser, canManageUser } from '../api/userService';

export const TeamContent = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const currentUser = useStore((state) => state.user);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let response;
      
      if (currentUser.role === 'admin') {
        response = await getUsers(roleFilter !== 'all' ? { role: roleFilter } : {});
      } else if (currentUser.role === 'manager') {
        response = await getUsers({ manager_id: currentUser.id });
      } else {
        response = await getUsers({ id: currentUser.id });
      }
      
      setEmployees(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentUser, roleFilter]);

  const handleAddEmployee = async (formData) => {
    try {
      setError(null);
      const response = await createUser({
        ...formData,
        manager_id: currentUser.role === 'manager' ? currentUser.id : formData.manager_id,
        status: 'active'
      });
      
      const newEmployee = response.user || response;
      setEmployees([...employees, newEmployee]);
      setShowAddDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleEditEmployee = async (id, formData) => {
    try {
      setError(null);
      const response = await updateUser(id, {
        ...formData,
        manager_id: currentUser.role === 'manager' ? currentUser.id : formData.manager_id
      });
      
      const updatedEmployee = response.user || response;
      setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
      setSelectedEmployee(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setError(null);
      await deleteUser(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const getRoleOptions = () => {
    if (currentUser.role === 'admin') {
      return [
        { value: 'manager', label: 'Manager' },
        { value: 'sales_rep', label: 'Sales Representative' }
      ];
    }
    return [
      { value: 'sales_rep', label: 'Sales Representative' }
    ];
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b">
            <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Team Management</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              {currentUser.role === 'admin' && (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="manager">Managers</SelectItem>
                    <SelectItem value="sales_rep">Sales Representatives</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                <>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Employee
                  </Button>
                </>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="m-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Employee ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No employees found</TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>
                              {`${employee.first_name?.[0]}${employee.last_name?.[0]}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{`${employee.first_name} ${employee.last_name}`}</div>
                            <div className="text-sm text-gray-500">{employee.designation}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {employee.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {employee.status}
                        </span>
                      </TableCell>
                      {canManageUser(currentUser, employee) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {employees.length} entries
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={showAddDialog || selectedEmployee !== null} 
        onOpenChange={() => {
          setShowAddDialog(false);
          setSelectedEmployee(null);
          setError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee}
            currentUser={currentUser}
            roleOptions={getRoleOptions()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmployeeForm = ({ employee, onSubmit, currentUser, roleOptions }) => {
  const [formData, setFormData] = useState(employee || {
    first_name: '',
    last_name: '',
    email: '',
    role: currentUser.role === 'manager' ? 'sales_rep' : '',
    password: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employee) {
      onSubmit(employee.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      {!employee && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({...formData, role: value})}
          disabled={currentUser.role === 'manager'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        {employee ? 'Update Employee' : 'Add Employee'}
      </Button>
    </form>
  );
};

export default TeamContent;