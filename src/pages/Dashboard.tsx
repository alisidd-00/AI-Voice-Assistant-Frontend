import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon, MicrophoneIcon,  ClockIcon, CalendarIcon, PhoneIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// Flag for development mode - replace process.env reference
const isDevelopment = false; // Set to true for debugging

// Assistant type definition
interface Assistant {
  id: number;
  name: string;
  business_name?: string;
  description?: string;
  start_time: string;
  end_time: string;
  booking_duration_minutes: number;
  available_days: Record<string, boolean>;
  twilio_number: string;
  voice_type: string;
  status?: string; // We'll add this client-side
}

// Define the update payload type
interface AssistantUpdatePayload {
  business_name?: string;
  receptionist_name?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  booking_duration_minutes?: number;
  available_days?: Record<string, boolean>;
  voice_type?: "male" | "female";
}

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for a newly created assistant from navigation state
  useEffect(() => {
    if (location.state?.newAssistant) {
      console.log("New assistant from navigation:", location.state.newAssistant);
      
      const { newAssistant, assistantName, businessName } = location.state;
      
      // Add the new assistant to the list
      const newAssistantData: Assistant = {
        id: newAssistant.id,
        name: assistantName,
        business_name: businessName,
        description: '', // These would come from API in a real implementation
        start_time: '',
        end_time: '',
        booking_duration_minutes: 30,
        available_days: {},
        twilio_number: newAssistant.twilioNumber,
        voice_type: '',
        status: 'active'
      };
      
      setAssistants(prev => {
        // Check if this assistant is already in the list (by ID)
        const exists = prev.some(a => a.id === newAssistant.id);
        if (!exists) {
          console.log("Adding new assistant to state:", newAssistantData);
          return [newAssistantData, ...prev];
        }
        return prev;
      });
    }
  }, [location.state]);

  // Fetch assistants from the backend
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        // Get user ID from auth context or localStorage
        const userId = user?.id || localStorage.getItem('userId') || '1'; // Default for testing
        
        console.log("Fetching assistants for user ID:", userId);
        
        // Create mock data for testing
        const mockData = [
          {
            id: 1,
            name: "Demo Assistant",
            business_name: "Demo Business",
            description: "This is a demo assistant for testing",
            start_time: "09:00",
            end_time: "17:00",
            booking_duration_minutes: 30,
            available_days: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
            twilio_number: "+16073897470",
            voice_type: "female"
          }
        ];
        
        // Try to fetch from API first
        try {
          const response = await fetch(`/api/assistants?user_id=${userId}`);
          console.log("API response status:", response.status);
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("API response data:", data);
          
          // Check if we have assistants in the response
          if (data.assistants && Array.isArray(data.assistants) && data.assistants.length > 0) {
            // Transform the data to match our client-side model
            const transformedAssistants = data.assistants.map((assistant: any) => ({
              ...assistant,
              status: 'active' // Add client-side status
            }));
            
            // Set assistants state from API
            setAssistants(prev => {
              if (prev.length === 0) {
                return transformedAssistants;
              }
              
              // Merge with existing assistants
              const existingIds = prev.map((a: Assistant) => a.id);
              const uniqueAssistants = transformedAssistants.filter((a: any) => !existingIds.includes(a.id));
              return [...prev, ...uniqueAssistants];
            });
          } else {
            // If API returns empty array or wrong format, use mock data for testing
            console.log("API returned no assistants, using mock data");
            if (assistants.length === 0) {
              setAssistants(mockData);
            }
          }
        } catch (apiError) {
          console.error("API fetch error:", apiError);
          // Use mock data if API fails
          if (assistants.length === 0) {
            console.log("Using mock data due to API error");
            setAssistants(mockData);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch assistants:', err);
        setError('Failed to load assistants. Please try again later.');
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [user, assistants.length]);
  
  // Debug output
  console.log("Current assistants state:", assistants);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Your Assistants
          </h1>
          <Link
            to="/create"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create New</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-primary-500 rounded-full animate-spin mr-3"></div>
            <span className="text-gray-400">Loading assistants...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : assistants.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-300 mb-4">You don't have any assistants yet.</p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Assistant</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
              <AssistantCard key={assistant.id} assistant={assistant} />
            ))}
          </div>
        )}
        
        {/* Debug section - only visible when isDevelopment is true */}
        {isDevelopment && (
          <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden text-gray-400 text-xs">
            <details>
              <summary className="cursor-pointer mb-2">Debug Information</summary>
              <pre className="overflow-auto max-h-40">{JSON.stringify({assistants, user, location}, null, 2)}</pre>
            </details>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const AssistantCard = ({ assistant }: { assistant: Assistant }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AssistantUpdatePayload>({});
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setEditData({
      business_name: assistant.business_name,
      receptionist_name: assistant.name,
      description: assistant.description,
      start_time: assistant.start_time,
      end_time: assistant.end_time,
      booking_duration_minutes: assistant.booking_duration_minutes,
      available_days: assistant.available_days,
      voice_type: assistant.voice_type as "male" | "female"
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setUpdateError('');
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      setUpdateError('');

      const response = await fetch(`/api/assistant/${assistant.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update assistant');
      }

      const result = await response.json();
      console.log('Update successful:', result);
      
      // Reset edit mode
      setIsEditing(false);
      setEditData({});
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error('Update failed:', error);
      setUpdateError(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editData.receptionist_name || ''}
              onChange={(e) => setEditData({ ...editData, receptionist_name: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-white text-xl font-semibold"
            />
          ) : (
            <h3 className="text-xl font-semibold text-white">{assistant.name}</h3>
          )}
          {!isEditing && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {assistant.business_name || assistant.description || 'No description'}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <PencilIcon className="w-5 h-5 text-gray-400" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
              >
                <CheckIcon className="w-5 h-5 text-green-400" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-red-400" />
              </button>
            </div>
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              assistant.status === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {assistant.status || 'active'}
          </span>
        </div>
      </div>

      {updateError && (
        <div className="text-red-400 text-sm bg-red-500/20 p-2 rounded">
          {updateError}
        </div>
      )}

      <div className="space-y-2 pt-2">
        {assistant.twilio_number && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <PhoneIcon className="w-4 h-4" />
            <span>{assistant.twilio_number}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <MicrophoneIcon className="w-4 h-4" />
          {isEditing ? (
            <select
              value={editData.voice_type || assistant.voice_type}
              onChange={(e) => setEditData({ ...editData, voice_type: e.target.value as "male" | "female" })}
              className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
            >
              <option value="male">Male voice</option>
              <option value="female">Female voice</option>
            </select>
          ) : (
            <span>{assistant.voice_type || 'default'} voice</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ClockIcon className="w-4 h-4" />
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={editData.start_time || assistant.start_time}
                onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="time"
                value={editData.end_time || assistant.end_time}
                onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
              />
            </div>
          ) : (
            <span>Hours: {assistant.start_time || '9:00'} - {assistant.end_time || '17:00'}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <CalendarIcon className="w-4 h-4" />
          {isEditing ? (
            <input
              type="number"
              value={editData.booking_duration_minutes || assistant.booking_duration_minutes}
              onChange={(e) => setEditData({ ...editData, booking_duration_minutes: parseInt(e.target.value) })}
              className="w-20 bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
              min="1"
            />
          ) : (
            <span>Slot duration: {assistant.booking_duration_minutes || 30} min</span>
          )}
        </div>
      </div>
      
      <div className="mt-2 pt-4 border-t border-gray-700">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="font-semibold text-white">Business Name:</span>
            {isEditing ? (
              <input
                type="text"
                value={editData.business_name || ''}
                onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
              />
            ) : (
              <span>{assistant.business_name || 'N/A'}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="font-semibold text-white">Description:</span>
            {isEditing ? (
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded px-2 py-1"
                rows={2}
              />
            ) : (
              <span>{assistant.description || 'No description available'}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="font-semibold text-white">Available Days:</span>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(editData.available_days || assistant.available_days).map(([day, isAvailable]) => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setEditData({
                        ...editData,
                        available_days: {
                          ...(editData.available_days || assistant.available_days),
                          [day]: e.target.checked
                        }
                      })}
                      className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            ) : (
              <span>
                {Object.keys(assistant.available_days)
                  .filter(day => assistant.available_days[day])
                  .join(', ') || 'Not specified'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 