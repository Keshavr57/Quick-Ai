import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>

                <div className="prose prose-orange max-w-none text-gray-700 space-y-6">
                    <section>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-3 text-[14px]">This Privacy Policy describes how Aivora AI ("we," "us," or "our") collects, uses, and shares your personal information.</h1>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as your name, email address, and payment information when you subscribe to our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
                        <p>We use the information to provide, maintain, and improve our services, process payments, and communicate with you about updates or support.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Data Sharing</h2>
                        <p>We do not sell your personal information. We share data with service providers (like Razorpay for payments) only as necessary to provide our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access or disclosure.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Cookies</h2>
                        <p>We use cookies to enhance your experience and analyze how our service is used.</p>
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

export default PrivacyPolicy;
