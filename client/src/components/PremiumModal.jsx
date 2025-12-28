import React, { useState } from 'react';
import { X, Crown, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const PremiumModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { token, refreshUser } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    if (!isOpen) return null;

    const handlePayment = async () => {
        if (!token) {
            toast.error('Session expired. Please login again.');
            onClose();
            return;
        }
        setLoading(true);
        try {
            // 1. Create Order
            const { data: orderResponse } = await axios.post(
                `${API_URL}/api/payment/create-order`,
                { planId: 'premium_monthly' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!orderResponse.success) {
                throw new Error('Failed to create order');
            }

            const { order } = orderResponse;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Replace with your test key in env
                amount: order.amount,
                currency: order.currency,
                name: "Aivora AI",
                description: "Premium Subscription",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 2. Verify Payment
                        const verifyResponse = await axios.post(
                            `${API_URL}/api/payment/verify-payment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyResponse.data.success) {
                            toast.success('🎉 Welcome to Premium!');
                            await refreshUser();
                            onClose();
                        } else {
                            toast.error('Payment verification failed.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "User Name", // You can get this from AuthContext if needed
                    email: "user@example.com",
                    contact: ""
                },
                theme: {
                    color: "#8B5CF6"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h2>
                    <p className="text-gray-400">Unlock the full power of Aivora AI</p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                    {[
                        "Unlimited AI Image Generation",
                        "Remove Objects from Images",
                        "Professional Resume Reviews",
                        "Priority Processing",
                        "Remove Backgrounds"
                    ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-300">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-500" />
                            </div>
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="mb-8 text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <span className="text-3xl font-bold text-white">₹199</span>
                    <span className="text-gray-500 text-sm ml-2">/ month</span>
                </div>

                {/* Action Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Crown className="w-5 h-5" />
                            Upgrade Now
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                    Secure payment powered by Razorpay
                </p>
            </div>
        </div>
    );
};

export default PremiumModal;
