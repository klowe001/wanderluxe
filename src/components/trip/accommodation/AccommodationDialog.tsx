import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccommodationFormData } from '@/services/accommodation/types';
import AccommodationForm from './AccommodationForm';

interface AccommodationDialogProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AccommodationFormData & { stay_id?: string };
  onSave: (data: AccommodationFormData) => Promise<void>; // Updated to accept AccommodationFormData
  tripArrivalDate?: string | null;
  tripDepartureDate?: string | null;
}

const AccommodationDialog: React.FC<AccommodationDialogProps> = ({
  tripId,
  open,
  onOpenChange,
  initialData,
  onSave,
  tripArrivalDate,
  tripDepartureDate
}) => {
  const handleSubmit = async (formData: AccommodationFormData) => {
    try {
      if (!formData) {
        throw new Error('Form data is required');
      }
      if (typeof onSave !== 'function') {
        throw new Error('onSave prop must be a function');
      }
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving accommodation:', error);
      throw error; // Re-throw to be handled by the form
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Prevent closing when clicking on outside elements (like the autocomplete dropdown) */}
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.stay_id ? 'Edit Accommodation' : 'Add Accommodation'}
          </DialogTitle>
        </DialogHeader>
        <AccommodationForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
          tripArrivalDate={tripArrivalDate}
          tripDepartureDate={tripDepartureDate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccommodationDialog;