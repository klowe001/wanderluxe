import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ActivitiesList from '../ActivitiesList';
import DiningList from '../DiningList';

interface DayEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: string;
  currentTitle: string;
  date: string;
  activities: Array<{
    id: string;
    title: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    cost?: number;
    currency?: string;
  }>;
  formatTime: (time?: string) => string;
}

const DayEditDialog: React.FC<DayEditDialogProps> = ({
  isOpen,
  onOpenChange,
  dayId,
  currentTitle,
  date,
  activities,
  formatTime,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [imagePrompt, setImagePrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerateImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.unsplash.com/photos/random', {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        },
        params: {
          query: imagePrompt,
          count: 5
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      setImages(data.map((img: any) => img.urls.regular));
    } catch (error) {
      toast.error('Failed to generate images');
      console.error('Error generating images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('trip_days')
        .update({ 
          title: title,
          image_url: selectedImage 
        })
        .eq('id', dayId);

      if (error) throw error;
      toast.success('Day updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update day');
      console.error('Error updating day:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Day Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Day Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter day title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Generate Image</label>
            <div className="flex gap-2">
              <Input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Where will you be today?"
              />
              <Button 
                onClick={handleGenerateImages}
                disabled={isLoading || !imagePrompt}
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden ${
                    selectedImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`Option ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">Activities</h3>
            <ActivitiesList
              activities={activities.sort((a, b) => {
                if (!a.start_time) return 1;
                if (!b.start_time) return -1;
                return a.start_time.localeCompare(b.start_time);
              })}
              onAddActivity={() => {}}
              onEditActivity={() => {}}
              formatTime={formatTime}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Dining</h3>
            <DiningList
              reservations={[]}
              onAddReservation={() => {}}
              formatTime={formatTime}
              dayId={dayId}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEditDialog;