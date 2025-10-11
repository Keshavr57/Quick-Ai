import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* ✅ Two-column layout for large screens */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* Left: Input Form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex-1 bg-white border border-orange-200 shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Article Generator</h1>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Topic
            </label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="e.g. The future of AI in education..."
              className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all"
              required
            />
          </div>

          {/* Length Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Length
            </label>
            <div className="flex gap-3 flex-wrap">
              {articleLength.map((item, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedLength(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLength.text === item.text
                      ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <Edit className="w-5 h-5" />
            )}
            {loading ? "Generating..." : "Generate Article"}
          </button>
        </form>

        {/* Right: Output */}
        <div className="flex-1 bg-white border border-orange-200 shadow-md rounded-2xl p-6 min-h-[600px] flex flex-col transition-all hover:shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Generated Article</h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center text-gray-400 text-center">
              <p>Enter a topic and click “Generate Article” to see your result here.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto mt-3">
              <div className="prose max-w-none prose-orange">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
