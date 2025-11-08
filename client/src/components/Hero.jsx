import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const messages = [
    "Turn ideas into AI-powered content.",
    "Write articles in seconds.",
    "Generate stunning images instantly.",
    "Boost your productivity with AI."
  ];

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Typing effect
  useEffect(() => {
    if (messageIndex >= messages.length) return;

    if (charIndex < messages[messageIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentMessage((prev) => prev + messages[messageIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentMessage("");
        setCharIndex(0);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, messageIndex]);

  const handleStartCreating = () => {
    if (user) {
      navigate("/ai");
    } else {
      navigate("/login");
    }
  };

  const handleViewFeatures = () => {
    const aiToolsSection = document.getElementById('ai-tools');
    if (aiToolsSection) {
      aiToolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 pt-28 pb-20 min-h-screen bg-gradient-to-br from-white via-orange-50 to-amber-50 overflow-hidden">

      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30"></div>

      {/* Left text content */}
      <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">

        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-6">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-orange-700">AI Powered Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Create <span className="text-orange-500">AI-powered</span> content
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl mb-8 h-14 flex items-center justify-center lg:justify-start">
          <span className="min-h-[1.75rem]">
            {currentMessage}
            <span className="animate-pulse text-orange-500">|</span>
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
          <button
            onClick={handleStartCreating}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all transform hover:scale-105 active:scale-95"
          >
            Start creating now
          </button>
          <button 
            onClick={handleViewFeatures}
            className="border-2 border-orange-400 text-orange-600 px-8 py-3.5 rounded-full font-semibold hover:bg-orange-50 hover:border-orange-500 hover:scale-105 active:scale-95 transition-all"
          >
            View Features
          </button>
        </div>

        {/* Features cards */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {[
            { title: "+10K", subtitle: "Creators trust us", icon: "👥" },
            { title: "24/7", subtitle: "AI support", icon: "🤖" },
            { title: "100%", subtitle: "Original content", icon: "✨" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-5 bg-white rounded-xl shadow-md border border-gray-100 w-36 text-center hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right illustration */}
      <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end">
        <div className="relative w-full max-w-lg">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs text-gray-400 font-medium">AI Dashboard</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-orange-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-orange-100 rounded w-1/2"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl">
                  📝
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-amber-200 rounded w-2/3 mb-2"></div>
                  <div className="h-2 bg-amber-100 rounded w-1/3"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl">
                  🎨
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-yellow-200 rounded w-4/5 mb-2"></div>
                  <div className="h-2 bg-yellow-100 rounded w-2/5"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xl font-bold text-orange-600">2.4K</div>
                <div className="text-xs text-gray-500">Generated</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xl font-bold text-amber-600">98%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-bounce" style={{ animationDuration: '3s' }}>
            ✨
          </div>

          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center text-2xl animate-pulse">
            🚀
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
