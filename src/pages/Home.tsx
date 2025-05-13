import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { CalendarIcon, BuildingOfficeIcon, ClockIcon, LightBulbIcon, ChatBubbleBottomCenterTextIcon, PhoneIcon, ArchiveBoxIcon, ArrowTrendingUpIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Replace this URL with your actual Calendly link
const CALENDLY_URL = "https://calendly.com/malisiddiq0";

const Home = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  
  // If user is logged in, redirect to Create Assistant page
  if (!loading && user) {
    return <Navigate to="/create" replace />;
  }
  
  // Function to open Calendly in a new tab
  const openCalendly = () => {
    window.open(CALENDLY_URL, '_blank');
  };
  
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent animate-gradient"
        >
          Create Your Business Voice Assistant
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
        >
          Automate appointment scheduling and customer service with an AI voice assistant
          tailored to your business's specific needs.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <motion.button
            onClick={openCalendly}
            className="px-8 py-4 border border-primary-500 text-white rounded-lg font-semibold hover:bg-primary-500/20 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.6,
              type: "spring",
              stiffness: 200
            }}
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Request Demo
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent inline-block mb-4"
          >
            Features
          </motion.h2>
          <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Our AI Voice Assistant comes with powerful features designed to help your business thrive
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CalendarIcon className="w-8 h-8" />}
            title="Smart Scheduling"
            description="Handle appointments and bookings with customizable time slots"
          />
          <FeatureCard
            icon={<BuildingOfficeIcon className="w-8 h-8" />}
            title="Business Integration"
            description="Tailored to your business type with custom descriptions and hours"
          />
          <FeatureCard
            icon={<ClockIcon className="w-8 h-8" />}
            title="Time Management"
            description="Set your business hours and preferred appointment durations"
          />
          <FeatureCard
            icon={<UserGroupIcon className="w-8 h-8" />}
            title="Customer Management"
            description="Track and manage your customer information and history"
          />
          <FeatureCard
            icon={<ChatBubbleBottomCenterTextIcon className="w-8 h-8" />}
            title="Natural Conversations"
            description="AI-powered natural language understanding for human-like interactions"
          />
          <FeatureCard
            icon={<ArrowTrendingUpIcon className="w-8 h-8" />}
            title="Analytics & Insights"
            description="Track performance and gain insights to improve your business"
          />
        </div>
      </section>
      
      {/* Usage Section */}
      <section id="usage-section" className="py-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent inline-block mb-4"
          >
            How It Works
          </motion.h2>
          <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            See how businesses are using VocalHost to streamline their operations
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <UsageCard
            icon={<PhoneIcon className="w-8 h-8" />}
            title="Medical Practices"
            description="Doctors use VocalHost to handle appointment scheduling, medication refill requests, and basic patient inquiries."
          />
          <UsageCard
            icon={<ArchiveBoxIcon className="w-8 h-8" />}
            title="Law Firms"
            description="Attorneys use VocalHost to schedule consultations, handle client intake, and provide basic legal information."
          />
          <UsageCard
            icon={<LightBulbIcon className="w-8 h-8" />}
            title="Service Businesses"
            description="Salons, cleaning services, and consultants use VocalHost to manage their appointments and client relationships."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`p-6 rounded-xl backdrop-blur-sm border ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/50 border-gray-200'
      }`}
    >
      <div className={`${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'} mb-4`}>{icon}</div>
      <h3 className={`text-xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h3>
      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
};

const UsageCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`p-6 rounded-xl backdrop-blur-sm border ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white/50 border-gray-200'
      }`}
    >
      <div className={`${theme === 'dark' ? 'text-secondary-400' : 'text-secondary-600'} mb-4`}>{icon}</div>
      <h3 className={`text-xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h3>
      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
};

export default Home; 