import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

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
      if (!inputRef.current || !window.google) return;

      try {
        const { data: { key }, error } = await supabase.functions.invoke('get-google-places-key');
        
        if (error) {
          console.error('Error fetching Google Places API key:', error);
          return;
        }

        if (!key) {
          console.error('No Google Places API key returned');
          return;
        }

        // Load the Google Places library with the fetched API key
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
        script.async = true;
        script.onload = () => {
          const options: google.maps.places.AutocompleteOptions = {
            types: ['restaurant'],
            fields: ['name', 'place_id', 'formatted_address', 'formatted_phone_number', 'website', 'rating']
          };

          autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current!,
            options
          );

          autoCompleteRef.current.addListener('place_changed', () => {
            if (!autoCompleteRef.current) return;

            const place = autoCompleteRef.current.getPlace();
            if (!place.place_id) return;

            onPlaceSelect({
              name: place.name || '',
              place_id: place.place_id,
              formatted_address: place.formatted_address,
              formatted_phone_number: place.formatted_phone_number,
              website: place.website,
              rating: place.rating
            });
          });
        };

        document.head.appendChild(script);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google Places:', error);
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
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