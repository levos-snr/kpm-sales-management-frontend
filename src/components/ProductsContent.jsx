import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Package, Download, Plus, MoreHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProductsContent() {
  const [priceRange, setPriceRange] = useState([0, 200]);
  
  const products = [
    {
      id: 'P909',
      name: 'bodycare',
      image: '/api/placeholder/32/32',
      totalBuyer: '2456',
      price: '$34.00',
      stock: '249',
      status: 'Active'
    },
    // Add more products as needed
  ];

  const categories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' },
    { id: '3', name: 'Category 3' },
    { id: '4', name: 'Category 4' },
  ];

  const brands = [
    { id: 'a', name: 'Brand A' },
    { id: 'b', name: 'Brand B' },
    { id: 'c', name: 'Brand C' },
    { id: 'd', name: 'Brand D' },
    { id: 'e', name: 'Brand E' },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <Card className="w-full lg:w-64 h-fit">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Filter By Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filter By</h3>
                <Button variant="ghost" size="icon">
                  <Package className="h-4 w-4" />
                </Button>
              </div>

              {/* Category Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category.id}`} />
                      <label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Brand</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox id={`brand-${brand.id}`} />
                      <label htmlFor={`brand-${brand.id}`} className="text-sm">
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="font-medium">Price</h4>
                <Slider
                  defaultValue={[0, 200]}
                  max={200}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span className="text-sm">Min: ${priceRange[0]}</span>
                  <span className="text-sm">Max: ${priceRange[1]}</span>
                </div>
              </div>

              <Button className="w-full">Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <Input placeholder="Search Product" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Bulk Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="archive">Archive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Product
                  </Button>
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-6 border-b mb-6">
                <Button variant="ghost" className="border-b-2 border-primary">All Product</Button>
                <Button variant="ghost">Live</Button>
                <Button variant="ghost">Archive</Button>
                <Button variant="ghost">Out of stock</Button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Total Buyer</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3 px-4">{product.id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-white" />
                            </div>
                            {product.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{product.totalBuyer}</td>
                        <td className="py-3 px-4">{product.price}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2  ">
                            <Switch defaultChecked={product.status === 'Active'} className="bg-blue-600"/>
                            <span>{product.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">Showing 1 to 10 of 10 entries</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 10].map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      className={page === 1 ? 'bg-blue-50' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}