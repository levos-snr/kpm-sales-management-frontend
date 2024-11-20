import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useStore from '../store'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product'
import ProductForm from './productform2'

export default function ProductContent() {
  const [showDialog, setShowDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const currentUser = useStore((state) => state.user)
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    unit_price: '',
    stock_threshold: '',
    status: 'active',
  })

  // Query 4 products
  const { 
    data: productsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (data) => data.products || [],
    staleTime: 1000 * 60 * 5, 
  })

  // creating products
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      handleDialogClose()
    },
    onError: (err) => {
      setError(err.message || 'Failed to create product')
    }
  })

  //  updating 3theproducts
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      handleDialogClose()
    },
    onError: (err) => {
      setError(err.message || 'Failed to update product')
    }
  })

  //  deleting - products
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    },
    onError: (err) => {
      setError(err.message || 'Failed to delete product')
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    setCurrentProduct(null)
    setFormData({
      name: '',
      sku: '',
      description: '',
      category: '',
      unit_price: '',
      stock_threshold: '',
      status: 'active',
    })
  }

  const handleSubmit = (formData) => {
    if (currentProduct) {
      updateMutation.mutate({ id: currentProduct.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id)
    }
  }

  const canManageProducts = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  //  states management 3oad
  const isOperationLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const operationError = createMutation.error || updateMutation.error || deleteMutation.error

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Product Management</h2>
            </div>
            {canManageProducts && (
              <Button 
                onClick={() => setShowDialog(true)} 
                className="flex items-center gap-2"
                disabled={isOperationLoading}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            )}
          </div>

          {(error || operationError) && (
            <Alert variant="destructive" className="m-4">
              <AlertDescription>
                {error?.message || operationError?.message || 'An error occurred'}
              </AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageProducts && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : productsData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  productsData?.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <span className="capitalize">{product.category}</span>
                      </TableCell>
                      <TableCell>Ksh.{Number(product.unit_price).toFixed(2)}</TableCell>
                      <TableCell>{product.stock_threshold}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            Ksh.{product.status === 'active'
                              ? 'bg-green-100 text-green-800' 
                              : product.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      {canManageProducts && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentProduct(product)
                                setFormData(product)
                                setShowDialog(true)
                              }}
                              disabled={isOperationLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              disabled={isOperationLoading}
                              className="text-red-600 hover:text-red-700"
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
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            showDialog={showDialog}
            currentProduct={currentProduct}
            isLoading={isOperationLoading}
            onSubmit={handleSubmit}
            onClose={handleDialogClose}
          />        
        </DialogContent>
      </Dialog>
    </div>
  )
}