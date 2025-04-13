import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { DayProps } from 'react-day-picker';

// Type for events
type EventType = {
  date: Date;
  name: string;
  description: string;
  type: 'holiday' | 'school' | 'class' | 'personal';
};

// Adding current dates for testing (2023 and 2024 holidays)
const currentHolidays: Omit<EventType, 'type'>[] = [
  { date: new Date(2023, 3, 12), name: "Good Friday 2023", description: "Good Friday" },
  { date: new Date(2023, 11, 25), name: "Christmas 2023", description: "Christmas Day" },
  { date: new Date(2024, 0, 1), name: "New Year 2024", description: "New Year's Day" },
  { date: new Date(2024, 1, 10), name: "Chinese New Year 2024", description: "Chinese New Year" },
  { date: new Date(2024, 2, 29), name: "Good Friday 2024", description: "Good Friday" },
  { date: new Date(2024, 3, 11), name: "Eid al-Fitr 2024", description: "Eid al-Fitr" },
  { date: new Date(2024, 3, 12), name: "April Event Today", description: "Today's Event" },
  { date: new Date(), name: "Today's Event", description: "Event happening today" }
];

// Indonesian national holidays for 2025
const indonesianHolidays: Omit<EventType, 'type'>[] = [
  { date: new Date(2025, 0, 1), name: "Tahun Baru", description: "New Year's Day" },
  { date: new Date(2025, 1, 1), name: "Tahun Baru Imlek", description: "Chinese New Year" },
  { date: new Date(2025, 2, 31), name: "Isra Mikraj", description: "Isra and Mi'raj" },
  { date: new Date(2025, 3, 18), name: "Jumat Agung", description: "Good Friday" },
  { date: new Date(2025, 3, 20), name: "Paskah", description: "Easter" },
  { date: new Date(2025, 4, 1), name: "Hari Buruh", description: "Labor Day" },
  { date: new Date(2025, 4, 14), name: "Hari Raya Idul Fitri", description: "Eid al-Fitr" },
  { date: new Date(2025, 4, 15), name: "Hari Raya Idul Fitri", description: "Eid al-Fitr (Day 2)" },
  { date: new Date(2025, 4, 26), name: "Kenaikan Yesus Kristus", description: "Ascension Day" },
  { date: new Date(2025, 5, 1), name: "Hari Lahir Pancasila", description: "Pancasila Day" },
  { date: new Date(2025, 6, 21), name: "Idul Adha", description: "Eid al-Adha" },
  { date: new Date(2025, 7, 17), name: "Hari Kemerdekaan", description: "Independence Day" },
  { date: new Date(2025, 8, 8), name: "Maulid Nabi Muhammad", description: "Prophet Muhammad's Birthday" },
  { date: new Date(2025, 11, 25), name: "Hari Natal", description: "Christmas Day" }
];

// Combine all events
const allEvents: EventType[] = [
  ...currentHolidays.map(event => ({ ...event, type: 'holiday' as const })),
  ...indonesianHolidays.map(event => ({ ...event, type: 'holiday' as const })),
];

// Function to get events for a specific date
const getEventsForDate = (date: Date): EventType[] => {
  // Make sure to create the comparison with the correct values
  return allEvents.filter(event => {
    return (
      date.getDate() === event.date.getDate() &&
      date.getMonth() === event.date.getMonth() &&
      date.getFullYear() === event.date.getFullYear()
    );
  });
};

// Function to check if a date has events
const hasEvent = (date: Date) => {
  return allEvents.some(event => {
    return (
      date.getDate() === event.date.getDate() &&
      date.getMonth() === event.date.getMonth() &&
      date.getFullYear() === event.date.getFullYear()
    );
  });
};

// Debug function to log all events and current date
const debugEvents = () => {
  console.log("All events:", allEvents);
  console.log("Current date:", new Date());
  
  // Check for today's events
  const today = new Date();
  console.log("Today's events:", getEventsForDate(today));
};

// Call debug function
debugEvents();

// Function to determine event dot color
const getEventColor = (type: string) => {
  switch (type) {
    case "holiday":
      return "bg-red-500";
    case "school":
      return "bg-yellow-500";
    case "class":
      return "bg-blue-500";
    case "personal":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const CalendarSection: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [calendarType, setCalendarType] = useState<'embedded' | 'google'>('embedded');

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setSelectedEvents(getEventsForDate(date));
    } else {
      setSelectedEvents([]);
    }
  };

  // Add new event
  const addEvent = () => {
    if (date && newEventName) {
      const newEvent: EventType = {
        date: date,
        name: newEventName,
        description: newEventDesc || 'No description',
        type: 'personal'
      };
      
      allEvents.push(newEvent);
      setSelectedEvents(getEventsForDate(date));
      setNewEventName('');
      setNewEventDesc('');
    }
  };

  // Custom Day component
  const CustomDay = (props: DayProps) => {
    const { date: dayDate } = props;
    const isSelected = date && dayDate.getDate() === date.getDate() && 
                      dayDate.getMonth() === date.getMonth() && 
                      dayDate.getFullYear() === date.getFullYear();
                      
    // Check if this day has events
    const dayEvents = getEventsForDate(dayDate);
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div className="relative">
        <div
          className={`h-10 w-10 rounded-md flex items-center justify-center ${
            isSelected ? "bg-accent text-white" : "hover:bg-accent/10"
          } ${date && dayDate.getMonth() !== date.getMonth() ? "text-gray-500" : ""}`}
        >
          {format(dayDate, "d")}
        </div>
        
        {hasEvents && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${getEventColor(event.type)}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="calendar" className="relative py-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white pb-2">
              Class <span className="seven-text">Calendar</span>
            </h2>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"></div>
          </div>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with holidays, school events, and class activities.
          </p>
          
          {/* Calendar Type Selector */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${calendarType === 'embedded' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => setCalendarType('embedded')}
            >
              Built-in Calendar
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${calendarType === 'google' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => setCalendarType('google')}
            >
              Google Calendar
            </button>
          </div>
        </motion.div>
        
        {calendarType === 'embedded' ? (
          <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            {/* Calendar */}
            <motion.div
              className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-accent/20 shadow-lg shadow-accent/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                locale={id}
                className="w-full"
                classNames={{
                  day_selected: "bg-accent text-white",
                  day_today: "bg-accent/10 text-accent"
                }}
                components={{
                  Day: CustomDay
                }}
              />
  
              {/* Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-300">Holidays</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-300">School Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-300">Class Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-300">Personal Events</span>
                </div>
              </div>
              
              {/* Selected Date Events */}
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {date ? format(date, 'EEEE, d MMMM yyyy', { locale: id }) : 'Select a date'}
                </h3>
                
                {selectedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvents.map((event, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          event.type === 'holiday' ? 'border-red-500/30 bg-red-500/10' :
                          event.type === 'school' ? 'border-yellow-500/30 bg-yellow-500/10' :
                          event.type === 'class' ? 'border-blue-500/30 bg-blue-500/10' :
                          'border-green-500/30 bg-green-500/10'
                        }`}
                      >
                        <h4 className="font-semibold text-white">{event.name}</h4>
                        <p className="text-sm text-gray-300">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No events for this date</p>
                )}
                
                {/* Add Event Form */}
                <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                  <h4 className="font-semibold text-white">Add New Event</h4>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Event Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/20 rounded-md p-2 text-white"
                      placeholder="Event name"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Description</label>
                    <textarea
                      className="w-full bg-black/60 border border-white/20 rounded-md p-2 text-white"
                      placeholder="Event description"
                      rows={3}
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                    ></textarea>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/80 text-white" 
                    onClick={addEvent}
                  >
                    <i className="fas fa-plus mr-2"></i> Save Event
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-accent/20 shadow-lg shadow-accent/5 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-video w-full">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=c_classroom6427e9bb%40group.calendar.google.com&ctz=Asia%2FJakarta" 
                style={{ border: 0 }} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no"
                title="Google Calendar"
                className="rounded-lg"
              ></iframe>
            </div>
            
            <div className="mt-6 flex justify-center">
              <a 
                href="https://calendar.google.com/calendar/u/0?cid=Y19jbGFzc3Jvb202NDI3ZTliYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t" 
                target="_blank"
                rel="noreferrer"
                className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg inline-flex items-center transition-all"
              >
                <i className="fas fa-plus mr-2"></i> Add to My Google Calendar
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CalendarSection;