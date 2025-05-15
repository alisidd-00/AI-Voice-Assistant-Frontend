import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, UserCircleIcon, SunIcon, MoonIcon, PlusCircleIcon, ClockIcon, LightBulbIcon, PuzzlePieceIcon, CreditCardIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { memo } from 'react';

// Memoize the theme toggle button to prevent unnecessary re-renders
const ThemeToggle = memo(({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-2 rounded-full ${theme === 'dark' 
        ? 'text-yellow-400 hover:bg-gray-800' 
        : 'text-gray-600 hover:bg-gray-200'}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
});

// Scroll helper function
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPlansPage = location.pathname === '/plans';

  return (
    <nav className={`backdrop-blur-lg border-b sticky top-0 z-50 ${theme === 'dark' 
      ? 'bg-gray-900/50 border-gray-800' 
      : 'bg-white/50 border-gray-200'}`}>
      {/* Hidden elements to preload theme styles - reduces flicker on toggle */}
      <div className="hidden bg-gray-900/50 border-gray-800 bg-white/50 border-gray-200"></div>
      <div className="hidden text-yellow-400 text-gray-600 text-primary-400 text-primary-600"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <CalendarIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} />
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              VocalHost
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {!loading && !user && (
              <NavLink to="/" label="Home" />
            )}
            
            {!loading && !user && !isLoginPage && !isPlansPage && (
              <>
                <NavButton 
                  onClick={() => scrollToSection('features-section')} 
                  label="Features" 
                  icon={<PuzzlePieceIcon className="w-4 h-4" />}
                />
                <NavButton 
                  onClick={() => scrollToSection('usage-section')} 
                  label="Usage" 
                  icon={<LightBulbIcon className="w-4 h-4" />}
                />
              </>
            )}
            
            {!loading && !user && !isLoginPage && (
              <NavLink 
                to="/plans" 
                label="Pricing" 
                icon={<CreditCardIcon className="w-4 h-4" />}
              />
            )}
            
            {!loading && user && (
              <>
               
                <NavLink 
                  to="/create" 
                  label="Create Assistant" 
                  className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
                  icon={<PlusCircleIcon className="w-4 h-4" />}
                />
                 <NavLink 
                  to="/dashboard" 
                  label="Dashboard" 
                  className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
                  icon={<HomeIcon className="w-4 h-4" />}
                />
                <NavLink 
                  to="/schedule" 
                  label="Schedule" 
                  className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
                  icon={<ClockIcon className="w-4 h-4" />}
                />
                <NavLink 
                  to="/plans" 
                  label="Subscription" 
                  className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
                  icon={<CreditCardIcon className="w-4 h-4" />}
                />
              </>
            )}
            
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            
            {!loading && (
              user ? (
                <div className="flex items-center space-x-2 ml-4">
                  <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <UserCircleIcon className="w-5 h-5" />
                    <span className="text-sm">{user.name || 'User'}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className={`px-4 py-2 transition-colors duration-200 rounded-lg ${theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : !isLoginPage && (
                <NavLink to="/login" label="Get Started" 
                  className="ml-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
                />
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavButton = ({ onClick, label, className = "", icon }: { onClick: () => void; label: string; className?: string; icon?: React.ReactNode }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={onClick}
        className={`px-4 py-2 transition-colors duration-200 rounded-lg ${theme === 'dark'
          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        } ${className} flex items-center space-x-1`}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </button>
    </motion.div>
  );
};

const NavLink = ({ to, label, className = "", icon }: { to: string; label: string; className?: string; icon?: React.ReactNode }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={to}
        className={`px-4 py-2 transition-colors duration-200 rounded-lg ${theme === 'dark'
          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        } ${className} flex items-center space-x-1`}
      >
        {icon && icon}
        <span>{label}</span>
      </Link>
    </motion.div>
  );
};

export default Navbar; 