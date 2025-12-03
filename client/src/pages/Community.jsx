import { useAuth } from '../context/AuthContext'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart, Users, Sparkles, ImageIcon, Search, Filter, SortAsc, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 12 })

  const fetchCreations = async ()=>{
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      })

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (filterType) {
        params.append('type', filterType)
      }

      console.log('🔍 Search Query:', searchQuery)
      console.log('📡 API URL:', `/api/user/get-published-creations?${params.toString()}`)

      const {data} = await axios.get(`/api/user/get-published-creations?${params.toString()}`, {
        headers : {Authorization: `Bearer ${token}`}
      })
      if (data.success){
        console.log('✅ Results:', data.creations.length, 'items')
        setCreations(data.creations)
        setPagination(data.pagination)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

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
  },[user, currentPage, searchQuery, filterType, sortBy, sortOrder])

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
        <p className='text-gray-600 ml-13'>Explore amazing AI-generated creations from our community {pagination?.total ? `(${pagination.total} total)` : ''}</p>
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className='mb-6 bg-white p-4 rounded-xl border border-gray-200'>
        <div className='flex flex-wrap gap-3'>
          {/* Search */}
          <div className='flex-1 min-w-[200px]'>
            <div className='relative flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search community creations...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery(searchInput)
                      setCurrentPage(1)
                    }
                  }}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
              </div>
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium'
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter by Type */}
          <div className='flex items-center gap-2'>
            <Filter className='w-4 h-4 text-gray-600' />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setCurrentPage(1)
              }}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value=''>All Types</option>
              <option value='image'>Images</option>
              <option value='article'>Articles</option>
              <option value='blog-title'>Blog Titles</option>
            </select>
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2'>
            <SortAsc className='w-4 h-4 text-gray-600' />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
                setCurrentPage(1)
              }}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='createdAt-desc'>Newest First</option>
              <option value='createdAt-asc'>Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Creations Grid */}
      {creations.length > 0 ? (
        <>
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

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8'>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className='px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2'
              >
                <ChevronLeft className='w-4 h-4' />
                Previous
              </button>
              
              <div className='flex gap-2'>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === i + 1
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                className='px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2'
              >
                Next
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-96 bg-white rounded-xl border-2 border-dashed border-gray-300'>
          <ImageIcon className='w-16 h-16 text-gray-400 mb-4' />
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Community Creations Found</h3>
          <p className='text-gray-500 text-center max-w-md'>
            {searchQuery || filterType ? 'Try adjusting your search or filters.' : 'Be the first to share your AI creations with the community!'}
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
