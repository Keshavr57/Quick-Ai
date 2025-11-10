import { Scissors, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PremiumGate from '../components/PremiumGate';

const RemoveObject = () => {
  const { user, token } = useAuth();

  if (user?.plan !== 'premium') {
    return <PremiumGate feature="Remove Object" />;
  }

  const [input, setInput] = useState('')
  const [object, setObject] = useState('')

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aivora-object-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };
      
    const onSubmitHandler = async (e)=>{
          e.preventDefault();
          try {
            setLoading(true)

            if(object.split(' ').length > 1){
              return toast('Please enter only one object name')
            }

              const formData = new FormData()
              formData.append('image', input)
              formData.append('object', object)

              const { data } = await axios.post('/api/ai/remove-image-object',formData, {headers: {Authorization: `Bearer ${token}`}})

            if (data.success) {
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
    <div className='h-full overflow-y-scroll p-6 text-slate-700'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* left col */}
        <form onSubmit={onSubmitHandler} className='bg-white rounded-xl border border-gray-200 p-6 shadow-md h-fit'>

          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#4A7AFF]'/>
            <h1 className='text-xl font-semibold'>Object Removal</h1>
          </div>

          <p className='mt-6 text-sm font-medium'>Upload image</p>

          <input onChange={(e)=>setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' required/>

          <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>

          <textarea onChange={(e)=>setObject(e.target.value)} value={object} rows={4} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon , Only single object name' required/>
          
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:from-[#306CE5] hover:to-[#7D26DA] transition-all shadow-md hover:shadow-lg'>
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Scissors className='w-5'/>
            }
            
            Remove object
          </button>
        </form>
        
        {/* Right col */}
        <div className='bg-white rounded-xl border border-gray-200 p-6 shadow-md flex flex-col min-h-[600px]'>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Scissors className='w-5 h-5 text-[#4A7AFF]' />
                <h1 className='text-xl font-semibold'>Processed Image</h1>
              </div>
              {content && (
                <button
                  onClick={handleDownload}
                  className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg'
                >
                  <Download className='w-4 h-4' />
                  <span className='text-sm font-medium'>Download</span>
                </button>
              )}
            </div>

            {
              loading ? (
                <div className='flex-1 flex justify-center items-center'>
                  <div className='text-sm flex flex-col items-center gap-5 text-blue-500'>
                    <div className='w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin'></div>
                    <p className='text-gray-600 font-medium'>Removing object...</p>
                  </div>
                </div>
              ) : !content ? 
              (
              <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9' />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
            )
              :
              (
                <div className='mt-3 flex-1 flex items-center justify-center'>
                  <img src={content} alt="image" className='max-w-full max-h-full object-contain rounded-lg shadow-lg'/>
                </div>
              )
            }
        </div>
      </div>
    </div>
  )
}

export default RemoveObject
