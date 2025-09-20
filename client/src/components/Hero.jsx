import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-10 lg:px-20 pt-32 pb-16 min-h-screen bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat flex flex-col justify-center items-center text-center relative">
      {/* Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight max-w-4xl">
        Create amazing content <br /> with{" "}
        <span className="text-primary">AI tools</span>
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-xl">
        Transform your content creation with our suite of premium AI tools.
        Write articles, generate images, and enhance your workflow effortlessly.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={() => navigate("/ai")}
          className="bg-primary text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all font-medium"
        >
          Start creating now
        </button>
        <button className="bg-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all font-medium">
          Watch demo
        </button>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3 mt-10 text-gray-600 text-sm sm:text-base">
        <img src={assets.user_group} alt="users" className="h-8" />
        <span className="font-medium">Trusted by 10k+ people</span>
      </div>
    </section>
  );
};

export default Hero;
