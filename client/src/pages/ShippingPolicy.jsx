import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Shipping Policy</h1>

                <div className="prose prose-orange max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Digital Delivery</h2>
                        <p>Aivora AI is an online software platform providing AI-powered tools. Because our products are entirely digital, there is no physical shipping involved.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Delivery Timeline</h2>
                        <p>Access to premium features is granted instantly upon successful payment verification by Razorpay. You will receive a confirmation email, and your account status will be updated immediately.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Service Availability</h2>
                        <p>Our services are available globally via the internet. If you experience any delay in feature activation after payment, please contact our support team.</p>
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

export default ShippingPolicy;
