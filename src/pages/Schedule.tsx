import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, ClockIcon, UserIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Types for appointments and time slots
interface Appointment {
  id: string;
  customerName: string;
  details?: string;
  date: string; // ISO date string
  time: string; // Format: "HH:MM"
  duration?: number; // minutes
  created_at: string;
}

interface TimeSlot {
  id: string;
  date: string; // ISO date string
  time: string; // Format: "HH:MM"
  isBooked: boolean;
}

interface BackendSlot {
  time: string;
  is_booked: boolean;
}

interface BackendBooking {
  id: number;
  date: string;
  time: string;
  customer_name: string;
  details: string | null;
  created_at: string;
}

interface BookingResponse {
  bookings: BackendBooking[];
  slots: Record<string, BackendSlot[]>;
  business_hours: string;
  slot_duration: number;
}


const Schedule = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('day');
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [assistantId, setAssistantId] = useState<number | null>(null);
  
  // Fetch available assistants for the logged-in user
  useEffect(() => {
    if (!user) return;
    
    console.log('Attempting to fetch user assistants');
    
    // This endpoint doesn't exist yet, so we'll use a hard-coded assistant ID for now
    // In a real app, this would be an API call to get the user's assistants
    setAssistantId(1);
    
    // Note: In a real implementation, we would fetch the assistants with:
    // fetch('/api/user/assistants')
    //   .then(response => response.json())
    //   .then(data => {
    //     setUserAssistants(data.assistants);
    //     if (data.assistants.length > 0) {
    //       setAssistantId(data.assistants[0].id);
    //     }
    //   })
    //   .catch(err => {
    //     console.error('Error fetching assistants:', err);
    //   });
  }, [user]);
  
  // Function to get date range based on selected view
  const getDateRange = () => {
    const today = new Date(selectedDate);
    
    if (selectedView === 'day') {
      return [today.toISOString().split('T')[0]];
    }
    
    const dates = [];
    const startOfWeek = new Date(today);
    
    // Adjust to start of week (Sunday)
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    if (selectedView === 'week') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (selectedView === 'month') {
      // Start from the first day of the month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };
  
  // Calculate start and end dates for the API call
  const getStartAndEndDates = () => {
    if (selectedView === 'day') {
      return {
        startDate: selectedDate,
        endDate: selectedDate
      };
    } else if (selectedView === 'week') {
      const today = new Date(selectedDate);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    } else {
      // Month view
      const today = new Date(selectedDate);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      };
    }
  };
  
  // Fetch data from API
  useEffect(() => {
    if (!assistantId) {
      return; // Don't fetch if we don't have an assistantId yet
    }
    
    setLoading(true);
    setError(null);
    
    const { startDate, endDate } = getStartAndEndDates();
    const apiUrl = `/api/bookings/${assistantId}?start_date=${startDate}&end_date=${endDate}`;
    
    console.log('Fetching data from:', apiUrl);
    
    // Fetch bookings from the API
    fetch(apiUrl)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch booking data: ${response.status}`);
        }
        return response.json();
      })
      .then((data: BookingResponse) => {
        console.log('Received data:', data);
        // Set slot duration
        setSlotDuration(data.slot_duration);
        
        // Process appointments
        const formattedAppointments: Appointment[] = data.bookings.map(booking => ({
          id: booking.id.toString(),
          customerName: booking.customer_name,
          details: booking.details || undefined,
          date: booking.date,
          time: booking.time,
          duration: data.slot_duration,
          created_at: booking.created_at
        }));
        
        setAppointments(formattedAppointments);
        
        // Process time slots
        const formattedSlots: TimeSlot[] = [];
        
        // Iterate through each date in the slots object
        Object.entries(data.slots).forEach(([date, slots]) => {
          slots.forEach(slot => {
            formattedSlots.push({
              id: `${date}-${slot.time}`,
              date,
              time: slot.time,
              isBooked: slot.is_booked
            });
          });
        });
        
        setTimeSlots(formattedSlots);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        // setError(`Failed to fetch booking data: ${err.message || 'Unknown error'}`);
        setLoading(false);
      });
  }, [selectedDate, selectedView, assistantId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    // Convert 24-hour time to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Get appointment for a specific time slot
  const getAppointmentForSlot = (slot: TimeSlot) => {
    if (!slot.isBooked) return null;
    return appointments.find(appointment => 
      appointment.date === slot.date && appointment.time === slot.time
    );
  };

  // Determine classes based on theme
  const headerClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const cardClass = theme === 'dark' 
    ? 'bg-gray-800/50 border-gray-700' 
    : 'bg-white/80 border-gray-200';
  const activeButtonClass = theme === 'dark'
    ? 'bg-primary-600 text-white'
    : 'bg-primary-500 text-white';
  const inactiveButtonClass = theme === 'dark'
    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    : 'bg-gray-200 text-gray-600 hover:bg-gray-300';
  const slotClass = theme === 'dark'
    ? 'bg-gray-700/50 hover:bg-gray-700'
    : 'bg-gray-100 hover:bg-gray-200';
  const bookedSlotClass = theme === 'dark'
    ? 'bg-primary-900/50 text-primary-200 border-primary-700'
    : 'bg-primary-100/70 text-primary-700 border-primary-200';
  const freeSlotClass = theme === 'dark'
    ? 'hover:bg-gray-600'
    : 'hover:bg-gray-200';
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Schedule
          </h1>
          <p className={headerClass}>
            View and manage your appointments and available time slots
          </p>
        </div>
        
        {/* Controls */}
        <div className={`p-4 rounded-lg border ${cardClass} shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center`}>
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-primary-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
          </div>
          
          {/* View Selector */}
          <div className="flex gap-2">
            {['day', 'week', 'month'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as 'day' | 'week' | 'month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedView === view ? activeButtonClass : inactiveButtonClass
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-lg bg-red-100 border border-red-300 text-red-800`}>
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Time Slots Column */}
          <div className={`md:col-span-2 p-6 rounded-lg border ${cardClass} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${headerClass}`}>
              <ClockIcon className="w-5 h-5 inline-block mr-2" />
              Time Slots
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className={`w-10 h-10 border-t-4 border-primary-500 border-solid rounded-full animate-spin`}></div>
              </div>
            ) : (
              <div className="space-y-6">
                {getDateRange().map(date => {
                  const slotsForDay = timeSlots.filter(slot => slot.date === date);
                  
                  if (slotsForDay.length === 0) {
                    return (
                      <div key={date} className="space-y-2">
                        <h3 className={`text-lg font-medium ${headerClass}`}>{formatDate(date)}</h3>
                        <div className={`py-8 text-center ${headerClass}`}>
                          No available time slots for this day
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={date} className="space-y-2">
                      <h3 className={`text-lg font-medium ${headerClass}`}>{formatDate(date)}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {slotsForDay.map(slot => {
                          const appointment = getAppointmentForSlot(slot);
                          return (
                            <div
                              key={slot.id}
                              className={`p-3 rounded-lg border transition-colors ${slotClass} ${
                                slot.isBooked 
                                  ? `${bookedSlotClass} border` 
                                  : `${freeSlotClass} border-transparent`
                              }`}
                            >
                              <div className="font-medium">{formatTime(slot.time)}</div>
                              {slot.isBooked && appointment && (
                                <div className="text-xs truncate">
                                  {appointment.customerName}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Appointments Column */}
          <div className={`p-6 rounded-lg border ${cardClass} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${headerClass}`}>
              <UserIcon className="w-5 h-5 inline-block mr-2" />
              Appointments
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className={`w-10 h-10 border-t-4 border-primary-500 border-solid rounded-full animate-spin`}></div>
              </div>
            ) : appointments.filter(appt => getDateRange().includes(appt.date)).length > 0 ? (
              <div className="space-y-4">
                {appointments
                  .filter(appt => getDateRange().includes(appt.date))
                  .sort((a, b) => {
                    // Sort by date and then by time
                    const dateComparison = a.date.localeCompare(b.date);
                    if (dateComparison !== 0) return dateComparison;
                    return a.time.localeCompare(b.time);
                  })
                  .map(appointment => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700/60 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">
                          {appointment.customerName}
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                        </div>
                        {appointment.details && (
                          <div className="mt-2 text-xs p-2 rounded bg-gray-100 dark:bg-gray-800">
                            {appointment.details}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${headerClass}`}>
                <CalendarDaysIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No appointments for the selected period</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Schedule; 