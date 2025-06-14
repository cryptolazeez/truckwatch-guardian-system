
import React from 'react';
import { Calendar } from '@/components/ui/calendar'; // Shadcn calendar

const MiniCalendarWidget = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2021, 3, 4)); // April 4, 2021 to match image

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Prossimi lanci</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md"
        // Modifying classNames for a more compact look like the image
        classNames={{
          caption_label: "text-sm font-medium",
          head_cell: "text-muted-foreground rounded-md w-8 h-8 font-normal text-[0.8rem]",
          cell: "h-8 w-8 text-center text-sm p-0 relative",
          day: "h-8 w-8 p-0 font-normal",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
          day_today: "bg-accent text-accent-foreground rounded-md",
          months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
          month: "space-y-2",
          nav_button: "h-6 w-6",
          table: "w-full border-collapse space-y-0.5",
          row: "flex w-full mt-1",
        }}
        // initialFocus // might be needed
        // Example: show a specific month if `date` is not set or default to a specific month view
        defaultMonth={new Date(2021, 3)} // April 2021
      />
      {/* Placeholder for event display for selected date */}
      {date?.getDate() === 4 && date?.getMonth() === 3 && ( // Check for April 4th
         <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase">DOM 04</p>
            <div className="flex items-center mt-1">
                <span className="w-8 h-8 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs mr-2">WD</span>
                <p className="text-sm text-gray-700 font-medium">Wired</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default MiniCalendarWidget;
