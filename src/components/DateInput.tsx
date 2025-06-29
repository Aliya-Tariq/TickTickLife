import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateInputProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export default function DateInput({ date, onDateChange }: DateInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-gray font-dm-sans">
        Your Date of Birth 🎂
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-dm-sans h-12 border-coral-pink bg-white hover:bg-gray-50",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 text-coral-pink" />
            {date ? format(date, "PPP") : "Pick your birth date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate);
              setOpen(false);
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1920}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}