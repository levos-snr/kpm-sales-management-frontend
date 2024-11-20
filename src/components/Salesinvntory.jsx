import React, { useState, useEffect,useMemo  } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit2, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getProducts } from '../api/product'



const fetchRecentSales = async () => {
  // Simulation
  return [
    { id: 1, product_id: 1, quantity: 5, total_amount: 54.95, date: '2024-11-17' },
    { id: 2, product_id: 2, quantity: 10, total_amount: 59.90, date: '2024-11-16' },
    { id: 3, product_id: 3, quantity: 2, total_amount: 31.98, date: '2024-11-15' },
  ]
}



const updateStock = async ({ productId, newStock }) => {

  console.log(`Updating stock for product ${productId} to ${newStock}`)
  return { success: true }
}

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isUpdateStockDialogOpen, setIsUpdateStockDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newStockAmount, setNewStockAmount] = useState('')

  const queryClient = useQueryClient()

  //  products queri
  const { data: productsData , isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (data) => data.products || [],
    staleTime: 1000 * 60 * 5,
  })
  



  const { data: recentSales, isLoading: isLoadingSales } = useQuery({
    queryKey: ['recentSales'],
    queryFn: fetchRecentSales
  })

  const updateStockMutation = useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsUpdateStockDialogOpen(false)
      setSelectedProduct(null)
      setNewStockAmount('')
    }
  })

  const filteredProducts = productsData?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdateStock = (product) => {
    setSelectedProduct(product)
    setNewStockAmount(product.current_stock.toString())
    setIsUpdateStockDialogOpen(true)
  }

  const submitStockUpdate = () => {
    updateStockMutation.mutate({
      productId: selectedProduct.id,
      newStock: parseInt(newStockAmount, 10)
    })
  }

  const getStockStatus = (currentStock, threshold) => {
    if (currentStock <= threshold * 0.5) return 'critical'
    if (currentStock <= threshold) return 'low'
    return 'normal'
  }

  const stockStatusColors = {
    critical: 'bg-red-100 text-red-800',
    low: 'bg-yellow-100 text-yellow-800',
    normal: 'bg-green-100 text-green-800'
  }

  if (isLoadingProducts || isLoadingSales) return <div>Loading dashboard...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Ksh.{product.unit_price}</TableCell>
                  <TableCell>{product.stock_threshold}</TableCell>
                  <TableCell>
                    <Badge className={stockStatusColors[getStockStatus(product.current_stock, product.stock_threshold)]}>
                      {getStockStatus(product.current_stock, product.stock_threshold)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStock(product)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{productsData.find(p => p.id === sale.product_id)?.product_id}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>Ksh.{sale.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Level Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current_stock" fill="#8884d8" name="Current Stock" />
              <Bar dataKey="stock_threshold" fill="#82ca9d" name="Stock Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Dialog open={isUpdateStockDialogOpen} onOpenChange={setIsUpdateStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock for {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-stock" className="text-right">
                Current Stock
              </Label>
              <Input
                id="current-stock"
                value={selectedProduct?.current_stock || ''}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock" className="text-right">
                New Stock Amount
              </Label>
              <Input
                id="new-stock"
                value={newStockAmount}
                onChange={(e) => setNewStockAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={submitStockUpdate}>
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}