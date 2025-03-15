import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageGenerationSection from './dialogs/ImageGenerationSection';
import { toast } from "sonner";

interface DayEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: string;
  currentTitle: string;
  onTitleChange: (title: string) => void;
  onSave: (data: { title: string; image_url?: string }) => Promise<void>;
}

const DayEditDialog: React.FC<DayEditDialogProps> = ({
  open,
  onOpenChange,
  dayId,
  currentTitle,
  onTitleChange,
  onSave,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: { title: string; image_url?: string } = { title };
      if (selectedImage) {
        updateData.image_url = selectedImage;
      }
      await onSave(updateData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving day:', error);
      toast.error('Failed to update day');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Day Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day-title" className="text-right">
              Title
            </Label>
            <Input
              id="day-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onTitleChange(e.target.value);
              }}
              className="col-span-3"
              placeholder="Enter day title"
            />
          </div>
          <div>
            <Label className="mb-2 block">Select an Image</Label>
            <ImageGenerationSection
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayEditDialog;
