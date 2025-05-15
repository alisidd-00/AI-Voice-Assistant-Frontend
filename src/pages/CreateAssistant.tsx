import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon, SparklesIcon, ClockIcon, BuildingOfficeIcon, CalendarDaysIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';
import { useNavigate } from 'react-router-dom';

const CreateAssistant = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [createdAssistant, setCreatedAssistant] = useState<{
    id: number;
    twilioNumber: string;
    message: string;
  } | null>(null);
  
  // Define types for country data
  type CountryKey = 'us' | 'uk' | 'can' | 'aus' | 'ksa' | 'uae' | 'pak';
  type CountryData = {
    code: string;
    name: string;
  };

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessDescription: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    voiceType: 'female',
    country: 'us' as CountryKey, // Default to US
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

  // Supported countries mapping
  const SUPPORTED_COUNTRIES: Record<CountryKey, CountryData> = {
    "us": { code: "US", name: "United States" },
    "uk": { code: "GB", name: "United Kingdom" },
    "can": { code: "CA", name: "Canada" },
    "aus": { code: "AU", name: "Australia" },
    "ksa": { code: "SA", name: "Saudi Arabia" },
    "uae": { code: "AE", name: "United Arab Emirates" },
    "pak": { code: "PK", name: "Pakistan" },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation modal first
    setIsConfirmModalOpen(true);
  };

  const createAssistant = () => {
    // Close the confirmation modal
    setIsConfirmModalOpen(false);
    
    // Show loading state
    setIsLoading(true);
    
    // Create form data for multipart/form-data submission
    const formDataObj = new FormData();
    
    // Add all the text fields
    formDataObj.append('user_id', '1'); // Replace with actual user ID from context/auth
    formDataObj.append('receptionist_name', formData.name);
    formDataObj.append('business_name', formData.businessName);
    formDataObj.append('business_description', formData.businessDescription);
    formDataObj.append('start_time', formData.startTime);
    formDataObj.append('end_time', formData.endTime);
    formDataObj.append('booking_duration_minutes', formData.slotDuration.toString());
    formDataObj.append('phone_number', "1234567890"); // This would come from the user's profile in a real app
    formDataObj.append('voice_type', formData.voiceType);
    formDataObj.append('available_days', JSON.stringify(formData.availableDays));
    formDataObj.append('country', SUPPORTED_COUNTRIES[formData.country].code);
    
    // Add any PDF files
    selectedFiles.forEach(file => {
      formDataObj.append('files', file);
    });
    
    // Call the backend API
    fetch('/api/register', {
      method: 'POST',
      body: formDataObj, // No Content-Type header needed as browser will set it with boundary
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Reset loading state
      setIsLoading(false);
      // Save the assistant details for display or navigation
      setCreatedAssistant({
        id: data.assistant_id,
        twilioNumber: data.twilio_number,
        message: data.message
      });
      // Show success modal
      setIsSuccessModalOpen(true);
    })
    .catch((error) => {
      console.error('Error:', error);
      // Reset loading state
      setIsLoading(false);
      // Show error notification (could be implemented with a toast or error modal)
      alert('Error creating assistant. Please try again.');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Only add PDF files
      const pdfFiles = filesArray.filter(file => 
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      );
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // Navigate to dashboard with the created assistant info
    navigate('/dashboard', { 
      state: { 
        newAssistant: createdAssistant,
        assistantName: formData.name, 
        businessName: formData.businessName
      } 
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
    <div className="max-w-4xl mx-auto py-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Create Your Voice Assistant
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Customize your AI assistant's details and availability
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  placeholder="e.g., Alex"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  placeholder="e.g., Acme Services"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                  Business Description
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  rows={2}
                  placeholder="Describe your business and services..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                  Available Days
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {Object.entries(formData.availableDays).map(([day, isActive]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`py-0.5 px-1.5 text-xs rounded-md transition-colors ${
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
                  <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                    Slot Duration
                  </label>
                  <select
                    value={formData.slotDuration}
                    onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                    required
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                    Country/Region
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value as CountryKey })}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                  >
                    {Object.entries(SUPPORTED_COUNTRIES).map(([key, { name }]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>
                  Voice Type
                </label>
                <select
                  value={formData.voiceType}
                  onChange={(e) => setFormData({ ...formData, voiceType: e.target.value })}
                  className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:border-transparent ${inputClass}`}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              {/* PDF Upload Section */}
              <div className={`border-2 border-dashed ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-2`}>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-sm font-medium ${labelClass}`}>
                    Knowledge Documents (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={`py-0.5 px-2 text-xs flex items-center space-x-1 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <DocumentIcon className="w-3 h-3" />
                    <span>Upload PDF</span>
                  </button>
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  multiple
                  className="hidden"
                />
                
                {/* File list */}
                {selectedFiles.length > 0 && (
                  <div className="mb-1 space-y-1 max-h-14 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className={`flex items-center justify-between p-1 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center space-x-2">
                          <DocumentIcon className="w-4 h-4 text-primary-400" />
                          <span className={`text-xs truncate max-w-[160px] ${previewTextClass}`}>
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className={`backdrop-blur-sm border rounded-xl p-4 ${previewBgClass}`}>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Assistant Preview</h3>
              <div className="space-y-3">
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
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-6 h-6 text-secondary-400" />
                  <span className={previewTextClass}>Region: {SUPPORTED_COUNTRIES[formData.country].name}</span>
                </div>
              </div>
              
              <div className={`mt-4 p-4 rounded-lg ${sampleSlotBgClass}`}>
                <h4 className={`text-sm font-medium mb-2 ${previewTextClass}`}>Sample Schedule</h4>
                <div className="grid grid-cols-5 gap-2">
                  {generateSampleSlots(formData.startTime, formData.endTime, formData.slotDuration).map((slot, index) => (
                    slot === '...' ? 
                    <div key={index} className="flex items-center justify-center">
                      <span className={`text-sm ${previewTextClass}`}>...</span>
                    </div> :
                    <div key={index} className={`py-2 px-3 text-center rounded ${scheduleItemClass} text-sm`}>
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Assistant"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={createAssistant}
        title="Confirm Assistant Creation"
        message={`Please confirm that you want to create the assistant "${formData.name}" for ${formData.businessName}. ${selectedFiles.length > 0 ? `${selectedFiles.length} PDF file(s) will be uploaded for knowledge base.` : 'All details will be sent to our platform for processing.'}`}
        confirmButtonText="Create Assistant"
        cancelButtonText="Edit Details"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Assistant Created Successfully!"
        message={`Your voice assistant "${formData.name}" has been successfully created for ${formData.businessName}.
        ${createdAssistant?.twilioNumber ? `Forward calls to: ${createdAssistant.twilioNumber}` : ''}
        ${selectedFiles.length > 0 ? `${selectedFiles.length} document(s) were uploaded to your assistant's knowledge base.` : ''}`}
        buttonText="Go to Dashboard"
      />
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