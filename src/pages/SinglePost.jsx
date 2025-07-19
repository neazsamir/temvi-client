import { PostCard } from '../components/PostCard'
import { Loader } from '../components/Loader'
import { EditPost } from '../components/EditPost'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppContext } from '../store/AppContext'
import axios from '../lib/axios.js'



export const SinglePost = () => {
	const { postId } = useParams()
	const { user:me } = useAppContext()
	const [post, setPost] = useState({})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState('')
	const [editingPost, setEditingPost] = useState({})
	
	
	useEffect(() => {
		const getPost = async () => {
			setLoading(true)
			try {
				const { data } = await axios.get(`/post/singlePost/${postId}`)
				if (data?.success) setPost(data.post)
				setError('')
			} catch (e) {
				setError(e.response?.data?.msg || 'Something went wrong')
			} finally { setLoading(false) }
		}
		getPost()
	}, [postId])
	
	return (
	  <div className="w-screen flex items-center justify-center">
	  	 <div className="w-full max-w-xl flex justify-center mt-5">
	  		{
	  			loading ? <Loader /> : post?._id ? <PostCard post={post} me={{ avatar: me?.avatar, username: me?.username }} setEditingPost={setEditingPost} /> : <p className="font-bold text-dark md:text-xl lg:text-2xl">{ error }</p>
	  		}
	  	 </div>
	  	 {
	  	 	me?.username === post?.creator?.username && editingPost?.text && (
	  				<EditPost
	  	 			editingPost={editingPost}
	  	 			setEditingPost={setEditingPost}
	  	 			/>
	  	 			)
	  	 }
	  </div>
	)
}