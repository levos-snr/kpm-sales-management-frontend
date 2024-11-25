import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { registerSalesRep } from '../api/auth'
import useStore from '../store'

const SalesRepRegistrationForm = ({ onShowTargetsDialog }) => {
  const currentUser = useStore((state) => state.user)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    admin_email: currentUser.email,
    phone_number: '',
    designation: '',
    id_number: '',
    device_token: '',
    location: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.first_name && formData.last_name && formData.email && formData.phone_number) {
      onShowTargetsDialog({
        ...formData,
        admin_email: currentUser.email || formData.admin_email
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation">Designation</Label>
        <Input
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="id_number">ID Number</Label>
        <Input
          id="id_number"
          name="id_number"
          value={formData.id_number}
          onChange={handleInputChange}
        />
      </div>


      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          name="location"
          value={formData.location}
          onValueChange={(value) => handleInputChange({ target: { name: 'location', value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="South-East">South-East</SelectItem>
            <SelectItem value="North-East">North-East</SelectItem>
            <SelectItem value="Nairobi">Nairobi</SelectItem>
            <SelectItem value="Central">Central</SelectItem>
            <SelectItem value="Coast">Coast</SelectItem>
            <SelectItem value="Nyanza">Nyanza</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <input 
        type="email"
        name="admin_email" 
        value={formData.admin_email} 
      />

      <Button type="submit" className="w-full">
        Continue to Targets & Territory
      </Button>
    </form>
  )
}

const TargetsAndTerritoryDialog = ({ isOpen, onClose, basicInfo, onSuccess }) => {
  const currentUser = useStore((state) => state.user)
  const [targetData, setTargetData] = useState({
    monthly_target: '',
    quarterly_target: '',
    yearly_target: '',
    territory_ids: [],
    territory_start_date: '',
    territory_end_date: ''
  })

  const queryClient = useQueryClient()

  const registerMutation = useMutation({
    mutationFn: (data) => registerSalesRep({
      ...data,
      created_by: currentUser.id,
      manager_id: currentUser.role === 'manager' ? currentUser.id : null
    }),
    onSuccess: () => {
          queryClient.invalidateQueries(['employees'])
          onSuccess?.()
          onClose()
        }
      })

      const handleInputChange = (e) => {
        const { name, value } = e.target
        setTargetData(prev => ({ ...prev, [name]: value }))
      }

      const handleSubmit = (e) => {
        e.preventDefault()
        const completeData = {
          ...basicInfo,
          ...targetData
        }
        registerMutation.mutate(completeData)
      }

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Set Targets & Territory</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_target">Monthly Target</Label>
                <Input
                  id="monthly_target"
                  name="monthly_target"
                  type="number"
                  value={targetData.monthly_target}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quarterly_target">Quarterly Target</Label>
                <Input
                  id="quarterly_target"
                  name="quarterly_target"
                  type="number"
                  value={targetData.quarterly_target}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearly_target">Yearly Target</Label>
                <Input
                  id="yearly_target"
                  name="yearly_target"
                  type="number"
                  value={targetData.yearly_target}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory_start_date">Start Date</Label>
                <Input
                  id="territory_start_date"
                  name="territory_start_date"
                  type="date"
                  value={targetData.territory_start_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory_end_date">End Date</Label>
                <Input
                  id="territory_end_date"
                  name="territory_end_date"
                  type="date"
                  value={targetData.territory_end_date}
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Register Sales Representative
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )
    }

    export const SalesRepRegistration = ({ onSuccess }) => {
      const [showTargetsDialog, setShowTargetsDialog] = useState(false)
      const [basicInfo, setBasicInfo] = useState(null)

      const handleShowTargetsDialog = (formData) => {
        setBasicInfo(formData)
        setShowTargetsDialog(true)
      }

      const handleCloseDialog = () => {
        setShowTargetsDialog(false)
        setBasicInfo(null)
      }

      return (
        <div className="p-4">
          <SalesRepRegistrationForm onShowTargetsDialog={handleShowTargetsDialog} />
          <TargetsAndTerritoryDialog
            isOpen={showTargetsDialog}
            onClose={handleCloseDialog}
            basicInfo={basicInfo}
            onSuccess={onSuccess}
          />
        </div>
      )
    }

    export default SalesRepRegistration
