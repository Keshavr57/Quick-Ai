import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'}
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/api/ai/generate-article', {prompt, length:selectedLength.length}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative'>
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-violet-600/8 to-purple-700/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-500/6 to-indigo-600/6 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-600/4 to-violet-700/4 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-violet-400 rounded-full animate-ping opacity-20" />
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-700 opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1000 opacity-20" />
      </div>

      <div className='relative z-10 flex items-start flex-wrap gap-6 max-w-7xl mx-auto'>
        
        {/* Left Column - Configuration */}
        <form onSubmit={onSubmitHandler} className='w-full max-w-lg'>
          <div className='group relative p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-all duration-500 shadow-xl'>
            
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/3 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className='relative z-10'>
              {/* Header */}
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg'>
                  <Sparkles className='w-5 h-5 text-white'/>
                </div>
                <h1 className='text-xl font-bold text-slate-100 bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent'>
                  Article Configuration
                </h1>
              </div>

              {/* Topic Input */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-slate-300 mb-3'>
                  Article Topic
                </label>
                <div className='relative'>
                  <input 
                    onChange={(e)=>setInput(e.target.value)} 
                    value={input} 
                    type="text" 
                    className='w-full p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all duration-300 hover:border-slate-500/50' 
                    placeholder='The future of artificial intelligence is...' 
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Length Selection */}
              <div className='mb-8'>
                <label className='block text-sm font-medium text-slate-300 mb-3'>
                  Article Length
                </label>
                <div className='flex gap-3 flex-wrap'>
                  {articleLength.map((item, index)=>(
                    <button
                      type="button"
                      onClick={()=> setSelectedLength(item)} 
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedLength.text === item.text 
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-violet-300 border border-slate-600/50'
                      }`} 
                      key={index}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button 
                disabled={loading} 
                className='w-full relative group bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-violet-400/30 overflow-hidden'
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className='relative z-10 flex justify-center items-center gap-2'>
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  ) : (
                    <Edit className='w-5 h-5'/>
                  )}
                  <span>Generate Article</span>
                </div>
                
                {/* Shine Effect */}
                {!loading && (
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                )}
              </button>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>
        </form>

        {/* Right Column - Generated Content */}
        <div className='w-full max-w-2xl flex-1'>
          <div className='group relative p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-all duration-500 shadow-xl min-h-[600px] max-h-[800px] flex flex-col'>
            
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/3 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className='relative z-10 flex flex-col h-full'>
              {/* Header */}
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg'>
                  <Edit className='w-5 h-5 text-white' />
                </div>
                <h1 className='text-xl font-bold text-slate-100 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>
                  Generated Article
                </h1>
              </div>

              {/* Content Area */}
              {!content ? (
                <div className='flex-1 flex justify-center items-center'>
                  <div className='text-center flex flex-col items-center gap-6 text-slate-400'>
                    <div className='w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center'>
                      <Edit className='w-8 h-8 text-slate-500' />
                    </div>
                    <p className='text-sm max-w-xs'>
                      Enter a topic and click "Generate Article" to get started
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex-1 overflow-y-auto'>
                  <div className='prose prose-invert prose-slate max-w-none'>
                    <div className='text-slate-300 leading-relaxed'>
                      <style jsx>{`
                        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                          background: linear-gradient(to right, #a78bfa, #06b6d4);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                        }
                        .prose p {
                          color: #cbd5e1;
                          margin-bottom: 1rem;
                          line-height: 1.75;
                        }
                        .prose strong {
                          color: #f1f5f9;
                          font-weight: 600;
                        }
                        .prose ul, .prose ol {
                          color: #cbd5e1;
                        }
                        .prose li {
                          margin-bottom: 0.5rem;
                        }
                      `}</style>
                      <Markdown>{content}</Markdown>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corner Accent */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteArticle