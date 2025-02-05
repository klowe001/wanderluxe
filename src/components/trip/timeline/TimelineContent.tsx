import React from 'react';
import { motion } from 'framer-motion';
import AccommodationGroup from '../accommodation/AccommodationGroup';
import DayCard from '../day/DayCard';
import FlightIndicator from '../transportation/FlightIndicator';
import { TripDay } from '@/types/trip';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { format, parseISO } from 'date-fns';

type TransportationEvent = Tables<'transportation_events'>;

interface TimelineContentProps {
  groups: Array<{
    hotel?: string;
    hotelDetails?: string;
    checkinDate?: string;
    checkoutDate?: string;
    days: TripDay[];
  }>;
}

const TimelineContent: React.FC<TimelineContentProps> = ({ groups }) => {
  const tripId = groups[0]?.days[0]?.trip_id;

  const { data: transportationEvents } = useQuery({
    queryKey: ['transportation-events', tripId],
    queryFn: async () => {
      if (!tripId) return [];

      const { data, error } = await supabase
        .from('transportation_events')
        .select('*')
        .eq('trip_id', tripId)
        .eq('type', 'flight')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as TransportationEvent[];
    },
    enabled: !!tripId
  });

  // Group days by date
  const daysByDate = groups.reduce((acc, group) => {
    group.days.forEach(day => {
      const date = day.date.split('T')[0];
      acc[date] = day;
    });
    return acc;
  }, {} as Record<string, TripDay>);

  // Sort flights by date
  const sortedFlights = transportationEvents?.sort((a, b) => {
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => {
        // Get flights that occur during this accommodation period
        const relevantFlights = sortedFlights?.filter(flight => {
          const flightDate = new Date(flight.start_date);
          const checkinDate = group.checkinDate ? new Date(group.checkinDate) : null;
          const checkoutDate = group.checkoutDate ? new Date(group.checkoutDate) : null;
          
          if (!checkinDate || !checkoutDate) return false;
          
          return flightDate >= checkinDate && flightDate <= checkoutDate;
        });

        return (
          <motion.div
            key={`${group.hotel || 'standalone'}-${groupIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
          >
            {group.hotel ? (
              <AccommodationGroup
                hotel={group.hotel}
                hotelDetails={group.hotelDetails}
                checkinDate={group.checkinDate!}
                checkoutDate={group.checkoutDate!}
              >
                {relevantFlights?.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-center mb-6"
                  >
                    <FlightIndicator
                      event={event}
                      onClick={() => {}}
                    />
                  </motion.div>
                ))}
                {group.days.map((day, dayIndex) => (
                  <DayCard
                    key={day.id}
                    id={day.id}
                    date={day.date.split('T')[0]}
                    title={day.title}
                    description={day.description}
                    activities={day.activities || []}
                    onAddActivity={() => {}}
                    index={dayIndex}
                    onDelete={() => {}}
                  />
                ))}
              </AccommodationGroup>
            ) : (
              <div className="space-y-6">
                {group.days.map((day, dayIndex) => (
                  <DayCard
                    key={day.id}
                    id={day.id}
                    date={day.date.split('T')[0]}
                    title={day.title}
                    description={day.description}
                    activities={day.activities || []}
                    onAddActivity={() => {}}
                    index={dayIndex}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimelineContent;