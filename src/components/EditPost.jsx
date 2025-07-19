import { FaXmark } from 'react-icons/fa6'
import { Loader } from './Loader'
import { useState } from 'react'
import { useAppContext } from '../store/AppContext'
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'



export const EditPost = ({ editingPost, setEditingPost }) => {
	const { user } = useAppContext()
	const [text, setText] = useState(editingPost?.text || '')
	const [loading, setLoading] = useState(false)
	const [images, setImages] = useState(editingPost?.images || [])
	const [visibility, setVisibility] = useState(editingPost?.visibility || 'public')
	
	
	
	const handleTextChange = (e) => {
		const newText = e.target.value
	
		if (newText.trim().length > 400) return setText(newText.slice(0, 400))
		setText(newText)
	}
	
	
	const handleSave = async () => {
		if (!editingPost) return
		setImages(p => p.slice(0, 4))
		setLoading(true)
		try {
			const { data } = await axios.put('/post/post', { visibility, text, images: images.slice(0, 4), postId: editingPost._id })
			
			if (data?.success) {
				 setEditingPost(null)
			}
		} catch (e) {
			toast.error(e.response?.data?.msg || 'Something went wrong')
		} finally { setLoading(null) }
	}
	
	
	
	return (
	 editingPost && <div>
	  <div onClick={() => setEditingPost(false)} className="fixed inset-0 z-[60] bg-black opacity-60" />
	  
	  <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[61]">
	  <div className="pointer-events-auto bg-white max-w-sm w-full p-4">
     <div className="text-xl text-center font-bold pb-2 border-b border-solid border-dark2 mb-3">
  		 Edit post
     </div>
     <div className="flex items-center gap-1">
       <img src={user?.avatar} alt="my avatar" className="rounded-full h-11 w-11" />
      <div>
        <p className="font-bold text-base">{user?.username?.toUpperCase()}</p>
        <select
         onChange={(e) => setVisibility(e.target.value)}
         value={visibility}
         className="bg-dark2 font-semibold rounded w-fit px-3 py-1 outline-none text-center text-[10px] appearance-none">
      	  <option value="public">Public</option>
      	  <option value="followers">Followers</option>
      	  <option value="private">Private</option>
        </select>
      </div>
     </div>
     <textarea onChange={handleTextChange} value={text} rows="5" className="w-full my-3 no-scrollbar outline-none resize-none" placeholder="What's on your mind?" />
  	 <div className={`column-gap-0 gap-1 space-y-1 ${ images?.length === 1 ? 'columns-1' : 'columns-2'}`}>
  			{
  				images.length > 0 && images.map((img, i) => <img
  					 onClick={() => setImages(prev => prev.filter((_, index) => index !== i))}
  					 src={img}
  					 key={i}
  					 alt={i}
  					 />
  				)
  			}
  	 </div>
     {
     	loading ? <div className="w-fit mx-auto mt-3"><Loader size={35} dotSize={8} /> </div> : <button onClick={handleSave}
      disabled={images.length < 1 && !text.trim()}
      className="w-full rounded px-3 py-2 bg-primary font-bold text-white disabled:bg-dark mt-2">
				SAVE
     </button>
     }
	  </div>
	  </div>
	 </div>
	)
}