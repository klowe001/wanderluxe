import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RestaurantSearchInput from './RestaurantSearchInput';
import { Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Define your form schema
const formSchema = z.object({
  restaurant_name: z.string().min(1, "Restaurant name is required"),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  website: z.string().optional(),
  reservation_time: z.string().optional().nullable(),
  number_of_people: z.number().min(1).optional(),
  notes: z.string().optional(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  place_id: z.string().optional(),
  rating: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RestaurantReservationFormProps {
  onSubmit: (data: FormValues & { tripId: string }) => void; 
  defaultValues?: Partial<FormValues>;
  isSubmitting?: boolean;
  tripId: string; 
}

const RestaurantReservationForm: React.FC<RestaurantReservationFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  tripId,
}) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const toast = useToast();

  // Replace this with your actual Google Maps API loader
  useEffect(() => {
    const loadAPI = async () => {
      try {
        const isLoaded = await loadGoogleMapsAPI(); 
        if (isLoaded) {
          setIsGoogleMapsLoaded(true);
        } else {
          toast.error('Failed to initialize restaurant search');
        }
      } catch (error) {
        console.error('Error initializing Google Places:', error);
        toast.error('Failed to initialize restaurant search');
      }
    };
    loadAPI();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurant_name: '',
      reservation_time: null,
      number_of_people: undefined,
      notes: '',
      cost: undefined,
      currency: '', // default empty string
      ...defaultValues,
    },
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    form.setValue('restaurant_name', place.name || '');
    form.setValue('address', place.formatted_address || '');
    form.setValue('phone_number', place.formatted_phone_number || '');
    form.setValue('website', place.website || '');
    form.setValue('place_id', place.place_id || '');
    form.setValue('rating', place.rating || 0);
  };

  const handleSubmitForm = form.handleSubmit((data) => {
    const processedData = {
      ...data,
      reservation_time: data.reservation_time === '' ? null : data.reservation_time,
      trip_id: tripId // Use the correct key for your database schema
    };
    onSubmit(processedData);
  });

  // Format cost on blur: remove commas, parse as number, format as a string with commas, and update form state.
  const handleCostBlur = (value: string) => {
    const numericValue = Number(value.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      const formatted = new Intl.NumberFormat('en-US').format(numericValue);
      form.setValue('cost', numericValue);
      return formatted;
    }
    return value;
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitForm} className="space-y-4">
        {/* Restaurant Name with red asterisk */}
        <FormField
          control={form.control}
          name="restaurant_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Restaurant Name <span className="text-red-500">*</span>
              </FormLabel>
              <RestaurantSearchInput
                value={field.value}
                onChange={(name, details) => {
                  field.onChange(name);
                  if (details) {
                    form.setValue('address', details.formatted_address || '');
                    form.setValue('phone_number', details.formatted_phone_number || '');
                    form.setValue('website', details.website || '');
                    form.setValue('place_id', details.place_id || '');
                    form.setValue('rating', details.rating || 0);
                  }
                }}
              />
            </FormItem>
          )}
        />

        {/* Reservation Time with red asterisk */}
        <FormField
          control={form.control}
          name="reservation_time"
          render={({ field }) => {
            const [hour, minute, period] = React.useMemo(() => {
              if (!field.value) return [12, 0, 'AM'];
              const [hourStr, minuteStr] = field.value.split(':');
              const hourNum = parseInt(hourStr, 10);
              const minuteNum = parseInt(minuteStr, 10);
              const period = hourNum >= 12 ? 'PM' : 'AM';
              const hour12 = hourNum % 12 || 12;
              return [hour12, minuteNum, period];
            }, [field.value]);

            const handleTimeChange = (newHour: number, newMinute: number, newPeriod: string) => {
              let hour24 = newHour;
              if (newPeriod === 'PM' && newHour < 12) {
                hour24 = newHour + 12;
              } else if (newPeriod === 'AM' && newHour === 12) {
                hour24 = 0;
              }
              const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
              field.onChange(timeString);
            };

            return (
              <FormItem>
                <FormLabel>
                  Reservation Time <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex items-center space-x-2">
                  <select
                    className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm"
                    value={hour}
                    onChange={(e) => handleTimeChange(parseInt(e.target.value, 10), minute, period)}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <span>:</span>

                  <select
                    className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm"
                    value={minute}
                    onChange={(e) => handleTimeChange(hour, parseInt(e.target.value, 10), period)}
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>

                  <select
                    className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm"
                    value={period}
                    onChange={(e) => handleTimeChange(hour, minute, e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </FormItem>
            );
          }}
        />

        {/* Number of People */}
        <FormField
          control={form.control}
          name="number_of_people"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of People</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className="bg-white"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Notes (1 line) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-white" rows={1} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Cost & Currency in one row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cost Input */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={(e) => {
                      const formatted = handleCostBlur(e.target.value);
                      // We call field.onChange with the numeric value if possible
                      field.onChange(Number(formatted.replace(/,/g, '')));
                    }}
                    className="bg-white"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Currency Field */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="bg-white mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-earth-500 focus:ring-earth-500 sm:text-sm"
                  >
                    <option value="">Select currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-sand-500 hover:bg-sand-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Reservation'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RestaurantReservationForm;
