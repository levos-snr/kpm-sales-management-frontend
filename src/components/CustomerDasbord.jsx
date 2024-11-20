import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, DollarSign, MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

const fetchCustomers = async () => {
  const response = await axios.get('/customers')
  return response.data
}

const createCustomer = async (customerData) => {
  const response = await axios.post('/customers', customerData)
  return response.data
}

const updateCustomer = async ({ id, ...customerData }) => {
  const response = await axios.put(`/customers/${id}`, customerData)
  return response.data
}

const deleteCustomer = async (id) => {
  await axios.delete(`/customers/${id}`)
  return id
}

export default function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    business_type: '',
    contact_person: '',
    phone_number: '',
    email: '',
    address: '',
    status: 'active'
  })

  const queryClient = useQueryClient()

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  })

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries('customers')
      setIsAddDialogOpen(false)
      toast({
        title: "Customer added",
        description: "New customer has been successfully added.",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries('customers')
      setIsEditDialogOpen(false)
      toast({
        title: "Customer updated",
        description: "Customer information has been successfully updated.",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries('customers')
      setIsDeleteDialogOpen(false)
      toast({
        title: "Customer deleted",
        description: "Customer has been successfully removed.",
      })
    },
  })

  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.business_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleAddCustomer = () => {
    createMutation.mutate(newCustomer)
  }

  const handleUpdateCustomer = () => {
    updateMutation.mutate(selectedCustomer)
  }

  const handleDeleteCustomer = () => {
    deleteMutation.mutate(selectedCustomer.id)
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading customer data...</div>
  if (error) return <div className="flex justify-center items-center h-screen">Error loading customer data: {error.message}</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers?.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh. {customers?.reduce((sum, c) => sum + (c.total_sales || 0), 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add New Customer</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredCustomers?.map((customer) => (
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
                      <Button variant="outline" size="sm" onClick={() => handleCustomerSelect(customer)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedCustomer(customer)
                        setIsEditDialogOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedCustomer(customer)
                        setIsDeleteDialogOpen(true)
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="business_type" className="text-right">
                    Business Type
                  </Label>
                  <Input id="business_type" value={selectedCustomer?.business_type} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact_person" className="text-right">
                    Contact Person
                  </Label>
                  <Input id="contact_person" value={selectedCustomer?.contact_person} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone_number" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone_number" value={selectedCustomer?.phone_number} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" value={selectedCustomer?.email} className="col-span-3" readOnly />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer?.recent_orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>Ksh. {order.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' ? 'success' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="location">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-2">Customer Location</h3>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Latitude: {selectedCustomer?.location?.lat}, Longitude: {selectedCustomer?.location?.lng}
                </p>
                <p className="text-sm text-muted-foreground">{selectedCustomer?.address}</p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="business_type" className="text-right">
                Business Type
              </Label>
              <Select onValueChange={(value) => setNewCustomer({...newCustomer, business_type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail_shop">Retail Shop</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="supermarket">Supermarket</SelectItem>
                  <SelectItem value="kiosk">Kiosk</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_person" className="text-right">
                Contact Person
              </Label>
              <Input id="contact_person" value={newCustomer.contact_person} onChange={(e) => setNewCustomer({...newCustomer, contact_person: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone
              </Label>
              <Input id="phone_number" value={newCustomer.phone_number} onChange={(e) =>
                setNewCustomer({...newCustomer, phone_number: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value={newCustomer.email} onChange={(e) =>
                setNewCustomer({...newCustomer, email: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input id="address" value={newCustomer.address} onChange={(e) =>
                setNewCustomer({...newCustomer, address: e.target.value})} className="col-span-3" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name" className="text-right">
                Name
              </Label>
              <Input id="edit_name" value={selectedCustomer?.name} onChange={(e) =>
                setSelectedCustomer({...selectedCustomer, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_business_type" className="text-right">
                Business Type
              </Label>
              <Select value={selectedCustomer?.business_type} onValueChange={(value) =>
                setSelectedCustomer({...selectedCustomer, business_type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail_shop">Retail Shop</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="supermarket">Supermarket</SelectItem>
                  <SelectItem value="kiosk">Kiosk</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_contact_person" className="text-right">
                Contact Person
              </Label>
              <Input id="edit_contact_person" value={selectedCustomer?.contact_person} onChange={(e) =>
                setSelectedCustomer({...selectedCustomer, contact_person: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_phone_number" className="text-right">
                Phone
              </Label>
              <Input id="edit_phone_number" value={selectedCustomer?.phone_number} onChange={(e) =>
                setSelectedCustomer({...selectedCustomer, phone_number: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email" className="text-right">
                Email
              </Label>
              <Input id="edit_email" value={selectedCustomer?.email} onChange={(e) =>
                setSelectedCustomer({...selectedCustomer, email: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_address" className="text-right">
                Address
              </Label>
              <Input id="edit_address" value={selectedCustomer?.address} onChange={(e) =>
                setSelectedCustomer({...selectedCustomer, address: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_status" className="text-right">
                Status
              </Label>
              <Select value={selectedCustomer?.status} onValueChange={(value) =>
                setSelectedCustomer({...selectedCustomer, status: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <p>Are you sure you want to delete the customer: {selectedCustomer?.name}?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}