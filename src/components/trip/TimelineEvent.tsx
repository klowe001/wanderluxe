
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import DayImage from './day/DayImage';
import EventContent from './event/EventContent';
import EventEditDialog from './event/EventEditDialog';
import { useEventState } from './event/useEventState';
import { useEventHandlers } from './event/useEventHandlers';
import { DayActivity, ActivityFormData } from '@/types/trip';

interface TimelineEventProps {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  hotel: string;
  hotel_details: string;
  hotel_checkin_date: string;
  hotel_checkout_date: string;
  hotel_url: string;
  activities: DayActivity[];
  index: number;
  tripId: string;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ 
  id,
  date, 
  title, 
  description, 
  image, 
  hotel, 
  hotel_details,
  hotel_checkin_date,
  hotel_checkout_date,
  hotel_url,
  activities,
  index,
  tripId,
  onEdit,
  onDelete
}) => {
  const {
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    newActivity,
    setNewActivity,
    isAddingActivity,
    setIsAddingActivity,
    editingActivity,
    setEditingActivity,
    activityEdit,
    setActivityEdit,
  } = useEventState({
    date,
    title,
    description,
    hotel,
    hotelDetails: hotel_details, // Fixed property name
    hotelCheckinDate: hotel_checkin_date,
    hotelCheckoutDate: hotel_checkout_date,
    hotelUrl: hotel_url
  });

  const {
    handleEdit,
    handleAddActivity,
    handleEditActivity,
  } = useEventHandlers(id, tripId, onEdit, editData, activities);

  // Implement the activity handlers
  const onAddActivity = () => {
    const formData: ActivityFormData = {
      title: newActivity.title,
      cost: newActivity.cost,
      currency: newActivity.currency,
      ...(newActivity.description && { description: newActivity.description }),
      ...(newActivity.start_time && { start_time: newActivity.start_time }),
      ...(newActivity.end_time && { end_time: newActivity.end_time })
    };

    handleAddActivity(formData).then(success => {
      if (success) {
        setIsAddingActivity(false);
        setNewActivity({ title: "", cost: "", currency: "USD" });
      }
    });
  };

  const onEditActivity = (activityId: string) => {
    const formData: ActivityFormData = {
      title: activityEdit.title,
      cost: activityEdit.cost,
      currency: activityEdit.currency,
      ...(activityEdit.description && { description: activityEdit.description }),
      ...(activityEdit.start_time && { start_time: activityEdit.start_time }),
      ...(activityEdit.end_time && { end_time: activityEdit.end_time })
    };

    handleEditActivity(activityId, formData).then(success => {
      if (success) {
        setEditingActivity(null);
        setActivityEdit({ title: "", cost: "", currency: "USD" });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <DayImage 
              title={title} 
              imageUrl={image} 
              dayId={id}
              defaultImageUrl={undefined}
            />
            <EventContent
              date={date}
              title={title}
              description={description}
              hotel={hotel}
              hotelDetails={hotel_details}
              hotelUrl={hotel_url}
              hotelCheckinDate={hotel_checkin_date}
              hotelCheckoutDate={hotel_checkout_date}
              activities={activities}
              onEdit={() => setIsEditing(true)}
              isAddingActivity={isAddingActivity}
              onAddingActivityChange={setIsAddingActivity}
              newActivity={newActivity}
              onNewActivityChange={setNewActivity}
              onAddActivity={onAddActivity}
              editingActivity={editingActivity}
              onEditingActivityChange={setEditingActivity}
              activityEdit={activityEdit}
              onActivityEditChange={setActivityEdit}
              onEditActivity={onEditActivity}
              isCheckoutDay={hotel_checkout_date === date}
              eventId={id}
            />
          </div>
        </CardContent>
      </Card>

      <EventEditDialog
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        editData={editData}
        onEditDataChange={setEditData}
        onSubmit={handleEdit}
      />
    </motion.div>
  );
};

export default TimelineEvent;
