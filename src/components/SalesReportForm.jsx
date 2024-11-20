import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import axios from 'axios'

const formSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerId: z.number().int().positive('Valid customer ID is required'),
  visitDate: z.string().min(1, 'Visit date is required'),
  productsSold: z.array(z.object({
    productId: z.number().int().positive('Valid product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
    totalPrice: z.number().min(0, 'Total price must be non-negative'),
  })).min(1, 'At least one product must be added'),
  totalAmount: z.number().min(0, 'Total amount must be non-negative'),
  paymentMethod: z.enum(['cash', 'mpesa', 'bank_transfer', 'credit']),
  notes: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(['completed', 'pending', 'cancelled']).default('completed'),
})

function SalesReportForm({ companyId, userId, customerId }) {
  const [location, setLocation] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId,
      productsSold: [{ productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      totalAmount: 0,
      status: 'completed',
      paymentMethod: 'cash',
    },
  })

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          setLocation(newLocation)
          setValue('latitude', newLocation.latitude)
          setValue('longitude', newLocation.longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location. Please ensure location services are enabled.',
            variant: 'destructive',
          })
        }
      )
    } else {
      toast({
        title: 'Geolocation Unavailable',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      })
    }
  }, [setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/sales-report', {
        company_id: companyId,
        customer_id: data.customerId,
        user_id: userId,
        visit_date: new Date(data.visitDate).toISOString(),
        total_amount: data.totalAmount,
        payment_method: data.paymentMethod,
        notes: data.notes,
        status: data.status,
        location: {
          lat: data.latitude,
          lng: data.longitude,
        },
        productsSold: data.productsSold
      })

      toast({
        title: 'Sales Report Submitted',
        description: `Your sales report has been successfully submitted. Sales Record ID: ${response.data.sales_record_id}, Order ID: ${response.data.order_id}`,
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting your sales report. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const productsSold = watch('productsSold')

  useEffect(() => {
    const totalAmount = productsSold.reduce((sum, product) => {
      const total = product.quantity * product.unitPrice
      product.totalPrice = total
      return sum + total
    }, 0)
    setValue('totalAmount', totalAmount)
  }, [productsSold, setValue])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sales Visit Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              {...register('customerName')}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Label htmlFor="visitDate">Visit Date</Label>
            <Input
              id="visitDate"
              type="datetime-local"
              {...register('visitDate')}
            />
            {errors.visitDate && (
              <p className="text-sm text-red-500 mt-1">{errors.visitDate.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Label>Products Sold</Label>
            {productsSold.map((_, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  {...register(`productsSold.${index}.productName`)}
                  placeholder="Product name"
                />
                <Input
                  type="number"
                  {...register(`productsSold.${index}.quantity`, { valueAsNumber: true })}
                  placeholder="Qty"
                />
                <Input
                  type="number"
                  step="0.01"
                  {...register(`productsSold.${index}.unitPrice`, { valueAsNumber: true })}
                  placeholder="Unit price"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setValue('productsSold', [...productsSold, { productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }])
              }}
            >
              Add Product
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              id="totalAmount"
              type="number"
              step="0.01"
              {...register('totalAmount', { valueAsNumber: true })}
              readOnly
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Enter any additional notes"
            />
          </motion.div>

          {location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center space-x-2 text-sm text-gray-500"
            >
              <FaMapMarkerAlt />
              <span>Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Sales Report'}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SalesReportForm