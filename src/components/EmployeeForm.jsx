import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { fetchCompanies } from '../api/companies';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoidHJpcHBsZWJveSIsImEiOiJjbTJkanVpbTAwbGZyMmpzN2x3NWY3cGtrIn0.ZTKXe_eKQ8yz-D65RoTZaQ';

const LocationSelector = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (query) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,address`
      );
      const data = await response.json();

      const formattedLocations = data.features.map((feature) => ({
        id: feature.id,
        name: feature.place_name,
        longitude: feature.center[0],
        latitude: feature.center[1],
      }));

      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => searchLocations(searchQuery)} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {locations.length > 0 && (
        <Select
          onValueChange={(locationId) => {
            const selected = locations.find((loc) => loc.id === locationId);
            onLocationSelect(selected);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

const EmployeeForm = ({ employee, onSubmit, currentUser, roleOptions }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState(() => {
    const initialData = employee || {
      first_name: '',
      last_name: '',
      email: '',
      role: 'sales_rep',
      password: '',
      status: 'active',
      latitude: null,
      longitude: null,
      location_name: '',
      company_id: currentUser.company_id || '',
    };

    if (currentUser.role === 'manager') {
      initialData.manager_id = currentUser.id;
    }

    return initialData;
  });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };

    if (currentUser.role === 'admin') {
      loadCompanies();
    }
  }, [currentUser.role]);

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.latitude,
      longitude: location.longitude,
      location_name: location.name,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      company_id: parseInt(
        currentUser.role === 'admin'
          ? formData.company_id
          : currentUser.company_id,
        10
      ),
    };

    if (currentUser.role === 'manager' || formData.role === 'sales_rep') {
      submitData.manager_id = currentUser.id;
    }

    if (employee) {
      onSubmit(employee.id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
      manager_id:
        value === 'sales_rep' && currentUser.role === 'manager'
          ? parseInt(currentUser.id, 10)
          : null,
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentUser.role === 'admin' && (
          <div>
            <Label htmlFor="company">Company</Label>
            <Select
              value={formData.company_id.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, company_id: parseInt(value, 10) })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {!employee && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={handleRoleChange}
          disabled={currentUser.role === 'manager'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Location</Label>
        <LocationSelector onLocationSelect={handleLocationSelect} />
        {formData.location_name && (
          <div className="mt-2 text-sm text-gray-500">
            Selected: {formData.location_name}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {employee ? 'Update Employee' : 'Add Employee'}
      </Button>
    </form>
  );
};

export default EmployeeForm;
