import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusIcon, MicrophoneIcon, CogIcon, TrashIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Mock data - replace with actual data from your backend
const mockAssistants = [
  {
    id: 1,
    name: 'Alex',
    businessDescription: 'Dental clinic specializing in cosmetic procedures',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    voiceType: 'female',
    status: 'active',
  },
  {
    id: 2,
    name: 'Max',
    businessDescription: 'Hair salon offering premium styling services',
    startTime: '10:00',
    endTime: '18:00',
    slotDuration: 45,
    voiceType: 'male',
    status: 'inactive',
  },
  {
    id: 3,
    name: 'Samantha',
    businessDescription: 'Counseling practice for family therapy',
    startTime: '12:00',
    endTime: '20:00',
    slotDuration: 60,
    voiceType: 'female',
    status: 'active',
  },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAssistants.map((assistant) => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const AssistantCard = ({ assistant }: { assistant: typeof mockAssistants[0] }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 space-y-4"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">{assistant.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{assistant.businessDescription}</p>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          assistant.status === 'active'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}
      >
        {assistant.status}
      </span>
    </div>

    <div className="space-y-2 pt-2">
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <MicrophoneIcon className="w-4 h-4" />
        <span>{assistant.voiceType} voice</span>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <ClockIcon className="w-4 h-4" />
        <span>Hours: {assistant.startTime} - {assistant.endTime}</span>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <CalendarIcon className="w-4 h-4" />
        <span>Slot duration: {assistant.slotDuration} min</span>
      </div>
    </div>
    
    <div className="mt-2 pt-4 border-t border-gray-700">
      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <CogIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default Dashboard; 