import React, { useState, Suspense, startTransition } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import useStore from '../store';
import { getUserList, deleteUser } from '../api/auth';
import { SalesRepRegistration } from './saleregistration';

const LoadingState = () => (
  <TableRow>
    <TableCell colSpan={8} className="text-center py-4">
      Loading...
    </TableCell>
  </TableRow>
);

const ErrorState = ({ error }) => (
  <TableRow>
    <TableCell colSpan={8} className="text-center py-4 text-red-500">
      {error?.message || 'An error occurred while fetching data. Please try again.'}
    </TableCell>
  </TableRow>
);

export default function TeamContent() {
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const currentUser = useStore((state) => state.user);
  const queryClient = useQueryClient();
  const entriesPerPage = 5;

  const { data: employeesData, error } = useQuery({
    queryKey: ['employees'],
    queryFn: getUserList,
    suspense: true,
    useErrorBoundary: true,
    select: (data) => {
      const currentUser = useStore.getState().user;
      if (!data?.users) return [];
      if (currentUser.role === 'admin') return data.users;
      if (currentUser.role === 'manager') {
        return data.users.filter(
          (user) =>
            user.role === 'sales_rep' && user.created_by === currentUser.id
        );
      }
      return [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries(['employees']);
        setShowDeleteDialog(false);
        setEmployeeToDelete(null);
      });
    },
  });

  const employees = employeesData || [];
  const totalPages = Math.ceil(employees.length / entriesPerPage);
  const paginatedEmployees = employees.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  const handlePageChange = (newPage) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  };

  const handleExport = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Contact Number',
      'Designation',
      'Managed By',
      'Status',
    ];
    const csvContent = [
      headers.join(','),
      ...employees.map((emp) =>
        [
          emp.id,
          `${emp.first_name} ${emp.last_name}`,
          emp.email,
          emp.phone_number,
          emp.designation || 'N/A',
          emp.manager
            ? `${emp.manager.first_name} ${emp.manager.last_name}`
            : 'N/A',
          emp.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Employees</h2>
            <div className="flex gap-2">
              {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                <>
                  <Button
                    onClick={handleExport}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px]">Employee ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Managed By</TableHead>
                  <TableHead>Status</TableHead>
                  {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <Suspense fallback={<LoadingState />}>
                <TableBody>
                  {error ? (
                    <ErrorState error={error} />
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={employee.avatar || '/placeholder.svg'}
                                alt={`${employee.first_name} ${employee.last_name}`}
                              />
                              <AvatarFallback>
                                {`${employee.first_name?.[0]}${employee.last_name?.[0]}`}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${employee.first_name} ${employee.last_name}`}</div>
                              <div className="text-sm text-gray-500">
                                {employee.role}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone_number}</TableCell>
                        <TableCell>{employee.designation || 'N/A'}</TableCell>
                        <TableCell>
                          {employee.manager
                            ? `${employee.manager.first_name} ${employee.manager.last_name}`
                            : employee.role === 'admin'
                            ? 'None'
                            : 'Not Assigned'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                        {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(employee)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Suspense>
            </Table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * entriesPerPage) + 1} to{' '}
              {Math.min(page * entriesPerPage, employees.length)} of{' '}
              {employees.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <SalesRepRegistration onSuccess={() => setShowAddDialog(false)} />
          </Suspense>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium">{employeeToDelete?.first_name} {employeeToDelete?.last_name}</span>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setEmployeeToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(employeeToDelete?.id)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}