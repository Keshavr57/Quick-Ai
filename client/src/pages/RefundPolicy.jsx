import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Refund and Cancellation Policy</h1>

                <div className="prose prose-orange max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Service Nature</h2>
                        <p>Aivora AI provides digital services. Once an AI generation or review process is initiated and completed, the service is considered "consumed."</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Subscription Cancellation</h2>
                        <p>You can cancel your Premium subscription at any time through your account settings. Your access will continue until the end of the current billing period.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Refund Eligibility</h2>
                        <p>As our resources are digital and consumed instantly upon use, we generally do not offer refunds. However, if you experience technical issues where the service was not delivered despite payment, please contact us within 24 hours of the transaction.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Processing Refunds</h2>
                        <p>Approved refunds will be processed via Razorpay to your original payment method within 5-7 business days.</p>
                    </section>

                    <section className="mt-10 pt-6 border-t">
                        <p className="text-sm text-gray-500">Last updated: December 28, 2025</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RefundPolicy;
