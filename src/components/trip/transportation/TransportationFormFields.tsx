import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from '@/integrations/supabase/types';
import { Plane, Train, Car, Bus, Ship } from 'lucide-react';

type TransportationEvent = Tables<'transportation_events'>;

interface TransportationFormFieldsProps {
  formData: Partial<TransportationEvent>;
  setFormData: (data: Partial<TransportationEvent>) => void;
}

const TRANSPORT_TYPES = [
  { value: 'flight', label: 'Flight', icon: Plane },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'car_service', label: 'Car Service', icon: Car },
  { value: 'rental_car', label: 'Rental Car', icon: Car },
  { value: 'shuttle', label: 'Shuttle', icon: Bus },
  { value: 'ferry', label: 'Ferry', icon: Ship },
] as const;

const TransportationFormFields: React.FC<TransportationFormFieldsProps> = ({
  formData,
  setFormData,
}) => {
  const getIcon = (type: string) => {
    const transportType = TRANSPORT_TYPES.find(t => t.value === type);
    if (!transportType) return <Car className="h-4 w-4" />;
    const Icon = transportType.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Transportation Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: TransportationEvent['type']) => 
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {TRANSPORT_TYPES.map((type) => (
              <SelectItem 
                key={type.value} 
                value={type.value}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  {getIcon(type.value)}
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={formData.provider || ''}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            placeholder="e.g., United Airlines"
          />
        </div>
        <div>
          <Label htmlFor="confirmation">Confirmation Number</Label>
          <Input
            id="confirmation"
            value={formData.confirmation_number || ''}
            onChange={(e) => setFormData({ ...formData, confirmation_number: e.target.value })}
            placeholder="e.g., ABC123"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="details">Details</Label>
        <Input
          id="details"
          value={formData.details || ''}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          placeholder="Additional details"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departure">From</Label>
          <Input
            id="departure"
            value={formData.departure_location || ''}
            onChange={(e) => setFormData({ ...formData, departure_location: e.target.value })}
            placeholder="Departure location"
          />
        </div>
        <div>
          <Label htmlFor="arrival">To</Label>
          <Input
            id="arrival"
            value={formData.arrival_location || ''}
            onChange={(e) => setFormData({ ...formData, arrival_location: e.target.value })}
            placeholder="Arrival location"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date || ''}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time || ''}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time || ''}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost || ''}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency || 'USD'}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TransportationFormFields;