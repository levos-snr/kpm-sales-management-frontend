import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const QuickActionsCustomers = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    business_type: '',
    contact_person: '',
    phone_number: '',
    email: '',
    address: '',
    status: 'active'
  });

  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axios.get('/customers');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (customerData) => {
      const response = await axios.post('/customers', customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      setIsAddDialogOpen(false);
      setNewCustomer({
        name: '',
        business_type: '',
        contact_person: '',
        phone_number: '',
        email: '',
        address: '',
        status: 'active'
      });
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...customerData }) => {
      const response = await axios.put(`/customers/${id}`, customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/customers/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    }
  });

  const handleAddCustomer = () => {
    createMutation.mutate(newCustomer);
  };

  const handleUpdateCustomer = () => {
    updateMutation.mutate(selectedCustomer);
  };

  const handleDeleteCustomer = () => {
    deleteMutation.mutate(selectedCustomer.id);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsAddDialogOpen(true)}>
        <Users className="mr-2 h-4 w-4" /> Add Customer
      </Button>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="business_type" className="text-right">Business Type</Label>
              <Select 
                value={newCustomer.business_type}
                onValueChange={(value) => setNewCustomer({...newCustomer, business_type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="supermarket">Supermarket</SelectItem>
                  <SelectItem value="kiosk">Kiosk</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_person" className="text-right">Contact Person</Label>
              <Input
                id="contact_person"
                value={newCustomer.contact_person}
                onChange={(e) => setNewCustomer({...newCustomer, contact_person: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input
                id="phone"
                value={newCustomer.phone_number}
                onChange={(e) => setNewCustomer({...newCustomer, phone_number: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Similar fields as Add Customer Dialog but with selectedCustomer data */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name" className="text-right">Name</Label>
              <Input
                id="edit_name"
                value={selectedCustomer?.name}
                onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            {/* Add other fields similarly */}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateCustomer}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete {selectedCustomer?.name}?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recent Customers Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.slice(0, 5).map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.business_type}</TableCell>
                <TableCell>{customer.contact_person}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'success' : 'destructive'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuickActionsCustomers;