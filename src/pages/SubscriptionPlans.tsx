import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { CheckIcon, SparklesIcon, StarIcon, BuildingOfficeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from '../components/ConfirmationModal';

const SubscriptionPlans = () => {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Calendly URL for custom plan inquiries
  const CALENDLY_URL = "https://calendly.com/malisiddiq0";
  
  // For background and text colors based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const hoverBgClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const textMutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  // Plan data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$25',
      period: 'per month',
      description: 'Perfect for individuals or small businesses just getting started with voice assistants.',
      features: [
        '1 voice assistant',
        'Standard voice quality',
        'Business hours support',
        'Basic analytics',
        'Up to 50 appointments per month'
      ],
      icon: <StarIcon className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-400',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$50',
      period: 'per month',
      description: 'Ideal for growing businesses that need multiple assistants with enhanced features.',
      features: [
        '3 voice assistants',
        'Premium voice quality',
        'Priority support',
        'Advanced analytics & reporting',
        'Up to 200 appointments per month',
        'Custom voice training'
      ],
      icon: <SparklesIcon className="w-6 h-6" />,
      color: 'from-purple-400 to-pink-400',
      popular: true
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Custom',
      period: 'pricing',
      description: 'Tailored solutions for large businesses and enterprises with specific requirements.',
      features: [
        'Unlimited voice assistants',
        'Enterprise-grade voice quality',
        '24/7 dedicated support',
        'Full API access',
        'Unlimited appointments',
        'White-label options',
        'Custom integrations'
      ],
      icon: <BuildingOfficeIcon className="w-6 h-6" />,
      color: 'from-amber-400 to-orange-400',
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === 'custom') {
      // For custom plan, open Calendly link
      window.open(CALENDLY_URL, '_blank');
    } else {
      // For Basic and Pro plans, show confirmation
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300 max-w-2xl mx-auto' : 'text-gray-600 max-w-2xl mx-auto'}>
            Find the perfect plan for your business needs. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative rounded-2xl ${bgClass} border p-6 shadow-lg flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} text-white`}>
                  {plan.icon}
                </div>
                <h3 className={`text-xl font-bold ${textClass}`}>{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className={`text-3xl font-extrabold ${textClass}`}>{plan.price}</span>
                  <span className={`ml-2 ${textMutedClass}`}>{plan.period}</span>
                </div>
                <p className={`mt-2 ${textMutedClass}`}>{plan.description}</p>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className={`ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlanSelect(plan.id)}
                className={`mt-auto w-full px-4 py-3 rounded-lg font-semibold 
                  ${plan.id === 'custom' 
                    ? `border ${borderClass} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} ${hoverBgClass}` 
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90'}`}
              >
                {plan.id === 'custom' ? 'Schedule Consultation' : 'Subscribe Now'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className={`mt-16 rounded-2xl ${bgClass} border p-8 shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-4 border ${borderClass} rounded-lg`}>
              <h3 className={`font-semibold mb-2 ${textClass}`}>Can I switch plans later?</h3>
              <p className={textMutedClass}>Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account dashboard.</p>
            </div>
            
            <div className={`p-4 border ${borderClass} rounded-lg`}>
              <h3 className={`font-semibold mb-2 ${textClass}`}>How do I add more assistants?</h3>
              <p className={textMutedClass}>You can upgrade to a higher tier plan or contact our sales team for a custom solution tailored to your needs.</p>
            </div>
            
            <div className={`p-4 border ${borderClass} rounded-lg`}>
              <h3 className={`font-semibold mb-2 ${textClass}`}>What payment methods do you accept?</h3>
              <p className={textMutedClass}>We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            
            <div className={`p-4 border ${borderClass} rounded-lg`}>
              <h3 className={`font-semibold mb-2 ${textClass}`}>Is there a setup fee?</h3>
              <p className={textMutedClass}>No, there are no setup fees. You only pay the monthly subscription price for your selected plan.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold mb-8 text-center ${textClass}`}>What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "VocalHost has transformed how we handle appointments. Our clients love the natural voice experience.",
                author: "Sarah Johnson",
                company: "Wellness Clinic"
              },
              {
                quote: "The Pro plan gives us everything we need for our three locations. Setup was incredibly simple.",
                author: "Michael Chen",
                company: "Urban Salon Group"
              },
              {
                quote: "The custom solution provided by VocalHost has helped us scale our appointment system nationally.",
                author: "Rebecca Williams",
                company: "National Health Services"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`p-6 rounded-xl ${bgClass} border shadow-lg`}
              >
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className={`font-semibold ${textClass}`}>{testimonial.author}</p>
                  <p className={textMutedClass}>{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`p-8 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border ${borderClass}`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>Ready to elevate your business?</h2>
            <p className={`mb-6 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Get started today and experience the power of VocalHost's AI voice assistants for your business.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlanSelect('pro')}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          // This would normally integrate with payment processing
          setShowConfirmModal(false);
          alert('Subscription successful! Redirecting to dashboard...');
          // Redirect logic would go here
        }}
        title="Confirm Subscription"
        message={`You're about to subscribe to the ${selectedPlan === 'basic' ? 'Basic' : 'Pro'} plan. Your card will be charged ${selectedPlan === 'basic' ? '$25' : '$50'} monthly. You can cancel anytime.`}
        confirmButtonText="Confirm Subscription"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default SubscriptionPlans; 