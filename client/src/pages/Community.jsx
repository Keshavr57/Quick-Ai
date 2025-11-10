import { useAuth } from '../context/AuthContext'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart, Users, Sparkles, ImageIcon } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)

  const fetchCreations = async ()=>{
    try {
      const {data} = await axios.get('/api/user/get-published-creations', {
        headers : {Authorization: `Bearer ${token}`}
      })
      if (data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id)=>{
    try {
      const {data} = await axios.post('/api/user/toggle-like-creation', {id}, {
        headers : {Authorization: `Bearer ${token}`}
      })

      if (data.success){
        toast.success(data.message)
        await fetchCreations()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(user){
      fetchCreations()
    }
  },[user])

  return !loading ? (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
            <Users className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800'>Community Gallery</h1>
        </div>
        <p className='text-gray-600 ml-13'>Explore amazing AI-generated creations from our community</p>
      </div>

      {/* Creations Grid */}
      {creations.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {creations.map((creation, index)=> (
            <div key={index} className='relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200'>
              <div className='aspect-square overflow-hidden'>
                <img 
                  src={creation.content} 
                  alt={creation.prompt || 'AI Creation'} 
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>

              {/* Overlay on hover */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                <p className='text-white text-sm mb-3 line-clamp-2'>{creation.prompt || 'AI Generated Image'}</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Sparkles className='w-4 h-4 text-yellow-400' />
                    <span className='text-white text-xs'>AI Generated</span>
                  </div>
                  <button
                    onClick={() => imageLikeToggle(creation.id)}
                    className='flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all'
                  >
                    <Heart 
                      className={`w-4 h-4 transition-all ${
                        creation.likes.includes(user.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-white'
                      }`}
                    />
                    <span className='text-white text-sm font-medium'>{creation.likes.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-96 bg-white rounded-xl border-2 border-dashed border-gray-300'>
          <ImageIcon className='w-16 h-16 text-gray-400 mb-4' />
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Community Creations Yet</h3>
          <p className='text-gray-500 text-center max-w-md'>
            Be the first to share your AI creations with the community! Generate images and mark them as public to appear here.
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <div className='text-center'>
        <div className='w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading community creations...</p>
      </div>
    </div>
  )
}

export default Community
