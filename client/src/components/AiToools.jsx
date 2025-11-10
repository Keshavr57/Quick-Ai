import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleToolClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      toast.error('Please login first to use AI tools');
      navigate('/login');
    }
  };

  return (
    <div id="ai-tools" className="relative px-6 sm:px-10 lg:px-20 py-20 overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-100">
      {/* Floating circles for fun colorful glow */}
      <div className="absolute top-10 left-10 w-56 h-56 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Header */}
      <div className="relative text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Explore our <span className="text-orange-600">AI Tools</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Bring your imagination to life! Each tool below is powered by cutting-edge AI to make your workflow smarter and faster.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => handleToolClick(tool.path)}
            className="group relative bg-white/90 backdrop-blur-sm border border-orange-100 hover:border-orange-300 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 overflow-hidden"
          >
            {/* Glow background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                filter: "blur(40px)",
                zIndex: 0,
              }}
            ></div>

            {/* Icon */}
            <div
              className="relative z-10 inline-flex p-4 rounded-2xl shadow-md mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            >
              <tool.Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {tool.title}
            </h3>

            {/* Description */}
            <p className="relative z-10 text-gray-600 text-sm leading-relaxed">
              {tool.description}
            </p>

            {/* Button inside each card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToolClick(tool.path);
              }}
              className="relative z-10 mt-5 inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Open Tool
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
