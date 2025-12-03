import React, { useEffect, useState } from 'react'
import { Gem, Home, Sparkles, Search, Filter, SortAsc, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CreationItem from '../components/Creationitem'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  
  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 10 })
  
  const hasPremiumPlan = user?.plan === 'premium';

  const getDashboardData = async ()=>{
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
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
      console.log('📡 API URL:', `/api/user/get-user-creations?${params.toString()}`)

      const { data } = await axios.get(`/api/user/get-user-creations?${params.toString()}`, {
        headers : {Authorization: `Bearer ${token}`}
      })

      if (data.success) {
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

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(data.message)
        getDashboardData() // Refresh the list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(()=>{
    getDashboardData()
  }, [currentPage, searchQuery, filterType, sortBy, sortOrder])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className='mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all text-gray-700 hover:text-orange-600 font-medium'
      >
        <Home className='w-4 h-4' />
        <span>Back to Home</span>
      </button>

      <div className='flex justify-start gap-4 flex-wrap'>
        {/* Total Creations Card  */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
            <div className='text-slate-600'>
              <p className='text-sm'>Total Creations</p>
              <h2 className='text-xl font-semibold'>{creations.length}</h2>
            </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
              <Sparkles className='w-5 text-white' />
            </div>
        </div>

        {/* Active Plan Card  */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
            <div className='text-slate-600'>
              <p className='text-sm'>Active Plan</p>
              <h2 className='text-xl font-semibold'>
                {hasPremiumPlan ? 'Premium' : 'Free'}
              </h2>
            </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
              <Gem className='w-5 text-white' />
            </div>
        </div>

      </div>

      {/* Search, Filter, Sort Controls */}
      <div className='mt-6 bg-white p-4 rounded-xl border border-gray-200'>
        <div className='flex flex-wrap gap-3'>
          {/* Search */}
          <div className='flex-1 min-w-[200px]'>
            <div className='relative flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search creations...'
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
              <option value='resume-review'>Resume Reviews</option>
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

    {
      loading ? 
      (
        <div className='flex justify-center items-center h-3/4'>
          <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
        </div>
      )
      :
      (
        <div className='space-y-3'>
          <p className='mt-6 mb-4'>
            Recent Creations {pagination?.total ? `(${pagination.total} total)` : ''}
          </p>
          {
            creations.length > 0 ? (
              creations.map((item)=> <CreationItem key={item.id} item={item} onDelete={handleDelete}/>)
            ) : (
              <div className='text-center py-12 text-gray-500'>
                No creations found. Try adjusting your filters.
              </div>
            )
          }

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-6 pb-6'>
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
        </div>
      )
    }
    

    </div>
  )
}

export default Dashboard
