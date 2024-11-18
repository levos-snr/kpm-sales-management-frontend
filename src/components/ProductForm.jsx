import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ProductForm({ 
  showDialog, 
  currentProduct, 
  isLoading, 
  onSubmit, 
  onClose 
}) {
  const [formData, setFormData] = useState({
    name: currentProduct?.name || '',
    sku: currentProduct?.sku || '',
    description: currentProduct?.description || '',
    category: currentProduct?.category || '',
    unit_price: currentProduct?.unit_price || '',
    stock_threshold: currentProduct?.stock_threshold || '',
    status: currentProduct?.status || 'active'
  })

  const [errors, setErrors] = useState([])

  const validateForm = () => {
    const newErrors = []

    // Name validation (required, max 100 chars)
    if (!formData.name.trim()) {
      newErrors.push('Name is required')
    } else if (formData.name.length > 100) {
      newErrors.push('Name must be less than 100 characters')
    }

    // SKU validation (required, max 50 chars)
    if (!formData.sku.trim()) {
      newErrors.push('SKU is required')
    } else if (formData.sku.length > 50) {
      newErrors.push('SKU must be less than 50 characters')
    }

    // Unit price validation (required, positive, max 2 decimals)
    const price = parseFloat(formData.unit_price)
    if (!formData.unit_price) {
      newErrors.push('Unit price is required')
    } else if (price <= 0) {
      newErrors.push('Unit price must be greater than 0')
    } else if (formData.unit_price.toString().split('.')[1]?.length > 2) {
      newErrors.push('Unit price cannot have more than 2 decimal places')
    }

    // Stock threshold validation (optional, positive integer)
    if (formData.stock_threshold && parseInt(formData.stock_threshold) < 0) {
      newErrors.push('Stock threshold cannot be negative')
    }

    // Description validation (optional, max 1000 chars)
    if (formData.description && formData.description.length > 1000) {
      newErrors.push('Description must be less than 1000 characters')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Pass the formData directly instead of the event
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      category: '',
      unit_price: '',
      stock_threshold: '',
      status: 'active'
    })
    setErrors([])
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="required">
            Product Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            maxLength={100}
            required
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku" className="required">
            SKU *
          </Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            maxLength={50}
            required
            placeholder="Enter SKU"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          maxLength={1000}
          placeholder="Enter product description"
          className="h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">
            Category
          </Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beverages">Beverages</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="household">Household</SelectItem>
              <SelectItem value="personal_care">Personal Care</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit_price" className="required">
            Unit Price *
          </Label>
          <Input
            id="unit_price"
            name="unit_price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.unit_price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock_threshold">
            Stock Threshold
          </Label>
          <Input
            id="stock_threshold"
            name="stock_threshold"
            type="number"
            min="0"
            step="1"
            value={formData.stock_threshold}
            onChange={handleInputChange}
            placeholder="Enter threshold value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">
            Status
          </Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <div className="flex gap-2 justify-end w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                {currentProduct ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              currentProduct ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}