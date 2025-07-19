import { FaXmark } from 'react-icons/fa6'
import { FiImage } from "react-icons/fi";
import { Loader } from './Loader'
import { useRef, useState } from 'react'
import { useAppContext } from '../store/AppContext'
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'



export const CreatePost = ({ open, setOpen }) => {
	const { user } = useAppContext()
	const [text, setText] = useState('')
	const [loading, setLoading] = useState(false)
	const [images, setImages] = useState([])
	const [visibility, setVisibility] = useState('public')
	const imgRef = useRef(null)
	
	
	const handleFileChange = (e) => {
		if (images.length >= 4) return setImages(p => p.slice(0, 4))
	  const files = Array.from(e.target.files)
	  files.forEach(file => {
	    const reader = new FileReader()
	    reader.readAsDataURL(file)
	    reader.onload = () => {
	      setImages(prev => [...prev, reader.result])
		    }
		 })
	}
	
	const handleTextChange = (e) => {
		const newText = e.target.value
	
		if (newText.trim().length > 400) return setText(newText.slice(0, 400))
		setText(newText)
	}
	
	
	const handlePost = async () => {
		setImages(p => p.slice(0, 4))
		setLoading(true)
		try {
			const { data } = await axios.post('/post/post', { visibility, text, images: images.slice(0, 4)})
			
			if (data?.success) {
				 toast.success(data.msg)
				 setOpen(false)
			}
		} catch (e) {
			toast.error(e.response?.data?.msg || 'Something went wrong')
		} finally { setLoading(false) }
	}
	
	
	
	return (
	  <div>
	  <div onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-black opacity-60" />
	  
	  <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[61]">
	  <div className="pointer-events-auto bg-white max-w-sm w-full p-4">
     <div className="text-xl text-center font-bold pb-2 border-b border-solid border-dark2 mb-3">
  		 New post
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
    	 <input
    	 onChange={handleFileChange}
    	 ref={imgRef}
    	 type="file"
    	 accept="image/**"
    	 className="hidden"
    	 multiple
    	 />
     <button onClick={() => imgRef.current.click()} className="w-full rounded px-3 py-2 bg-dark2 font-bold flex items-center gap-2 justify-center">
    	<FiImage className="text-2xl" />	Album
     </button>
     {
     	loading ? <div className="w-fit mx-auto mt-3"><Loader size={35} dotSize={8} /> </div> : <button onClick={handlePost}
      disabled={images.length < 1 && !text.trim()}
      className="w-full rounded px-3 py-2 bg-primary font-bold text-white disabled:bg-dark mt-2">
				POST
     </button>
     }
	  </div>
	  </div>
	 </div>
	)
}