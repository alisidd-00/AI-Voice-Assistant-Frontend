import { useState } from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon, SparklesIcon, ClockIcon, BuildingOfficeIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const CreateAssistant = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessDescription: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    voiceType: 'female',
    availableDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for API submission
    const apiData = {
      receptionist_name: formData.name,
      business_name: formData.businessName,
      business_description: formData.businessDescription,
      start_time: formData.startTime,
      end_time: formData.endTime,
      booking_duration_minutes: formData.slotDuration,
      phone_number: "1234567890", // This would come from the user's profile in a real app
      voice_type: formData.voiceType,
      available_days: formData.availableDays
    };
    
    // TODO: Implement API call to create assistant
    console.log('Creating assistant:', apiData);
    
    // Call the backend API
    fetch('/api/assistant/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success - maybe redirect or show success message
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error
    });
  };

  const handleDayToggle = (day: string) => {
    setFormData({
      ...formData,
      availableDays: {
        ...formData.availableDays,
        [day]: !formData.availableDays[day as keyof typeof formData.availableDays],
      },
    });
  };

  // Determine text and background colors based on theme
  const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 text-white focus:ring-primary-500' 
    : 'bg-white border-gray-300 text-gray-700 focus:ring-primary-400';
  const previewBgClass = theme === 'dark'
    ? 'bg-gray-800/50 border-gray-700'
    : 'bg-white/80 border-gray-200';
  const previewTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const sampleSlotBgClass = theme === 'dark'
    ? 'bg-gray-700/50'
    : 'bg-gray-100';
  const scheduleItemClass = theme === 'dark'
    ? 'bg-gray-700/30 text-gray-400'
    : 'bg-gray-200/70 text-gray-600';
  const dayButtonActiveClass = theme === 'dark'
    ? 'bg-primary-600 text-white'
    : 'bg-primary-500 text-white';
  const dayButtonInactiveClass = theme === 'dark'
    ? 'bg-gray-700 text-gray-300'
    : 'bg-gray-200 text-gray-600';

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Create Your Voice Assistant
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Customize your AI assistant's details and availability
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  placeholder="e.g., Alex"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  placeholder="e.g., Acme Services"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Business Description
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  rows={4}
                  placeholder="Describe your business and services..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Available Days
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {Object.entries(formData.availableDays).map(([day, isActive]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`py-1 px-2 text-xs rounded-md transition-colors ${
                        isActive ? dayButtonActiveClass : dayButtonInactiveClass
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Slot Duration (minutes)
                </label>
                <select
                  value={formData.slotDuration}
                  onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  required
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Voice Type
                </label>
                <select
                  value={formData.voiceType}
                  onChange={(e) => setFormData({ ...formData, voiceType: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className={`backdrop-blur-sm border rounded-xl p-6 ${previewBgClass}`}>
              <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Assistant Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MicrophoneIcon className="w-6 h-6 text-primary-400" />
                  <span className={previewTextClass}>Voice Assistant: {formData.name || 'Unnamed'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-6 h-6 text-secondary-400" />
                  <span className={previewTextClass}>Business: {formData.businessName || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="w-6 h-6 text-primary-400" />
                  <span className={previewTextClass}>
                    Available: {Object.entries(formData.availableDays)
                      .filter(([_, isActive]) => isActive)
                      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1, 3))
                      .join(', ')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-6 h-6 text-primary-400" />
                  <span className={previewTextClass}>Hours: {formData.startTime} - {formData.endTime}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-6 h-6 text-secondary-400" />
                  <span className={previewTextClass}>Slot Duration: {formData.slotDuration} minutes</span>
                </div>
              </div>
              
              <div className={`mt-6 p-4 rounded-lg ${sampleSlotBgClass}`}>
                <h4 className={`text-sm font-medium mb-2 ${previewTextClass}`}>Sample Schedule</h4>
                <div className="text-xs space-y-1">
                  {generateSampleSlots(formData.startTime, formData.endTime, formData.slotDuration).map((slot, index) => (
                    <div key={index} className={`py-1 px-2 rounded ${scheduleItemClass}`}>
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Create Assistant
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Helper function to generate sample time slots
const generateSampleSlots = (startTime: string, endTime: string, duration: number) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  
  for (let time = start; time < end; time += duration) {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Only show the first 5 slots
    if (slots.length < 5) {
      slots.push(formattedTime);
    }
  }
  
  if (slots.length === 5 && end - start > duration * 5) {
    slots.push('...');
  }
  
  return slots;
};

export default CreateAssistant; 