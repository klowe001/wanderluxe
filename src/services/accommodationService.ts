import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AccommodationFormData {
  hotel: string;
  hotelDetails: string;
  hotelUrl: string;
  checkinDate: string;
  checkoutDate: string;
  expenseCost: string;
  expenseCurrency: string;
}

export const generateDatesArray = (startDate: string, endDate: string) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate < lastDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const addAccommodation = async (tripId: string, formData: AccommodationFormData) => {
  try {
    // Create the main check-in event
    const { data: checkInEvent, error: checkInError } = await supabase
      .from('timeline_events')
      .insert([{
        trip_id: tripId,
        date: formData.checkinDate,
        title: `Check-in: ${formData.hotel}`,
        hotel: formData.hotel,
        hotel_details: formData.hotelDetails,
        hotel_url: formData.hotelUrl,
        hotel_checkin_date: formData.checkinDate,
        hotel_checkout_date: formData.checkoutDate,
        expense_type: 'accommodation',
        expense_cost: formData.expenseCost ? Number(formData.expenseCost) : null,
        expense_currency: formData.expenseCurrency,
        order_index: 0
      }])
      .select()
      .single();

    if (checkInError) throw checkInError;

    // Generate events for each day of the stay (excluding check-in and checkout days)
    const stayDates = generateDatesArray(formData.checkinDate, formData.checkoutDate);
    
    if (stayDates.length > 1) {
      const stayEvents = stayDates.slice(1).map((date) => ({
        trip_id: tripId,
        date: date,
        title: `Stay at ${formData.hotel}`,
        hotel: formData.hotel,
        hotel_details: formData.hotelDetails,
        hotel_url: formData.hotelUrl,
        hotel_checkin_date: formData.checkinDate,
        hotel_checkout_date: formData.checkoutDate,
        order_index: 0
      }));

      const { error: stayError } = await supabase
        .from('timeline_events')
        .insert(stayEvents);

      if (stayError) throw stayError;
    }

    // Create checkout event
    const { error: checkoutError } = await supabase
      .from('timeline_events')
      .insert([{
        trip_id: tripId,
        date: formData.checkoutDate,
        title: `Check-out: ${formData.hotel}`,
        hotel: formData.hotel,
        hotel_details: formData.hotelDetails,
        hotel_url: formData.hotelUrl,
        hotel_checkin_date: formData.checkinDate,
        hotel_checkout_date: formData.checkoutDate,
        order_index: 0
      }]);

    if (checkoutError) throw checkoutError;

    toast.success('Accommodation added successfully');
    return true;
  } catch (error) {
    console.error('Error adding accommodation:', error);
    toast.error('Failed to add accommodation');
    return false;
  }
};

export const updateAccommodation = async (
  tripId: string,
  stayId: string,
  formData: AccommodationFormData
) => {
  try {
    // First, delete all existing events for this hotel stay
    const { error: deleteError } = await supabase
      .from('timeline_events')
      .delete()
      .eq('hotel', formData.hotel)
      .eq('hotel_checkin_date', formData.checkinDate)
      .eq('hotel_checkout_date', formData.checkoutDate);

    if (deleteError) throw deleteError;

    // Then create new events for the updated stay
    const success = await addAccommodation(tripId, formData);
    if (!success) throw new Error('Failed to update accommodation');

    toast.success('Accommodation updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating accommodation:', error);
    toast.error('Failed to update accommodation');
    return false;
  }
};

export const deleteAccommodation = async (
  stay: {
    hotel: string;
    hotel_checkin_date: string;
    hotel_checkout_date: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('hotel', stay.hotel)
      .eq('hotel_checkin_date', stay.hotel_checkin_date)
      .eq('hotel_checkout_date', stay.hotel_checkout_date);

    if (error) throw error;

    toast.success('Accommodation deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    toast.error('Failed to delete accommodation');
    return false;
  }
};