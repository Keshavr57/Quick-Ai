import React from "react";
import { useNavigate } from "react-router-dom";
import aivoraIcon from "../assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-14 w-full mt-24 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 border-t border-orange-200">
      {/* Animated gradient glow background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-[250px] h-[250px] bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-60px] right-[-40px] w-[300px] h-[300px] bg-amber-300/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main footer content */}
      <div className="relative flex flex-col md:flex-row justify-between gap-10 border-b border-orange-200 pb-10 z-10">
        {/* Logo + About */}
        <div className="md:max-w-sm">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={aivoraIcon}
              alt="Aivora AI Icon"
              className="w-20 h-20 sm:w-20 sm:h-20 object-contain transition-transform group-hover:scale-110 duration-300"
            />
            <h1 className="text-2xl font-extrabold text-gray-900">
              Aivora <span className="text-orange-600">AI</span>
            </h1>
          </div>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Experience the future of content creation with{" "}
            <span className="text-orange-600 font-semibold">Aivora AI</span>. Our
            premium AI tools help you write, design, and create effortlessly.
          </p>
        </div>

        {/* Company + Newsletter */}
        <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-16">
          <div>
            <h2 className="font-semibold mb-5 text-orange-600 text-lg">
              Company
            </h2>
            <ul className="text-sm space-y-2">
              {["Home", "About us", "Contact us", "Privacy policy"].map(
                (link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5 text-orange-600 text-lg">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm mb-3 text-gray-600">
              Get the latest <span className="text-orange-600 font-semibold">AI news</span>,
              tips & updates directly to your inbox.
            </p>
            <div className="flex items-center gap-2 pt-3">
              <input
                className="border border-orange-300 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none w-full max-w-64 h-10 rounded-lg px-3 text-gray-800"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 w-28 h-10 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-6 text-center text-xs md:text-sm pb-5 text-gray-600 z-10 relative">
        © 2025 <span className="text-orange-600 font-semibold">Aivora AI</span>. All rights reserved.
      </p>

      {/* Floating particles */}
      <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-orange-500 rounded-full animate-ping opacity-40" />
      <div className="absolute top-10 right-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-500 opacity-50" />
    </footer>
  );
};

export default Footer;
