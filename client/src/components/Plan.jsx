import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Check, Loader } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Base URL is already set in axios.js, no need to set it again here

const Plan = () => {
  const { user, token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(null);

  const handlePlanChange = async (planName) => {
    try {
      setLoading(planName.toLowerCase());
      
      const response = await axios.post('/api/user/update-plan', 
        { plan: planName.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Successfully switched to ${planName} plan!`);
        // Refresh user data without logging out
        await refreshUser();
      } else {
        toast.error(response.data.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Plan update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update plan');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Write Articles',
        'Generate Blog Titles',
        'Community access',
        'Standard support'
      ]
    },
    {
      name: 'Premium',
      price: '$19',
      features: [
        'Everything in Free',
        'Generate AI Images',
        'Remove Background',
        'Remove Objects',
        'Resume Review',
        'Priority support'
      ],
      popular: true
    }
  ];

  return (
    <div className='max-w-4xl mx-auto z-20 my-20 px-4'>
      <div className='text-center mb-12'>
        <h2 className='text-slate-700 text-4xl md:text-5xl font-semibold mb-4'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-2xl p-8 border-2 ${
              plan.popular ? 'border-orange-500 shadow-xl' : 'border-gray-200'
            } transition-all hover:shadow-lg`}
          >
            {plan.popular && (
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold'>
                Most Popular
              </div>
            )}
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>{plan.name}</h3>
            <div className='mb-6'>
              <span className='text-4xl font-bold text-gray-900'>{plan.price}</span>
              <span className='text-gray-500'>/month</span>
            </div>
            <ul className='space-y-3 mb-8'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-500' />
                  <span className='text-gray-600'>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanChange(plan.name)}
              disabled={loading === plan.name.toLowerCase() || user?.plan === plan.name.toLowerCase()}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                user?.plan === plan.name.toLowerCase()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 disabled:opacity-50'
              }`}
            >
              {loading === plan.name.toLowerCase() ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : user?.plan === plan.name.toLowerCase() ? (
                'Current Plan'
              ) : (
                `Switch to ${plan.name}`
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Plan
