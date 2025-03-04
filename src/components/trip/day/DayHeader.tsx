
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface DayHeaderProps {
  title: string;
  date: string;
  isOpen?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

const DayHeader: React.FC<DayHeaderProps> = ({
  title,
  date,
  isOpen = false,
  onEdit,
  onDelete
}) => {
  const formattedDate = format(parseISO(date), 'EEEE, MMMM d');

  return (
    <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between bg-sand-50/50 hover:bg-sand-100/70 transition-colors">
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </div>
    </CollapsibleTrigger>
  );
};

export default DayHeader;
