import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumGate = ({ children, feature }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPremium = user?.plan === 'premium';

  if (isPremium) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-orange-200">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Premium Feature
        </h2>
        
        <p className="text-gray-600 mb-6">
          <strong>{feature}</strong> is only available for Premium users. Upgrade your plan to unlock this feature and many more!
        </p>

        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-900">Premium Benefits</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✨ Unlimited AI generations</li>
            <li>🎨 Advanced image tools</li>
            <li>📄 Resume review</li>
            <li>⚡ Priority support</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/ai')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              navigate('/');
              // Scroll to pricing section after navigation
              setTimeout(() => {
                const pricingSection = document.querySelector('#pricing');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;