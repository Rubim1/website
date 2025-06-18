import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ScheduleDay {
  day: string;
  students: string[];
}

const weeklySchedule: ScheduleDay[] = [
  {
    day: "Monday",
    students: ["Mirza", "Zevilia", "Kiano", "Dafa", "Ochi", "Radhit"]
  },
  {
    day: "Tuesday",
    students: ["Reno", "Yayan", "Shina", "Yazan", "Fiya", "Rexa"]
  },
  {
    day: "Wednesday",
    students: ["Albert", "Nazwa", "Alisya", "Bunga", "Wahyu", "Naura"]
  },
  {
    day: "Thursday",
    students: ["Shinta", "Nizar", "Syafa", "Keyla", "Rengga"]
  },
  {
    day: "Friday",
    students: ["Aleta", "Salsa", "Diandra", "Alvaro"]
  },
  {
    day: "Saturday",
    students: ["Tyara", "Rubim", "Faza", "Niken", "Neta", "Rafa"]
  }
];

// Calendar days for April
const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

const ScheduleSection: React.FC = () => {
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would add the event to your storage
    setNewEvent({ title: '', date: '' });
    // Show a toast notification
    alert(`Event "${newEvent.title}" added on ${newEvent.date}`);
  };

  return (
    <section id="schedule" className="relative py-20">
      {/* Background with cosmic effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.05)_0%,_rgba(10,20,40,0.2)_70%,_rgba(10,10,20,0)_100%)]"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="inline-block text-4xl font-orbitron font-bold gradient-text pb-2 border-b-2 border-primary">
            Class Schedule
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with our class activities and important dates.
          </p>
        </motion.div>
        
        {/* Weekly Schedule */}
        <motion.div 
          className="bg-card/20 backdrop-blur-md rounded-xl p-8 border border-primary/20 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-center text-primary mb-8">Weekly Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklySchedule.map((day, index) => (
              <motion.div 
                key={day.day}
                className="bg-card/30 backdrop-blur-md rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary/20 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)" }}
              >
                <h4 className="text-xl font-orbitron font-bold text-primary mb-4">{day.day}</h4>
                <ul className="space-y-2">
                  {day.students.map((student, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center text-gray-300"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + (i * 0.05) }}
                    >
                      <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                      {student}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Calendar */}
        <motion.div 
          className="bg-card/20 backdrop-blur-md rounded-xl p-8 border border-primary/20 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-center text-primary mb-6">April 2025</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="p-3 text-accent font-medium">Min</th>
                    <th className="p-3 text-accent font-medium">Sen</th>
                    <th className="p-3 text-accent font-medium">Sel</th>
                    <th className="p-3 text-accent font-medium">Rab</th>
                    <th className="p-3 text-accent font-medium">Kam</th>
                    <th className="p-3 text-accent font-medium">Jum</th>
                    <th className="p-3 text-accent font-medium">Sab</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Create calendar rows by splitting into weeks */}
                  {Array.from({ length: 5 }).map((_, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const dayNum = weekIndex * 7 + dayIndex + 1;
                        return dayNum <= 30 ? (
                          <td key={dayIndex} className="p-3 text-center">
                            <motion.div 
                              className="w-10 h-10 flex items-center justify-center mx-auto rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(56, 189, 248, 0.3)" }}
                            >
                              {dayNum}
                            </motion.div>
                          </td>
                        ) : (
                          <td key={dayIndex}></td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add New Event Form */}
            <div className="bg-card/30 backdrop-blur-md rounded-lg p-6 border border-primary/10">
              <h4 className="text-xl font-semibold text-primary mb-4">Add New Event</h4>
              <form onSubmit={handleAddEvent}>
                <div className="mb-4">
                  <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                  <input 
                    type="text" 
                    id="eventTitle" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input 
                    type="date" 
                    id="eventDate" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="frame-impact w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-primary/80 hover:to-accent/80"
                >
                  Add Event
                </button>
              </form>
            </div>
          </div>
        </motion.div>
        

      </div>
    </section>
  );
};

export default ScheduleSection;
