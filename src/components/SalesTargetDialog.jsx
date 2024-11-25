import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SalesTargetDialog = ({ open, onOpenChange, onSubmit }) => {
  const [targetData, setTargetData] = useState({
    amount: '',
    period: 'monthly',
    category: 'revenue',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(targetData);
    setTargetData({
      amount: '',
      period: 'monthly',
      category: 'revenue',
      startDate: '',
      endDate: '',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Sales Target</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="amount">Target Amount (KSH)</Label>
              <Input
                id="amount"
                type="number"
                value={targetData.amount}
                onChange={(e) => setTargetData({ ...targetData, amount: e.target.value })}
                required
                placeholder="Enter target amount"
              />
            </div>

            <div>
              <Label htmlFor="period">Target Period</Label>
              <Select
                value={targetData.period}
                onValueChange={(value) => setTargetData({ ...targetData, period: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Target Category</Label>
              <Select
                value={targetData.category}
                onValueChange={(value) => setTargetData({ ...targetData, category: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="units">Units Sold</SelectItem>
                  <SelectItem value="customers">New Customers</SelectItem>
                  <SelectItem value="visits">Customer Visits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={targetData.startDate}
                onChange={(e) => setTargetData({ ...targetData, startDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={targetData.endDate}
                onChange={(e) => setTargetData({ ...targetData, endDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={targetData.notes}
                onChange={(e) => setTargetData({ ...targetData, notes: e.target.value })}
                placeholder="Add any additional notes or comments"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Set Target</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesTargetDialog;