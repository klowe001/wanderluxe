
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import DayHeader from './DayHeader';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible';
import { DayActivity, HotelStay } from '@/types/trip';
import DayImage from './DayImage';
import DayCardContent from './DayCardContent';
import DayEditDialog from './DayEditDialog';
import { toast } from 'sonner';
import RestaurantReservationDialog from '../dining/RestaurantReservationDialog';

interface DayCardProps {
  id: string;
  tripId: string;
  date: string;
  title?: string;
  activities?: DayActivity[];
  imageUrl?: string | null;
  index: number;
  onDelete: (id: string) => void;
  defaultImageUrl?: string;
  hotelStays?: HotelStay[];
  transportations?: any[];
  originalImageUrl?: string | null; // Added originalImageUrl prop
}

const DayCard: React.FC<DayCardProps> = ({
  id,
  tripId,
  date,
  title,
  activities = [],
  imageUrl,
  index,
  onDelete,
  defaultImageUrl,
  hotelStays = [],
  transportations = [],
  originalImageUrl, // Added originalImageUrl prop
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  // Initialize with originalImageUrl if available, then fallback to imageUrl, then null
  const [imageUrlState, setImageUrl] = useState(originalImageUrl || imageUrl || null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Update imageUrlState when originalImageUrl changes (from parent component)
  useEffect(() => {
    if (originalImageUrl) {
      setImageUrl(originalImageUrl);
      console.log("Updated imageUrlState from originalImageUrl:", originalImageUrl);
    }
  }, [originalImageUrl]);

  const { data: reservations } = useQuery({
    queryKey: ['reservations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_reservations')
        .select('*')
        .eq('day_id', id)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleReservationSubmit = async (data) => {
    try {
      // Make sure trip_id is included in the data
      const reservationData = {
        ...data,
        day_id: id,
        trip_id: tripId,
        order_index: reservations?.length || 0
      };

      const { error } = await supabase
        .from('restaurant_reservations')
        .insert([reservationData]);

      if (error) {
        console.error('Error saving reservation:', error);
        toast.error('Failed to add reservation');
        throw error;
      }

      toast.success('Reservation added successfully');
      queryClient.invalidateQueries(['reservations', id]);
      setIsReservationDialogOpen(false);
    } catch (error) {
      console.error('Error in handleReservationSubmit:', error);
    }
  };

  const dayTitle = title || format(parseISO(date), 'EEEE');

  const handleEdit = () => {
    console.log("Edit DayCard", id);
    setIsEditing(true);
  };

  const handleSaveEdit = async (data) => {
    try {
      // Update local state immediately for better UX
      if (data.title) {
        setEditTitle(data.title);
      }

      // Update image URL locally
      if (data.image_url) {
        setImageUrl(data.image_url); // Update imageUrl state
      }

      // Save changes to the database
      console.log("Saving to database:", { id, title: data.title, image_url: data.image_url });
      
      const { error, data: updatedData } = await supabase
        .from('trip_days')
        .update({
          title: data.title,
          image_url: data.image_url
        })
        .eq('day_id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error saving day edit:', error);
        toast.error('Failed to save changes');
        throw error;
      } else {
        toast.success('Day updated successfully');
        console.log("Database updated successfully:", updatedData);
        
        // Update local state with the data from the database
        if (updatedData.image_url) {
          setImageUrl(updatedData.image_url);
        }
        
        // Invalidate the trip data query to refresh the data
        queryClient.invalidateQueries(['trip']);
      }

      // Close the dialog
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving day edit:', error);
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    return `${hours}:${minutes}`;
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg mb-6">
      <DayEditDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        dayId={id}
        currentTitle={title}
        onTitleChange={setEditTitle}
        onSave={handleSaveEdit}
      />

      <RestaurantReservationDialog
        isOpen={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
        onSubmit={handleReservationSubmit}
        isSubmitting={false}
        title="Add Restaurant Reservation"
        tripId={tripId} // Pass the tripId explicitly
      />

      {/* Header stays at top, outside of collapsible */}
      <div className="z-30">
        <DayHeader
          title={dayTitle}
          date={date}
          isOpen={isExpanded}
          onEdit={handleEdit}
          onDelete={() => onDelete(id)}
          onToggle={() => setIsExpanded(prev => !prev)}
        />
      </div>

      {/* Collapsible content includes both the image and the overlay sections */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="max-h-[600px] overflow-y-auto">
          <div className="relative w-full h-[600px]">
            {/* Background image behind everything */}
            <DayImage
              dayId={id}
              title={title}
              imageUrl={imageUrlState} // Use imageUrlState
              defaultImageUrl={defaultImageUrl}
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />

            {/* Overlay content */}
            <div className="relative z-10 w-full h-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column: Stay & Flights/Transport */}
              <div className="space-y-4 order-1">
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Stay</h3>
                  {hotelStays
                    .filter(stay => {
                      if (!stay.hotel_checkin_date || !stay.hotel_checkout_date) {
                        return false;
                      }
                      
                      // Normalize dates by removing time portions to avoid timezone issues
                      const dayDateStr = date.split('T')[0];
                      const checkinDateStr = stay.hotel_checkin_date.split('T')[0];
                      const checkoutDateStr = stay.hotel_checkout_date.split('T')[0];
                      
                      // Create Date objects from normalized strings
                      const dayDate = new Date(dayDateStr);
                      const checkinDate = new Date(checkinDateStr);
                      const checkoutDate = new Date(checkoutDateStr);
                      
                      console.log(`Filtering hotel stays - Day: ${dayDateStr}, 
                        Hotel: ${stay.hotel}, 
                        Check-in: ${checkinDateStr}, 
                        Check-out: ${checkoutDateStr}`);
                      
                      // Include the day if it's on or after check-in and before check-out
                      return dayDate >= checkinDate && dayDate < checkoutDate;
                    })
                    .map((stay) => (
                      <div key={stay.stay_id || stay.id} className="text-white">
                        <p className="font-medium">{stay.hotel}</p>
                        <p className="text-sm">{stay.hotel_address}</p>
                        {stay.hotel_website && (
                          <a 
                            href={stay.hotel_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-200 hover:text-blue-100 flex items-center gap-1 mt-1"
                          >
                            View Hotel Website
                          </a>
                        )}
                        {stay.hotel_checkin_date && stay.hotel_checkin_date.split('T')[0] === date.split('T')[0] && (
                          <p className="text-xs mt-1 text-green-300 font-medium">Check-in day</p>
                        )}
                        {stay.hotel_checkout_date && stay.hotel_checkout_date.split('T')[0] === date.split('T')[0] && (
                          <p className="text-xs mt-1 text-amber-300 font-medium">Check-out day</p>
                        )}
                      </div>
                    ))}
                  {!hotelStays || hotelStays.filter(stay => {
                    if (!stay.hotel_checkin_date || !stay.hotel_checkout_date) {
                      return false;
                    }
                    
                    // Use the same date normalization approach for consistency
                    const dayDateStr = date.split('T')[0];
                    const checkinDateStr = stay.hotel_checkin_date.split('T')[0];
                    const checkoutDateStr = stay.hotel_checkout_date.split('T')[0];
                    
                    const dayDate = new Date(dayDateStr);
                    const checkinDate = new Date(checkinDateStr);
                    const checkoutDate = new Date(checkoutDateStr);
                    
                    return dayDate >= checkinDate && dayDate < checkoutDate;
                  }).length === 0 && (
                    <p className="text-white text-sm italic">No hotel stay for this day</p>
                  )}
                </div>
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Flights and Transport
                  </h3>
                  {transportations.map((transport, idx) => (
                    <div key={idx} className="text-white">
                      <p className="font-medium">{transport.route}</p>
                      <p className="text-sm">{transport.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column: Activities & Reservations */}
              <div className="space-y-4 order-2">
                {/* Activities */}
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Activities</h3>
                  <DayCardContent
                    index={0}
                    title={dayTitle}
                    activities={activities}
                    onAddActivity={() => {}}
                    onEditActivity={() => {}}
                    formatTime={formatTime}
                    dayId={id}
                    eventId={id}
                  />
                </div>

                {/* Reservations */}
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Reservations</h3>
                  <div className="space-y-2">
                    {reservations?.map((reservation, idx) => (
                      <div
                        key={reservation.id || idx}
                        className="flex justify-between items-center p-3
                                   bg-white/90 rounded-lg shadow-sm 
                                   hover:bg-white/100 cursor-pointer"
                        onClick={() => {}}
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {reservation.restaurant_name}
                          </h4>
                          {reservation.reservation_time && (
                            <p className="text-sm text-gray-600">
                              {formatTime(reservation.reservation_time)}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit logic would go here
                          }}
                          className="text-gray-600 hover:bg-gray-200 h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!reservations || reservations.length === 0) && (
                      <p className="text-white text-sm italic">No reservations for this day</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsReservationDialogOpen(true)}
                      className="w-full bg-white/10 text-white hover:bg-white/20 mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reservation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DayCard;
