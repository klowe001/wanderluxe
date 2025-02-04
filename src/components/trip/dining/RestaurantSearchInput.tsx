import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RestaurantDetails {
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  place_id: string;
  rating?: number;
}

interface RestaurantSearchInputProps {
  onPlaceSelect: (place: RestaurantDetails) => void;
  defaultValue?: string;
}

const RestaurantSearchInput: React.FC<RestaurantSearchInputProps> = ({
  onPlaceSelect,
  defaultValue = ''
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!inputRef.current) return;

      try {
        const { data: { key }, error } = await supabase.functions.invoke('get-google-places-key');
        
        if (error) {
          console.error('Error fetching Google Places API key:', error);
          toast.error('Failed to initialize restaurant search');
          setIsLoading(false);
          return;
        }

        if (!key) {
          console.error('No Google Places API key returned');
          toast.error('Failed to initialize restaurant search');
          setIsLoading(false);
          return;
        }

        // Load the Google Places library with the fetched API key
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
        script.async = true;
        script.onload = () => {
          if (!inputRef.current || !window.google) return;

          try {
            const options: google.maps.places.AutocompleteOptions = {
              types: ['establishment'],
              fields: ['name', 'place_id', 'formatted_address', 'formatted_phone_number', 'website', 'rating']
            };

            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
              inputRef.current,
              options
            );

            autoCompleteRef.current.addListener('place_changed', () => {
              if (!autoCompleteRef.current) return;

              const place = autoCompleteRef.current.getPlace();
              console.log('Selected place:', place); // Debug log

              if (!place || !place.name) {
                toast.error('Please select a valid restaurant from the dropdown');
                return;
              }

              // Even if some fields are missing, we can still use the place if we have the minimum required info
              const restaurantDetails: RestaurantDetails = {
                name: place.name,
                place_id: place.place_id || `custom-${Date.now()}`, // Fallback ID if none provided
                formatted_address: place.formatted_address,
                formatted_phone_number: place.formatted_phone_number,
                website: place.website,
                rating: place.rating
              };

              onPlaceSelect(restaurantDetails);
              toast.success('Restaurant details loaded successfully');
            });

            setIsLoading(false);
          } catch (error) {
            console.error('Error setting up Google Places Autocomplete:', error);
            toast.error('Failed to initialize restaurant search');
            setIsLoading(false);
          }
        };

        script.onerror = () => {
          console.error('Failed to load Google Places script');
          toast.error('Failed to load restaurant search');
          setIsLoading(false);
        };

        document.head.appendChild(script);

        return () => {
          // Cleanup
          if (autoCompleteRef.current) {
            google.maps.event.clearInstanceListeners(autoCompleteRef.current);
          }
          const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
          if (existingScript) {
            existingScript.remove();
          }
        };
      } catch (error) {
        console.error('Error initializing Google Places:', error);
        toast.error('Failed to initialize restaurant search');
        setIsLoading(false);
      }
    };

    initializeAutocomplete();
  }, [onPlaceSelect]);

  return (
    <div className="space-y-2">
      <Label htmlFor="restaurant">Restaurant Name</Label>
      <Input
        ref={inputRef}
        type="text"
        id="restaurant"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={isLoading ? "Loading..." : "Search for a restaurant..."}
        className="w-full"
        disabled={isLoading}
      />
    </div>
  );
};

export default RestaurantSearchInput;