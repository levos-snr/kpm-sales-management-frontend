import React, { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import useStore from '../store';
import axios from 'axios';
import Result from 'postcss/lib/result';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { user } = useStore(); 
  

  

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    serialNumber: '',
    stock_threshold: '',
    costPrice: '',
    unit_price: '',
    unit: '1000',
    specifications: '',
  });

  // Check if user has permission to modify products based on role
  const hasModifyAccess = user?.role === 'admin' || user?.role === 'manager';

  // Fetch products with axios and error handling
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products', {
        headers: {
          'Authorization': `Bearer ${useStore.getState().accessToken}`
        }
      });
      setProducts(response.data.products || []); 
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasModifyAccess) {
      setError('You do not have permission to perform this action');
      return;
    }

    try {
      const method = currentProduct ? 'PATCH' : 'POST';
      const url = currentProduct 
        ? `/products/${currentProduct.id}`
        : '/products';

      const response = await axios({
        method,
        url,
        headers: {
          'Authorization': `Bearer ${useStore.getState().accessToken}`,
          'Content-Type': 'application/json',
        },
        data: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        await fetchProducts();
        setIsFormOpen(false);
        setCurrentProduct(null);
        setFormData({
          productName: '',
          description: '',
          category: '',
          serialNumber: '',
          stock_threshold: '',
          costPrice: '',
          unit_price: '',
          unit: '1000',
          specifications: '',
        });
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!hasModifyAccess) {
      setError('You do not have permission to delete products');
      return;
    }

    try {
      await axios.delete(`/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${useStore.getState().accessToken}`
        }
      });
      await fetchProducts();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>Please log in to access this page</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        {hasModifyAccess && (
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Product Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  {hasModifyAccess && <th className="text-left py-3 px-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4">{product.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4" />
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">${product.unit_price}</td>
                    <td className="py-3 px-4">{product.stock_threshold}</td>
                    <td className="py-3 px-4">
                      <Switch disabled={!hasModifyAccess} />
                    </td>
                    {hasModifyAccess && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentProduct(product);
                              setFormData(product);
                              setIsFormOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input
                  name="productName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <Input
                  type="number"
                  name="stock_threshold"
                  value={formData.stock_threshold}
                  onChange={(e) => setFormData({ ...formData, stock_threshold: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentProduct ? 'Update' : 'Create'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}