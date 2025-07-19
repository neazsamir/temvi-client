import { PostCard } from './PostCard'
import { Loader } from './Loader'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useAppContext } from '../store/AppContext'
import axios from '../lib/axios.js'
import { useInfiniteQuery } from '@tanstack/react-query'
import { EditPost } from './EditPost'


export const UserPosts = ({ username }) => {
	const { user:me } = useAppContext()
	const [editingPost, setEditingPost] = useState(null)
	
	const fetchUserPosts = async ({ pageParam = 1}) => {
		try {
			const { data } = await axios.get(`/post/userPosts?username=${username}&page=${pageParam}`)
			
			return data
		} catch (e) {
			
			toast.error(e?.response?.data?.msg || "Something went wrong")
			throw e
		}
	}
	
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['userPosts'],
		queryFn: fetchUserPosts,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		getNextPageParam: (lastPage) => {
			if (lastPage?.page < lastPage?.totalPages) return lastPage?.page + 1
			return undefined
		}
	})
	
	
	const posts = data?.pages?.flatMap(page => page?.posts || []) || []
	
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
		})
		
		const el = document.getElementById('load-more-trigger')
		
		if (el) observer.observe(el)
		
		return () => el && observer.unobserve(el)
	}, [hasNextPage, isFetchingNextPage])
	
	return (
	 <div>
	  <div className="bg-white py-3 px-4 md:mb-4 md:rounded-xl md:shadow-even-0">
	  	<p className="font-bold text-xl">Posts</p>
	  	{
	  		posts.length <= 0 && <p className="w-full text-xl text-dark text-center font-bold">No post available</p>
	  	}
	  </div>
	  <ul className="flex flex-col md:gap-4">
	  	{
	  		isLoading ? (
	  		 <div className="w-full flex justify-center">
	  			<Loader />
	  		 </div>
	  		) : posts.length > 0 ? (
	  			<>
	  				{
	  					posts.map(post => <PostCard setEditingPost={setEditingPost}
	  						key={post?._id}
	  						post={post}
	  						me={{ 
	  							avatar: me?.avatar,
	  							username: me?.username
	  						}}
	  						/>
	  					)
	  				}
	  				<div id="load-more-trigger" className="h-10 bg-white md:bg-transparent" />
	  				{
	  					isFetchingNextPage && (
	  						<div className="w-full flex justify-center mt-2">
	  								<Loader />
	  						</div>
	  					)
	  				}
	  			</>
	  		) : null
	  	}
	  </ul>
	  { editingPost && <EditPost editingPost={editingPost} setEditingPost={setEditingPost} /> }
	 </div>
	)
}