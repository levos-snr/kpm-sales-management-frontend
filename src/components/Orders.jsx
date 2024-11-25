import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Calendar, ChevronDown, MapPin, Package, Search, ShoppingCart, User, Sun, Moon } from 'lucide-react'
import useStore from '../store'

const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const store = useStore.getState()
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = store.refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        const response = await axios.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        })

        const { access_token } = response.data
        store.setAccessToken(access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`

        return axios(originalRequest)
      } catch (error) {
        store.clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

const fetchCustomers = async () => {
  const response = await axios.get('/customers')
  return response.data
}

const fetchProducts = async () => {
  const response = await axios.get('/products')
  return response.data
}

const fetchOrders = async () => {
  const response = await axios.get('/orders')
  return response.data
}

const placeOrder = async (orderData) => {
  const response = await axios.post('/orders', orderData)
  return response.data
}

const updateOrder = async ({ id, ...orderData }) => {
  const response = await axios.put(`/orders/${id}`, orderData)
  return response.data
}

const deleteOrder = async (id) => {
  const response = await axios.delete(`/orders/${id}`)
  return response.data
}

export default function OrderDashboard() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [customerFilter, setCustomerFilter] = useState('')
  const [orderFilter, setOrderFilter] = useState('')
  const [editingOrder, setEditingOrder] = useState(null)
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null)
  const [visibleProducts, setVisibleProducts] = useState(6)

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  })
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: (data) => Array.isArray(data) ? data : (data?.products || [])
  })
  
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  })
  
  const placeMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setSelectedCustomer(null)
      setOrderItems([])
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error placing order",
        description: error.message || "An error occurred while placing the order.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setEditingOrder(null)
      toast({
        title: "Order updated successfully",
        description: "The order has been updated with the new information.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: error.message || "An error occurred while updating the order.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast({
        title: "Order deleted successfully",
        description: "The order has been removed from the system.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error deleting order",
        description: error.message || "An error occurred while deleting the order.",
        variant: "destructive",
      })
    },
  })

  const addToOrder = (product) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromOrder = (productId) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0).toFixed(2)
  }

  const handlePlaceOrder = () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer before placing an order.",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to your order before placing it.",
        variant: "destructive",
      })
      return
    }

    const orderData = {
      customer_id: selectedCustomer,
      order_date: new Date().toISOString(),
      total_amount: parseFloat(calculateTotal()),
      payment_method: 'cash',
      status: 'pending',
      order_items: orderItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity
      }))
    }
    placeMutation.mutate(orderData)
  }

  const handleUpdateOrder = () => {
    if (!editingOrder) return
    updateMutation.mutate(editingOrder)
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteMutation.mutate(orderId)
    }
  }
  
  // Add these filter functions
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.business_type.toLowerCase().includes(customerSearch.toLowerCase())
  )
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  // const filteredCustomers = customers.filter(customer => 
  //   customer.name.toLowerCase().includes(customerFilter.toLowerCase())
  // )

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(orderFilter) ||
    customers.find(c => c.id === order.customer_id)?.name.toLowerCase().includes(orderFilter.toLowerCase())
  )

  if (isLoadingCustomers || isLoadingProducts || isLoadingOrders) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Rep Order Dashboard</h1>
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      
      <Tabs defaultValue="new-order" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="order-history">Order History</TabsTrigger>
          <TabsTrigger value="customer-info">Customer Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Order</CardTitle>
              <CardDescription>Select a customer and add products to the order.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Search Customer</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {selectedCustomerDetails && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedCustomerDetails(null)
                          setSelectedCustomer(null)
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  {customerSearch && !selectedCustomerDetails && (
                    <Card className="mt-2">
                      <CardContent className="p-2">
                        {filteredCustomers.length > 0 ? (
                          <ul className="space-y-2">
                            {filteredCustomers.map((customer) => (
                              <li 
                                key={customer.id}
                                className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                onClick={() => {
                                  setSelectedCustomer(customer.id.toString())
                                  setSelectedCustomerDetails(customer)
                                  setCustomerSearch('')
                                }}
                              >
                                {customer.name} ({customer.business_type})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No customers found</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedCustomerDetails && (
                    <div className="mt-2 p-2 border rounded-md">
                      <p className="font-medium">{selectedCustomerDetails.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCustomerDetails.business_type}</p>
                    </div>
                  )}
                </div>
                
                {selectedCustomer && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Add Products</h3>
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.slice(0, visibleProducts).map((product) => (
                        <Card key={product.id}>
                          <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>Ksh. {product.unit_price} - Stock: {product.stock_threshold}</CardDescription>
                          </CardHeader>
                          <CardFooter>
                            <Button onClick={() => addToOrder(product)}>Add to Order</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                    {filteredProducts.length > visibleProducts && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline"
                          onClick={() => setVisibleProducts(prev => prev + 6)}
                        >
                          Load More Products
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {orderItems.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>Ksh. {item.unit_price}</TableCell>
                            <TableCell>Ksh. {(item.unit_price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="destructive" size="sm" onClick={() => removeFromOrder(item.id)}>Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold">Total: Ksh. {calculateTotal()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!selectedCustomer || orderItems.length === 0 || placeMutation.isLoading} 
                onClick={handlePlaceOrder}
              >
                {placeMutation.isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="order-history">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and manage past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Filter orders..."
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{customers.contact_person?.name || 'Unknown'}</TableCell>
                      <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                      <TableCell>Ksh. {order.total_amount}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Order</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  Status
                                </Label>
                                <Select
                                  value={editingOrder?.status}
                                  onValueChange={(value) => setEditingOrder({...editingOrder, status: value})}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button onClick={handleUpdateOrder}>Update Order</Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer-info">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>View and manage customer details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search customers..."
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  />
                  <Button size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.business_type}</TableCell>
                        <TableCell>{customer.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Order Amount</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh. {orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total from all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Available products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Processed orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}