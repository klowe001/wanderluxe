
import React from 'react';
import { HotelStay } from '@/types/trip';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface HotelStaysListProps {
  hotelStays: HotelStay[];
  onEdit: (stayId: string) => void;
  onDelete: (stayId: string) => void;
  formatDateRange: (startDate: string, endDate: string) => string;
}

const HotelStaysList: React.FC<HotelStaysListProps> = ({
  hotelStays,
  onEdit,
  onDelete,
  formatDateRange
}) => {
  if (hotelStays.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No accommodations added yet.
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  return (
    <div className="space-y-3 p-4">
      {hotelStays.map((stay) => (
        <Card 
          key={stay.stay_id} 
          className="p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <h3 className="font-semibold text-lg text-gray-900">{stay.hotel}</h3>
              
              <div className="mt-2 text-sm text-gray-700">
                <p className="mb-1">
                  <span className="font-medium">Stay: </span>
                  {formatDateRange(stay.hotel_checkin_date, stay.hotel_checkout_date)}
                </p>
                {stay.hotel_address && (
                  <p className="mb-1 line-clamp-2">
                    <span className="font-medium">Address: </span>
                    {stay.hotel_address}
                  </p>
                )}
                {stay.hotel_phone && (
                  <p className="mb-1">
                    <span className="font-medium">Phone: </span>
                    {stay.hotel_phone}
                  </p>
                )}
                {stay.cost && (
                  <p className="mb-1">
                    <span className="font-medium">Cost: </span>
                    {stay.cost} {stay.currency || ''}
                  </p>
                )}
              </div>
              
              {stay.hotel_website && (
                <a 
                  href={stay.hotel_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 inline-block mt-2"
                >
                  Visit hotel website
                </a>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(stay.stay_id)}
                aria-label="Edit accommodation"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(stay.stay_id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                aria-label="Delete accommodation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex mt-3 space-x-2">
            <div className="flex-1 bg-green-50 text-green-700 text-xs rounded p-2">
              <span className="font-medium">Check-in:</span> {formatDate(stay.hotel_checkin_date)}
            </div>
            <div className="flex-1 bg-amber-50 text-amber-700 text-xs rounded p-2">
              <span className="font-medium">Check-out:</span> {formatDate(stay.hotel_checkout_date)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HotelStaysList;
