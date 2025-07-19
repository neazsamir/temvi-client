import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import axios from '../lib/axios.js'
import { PostCard } from './PostCard'
import { Loader } from './Loader'
import { CreatePost } from './CreatePost'




export const Feed = ({ user }) => {
	const [creatingPost, setCreatingPost] = useState(false)
	const LIMIT = 30
	
	const fetchFeed = async ({ pageParam = 1 }) => {  
		const { data } = await axios.get(`/post/feed?page=${pageParam}`)  
		return data  
	}  
	
	const {  
		data,  
		isLoading,  
		isFetchingNextPage,  
		fetchNextPage,
		hasNextPage,  
	} = useInfiniteQuery({  
		queryKey: ['feed'],  
		queryFn: fetchFeed,  
		getNextPageParam: (lastPage, allPages) => {  
			if (lastPage.length < LIMIT) return undefined  
			return allPages.length + 1  
		},  
		refetchOnWindowFocus: false,  
		refetchOnMount: false,  
		refetchOnReconnect: false,  
		staleTime: 5 * 60 * 1000,  
	})  
	
	const posts = data?.pages.flatMap(p => p.posts) || []  
	
	const triggerRef = useRef()  

useEffect(() => {  
	const observer = new IntersectionObserver(([entry]) => {  
		if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {  
			fetchNextPage()  
		}  
	})  

	const el = triggerRef.current  
	if (el) observer.observe(el)  

	return () => el && observer.unobserve(el)  
}, [hasNextPage, isFetchingNextPage, fetchNextPage])  


useEffect(() => {
	if (creatingPost) document.body.style.overflow = "hidden"
	else document.body.style.overflow = "scroll"
}, [creatingPost])

return (  
	<div className="flex flex-col md:gap-5 w-full">  
		<div>
			<div className="bg-white md:rounded-xl p-4 w-full max-h-fit flex items-center gap-3 md:shadow-even-0 grow ">  
			<img src={user?.avatar} alt="profile" className="h-8 w-8 rounded-full object-cover" />  
			<div onClick={() => setCreatingPost(true)} className="rounded-xl px-3 py-1 shadow-inner-dark2 text-dark text-[12px] sm:text-base bg-dark2 w-full hover:bg-dark hover:text-dark2">  
				What's on your mind, {user?.username?.toUpperCase()}?  
			</div>  
		</div>
		</div>
		{  
			isLoading ? (  
				<div className="w-full flex justify-center mt-4">  
					<Loader />  
				</div>  
			) : (  
				<>  
					{ posts?.length > 0 ? posts.map((post, i) => (  
						<div key={post._id}>  
							<PostCard post={post} me={{ username: user?.username, avatar: user?.avatar }} />  
							{i === posts.length - 10 && hasNextPage && (  
								<div ref={triggerRef} className="h-10" />  
							)}
						</div>  
					)) : <p className="font-bold text-dark text-center"> No post available</p>
					}

					{isFetchingNextPage && (  
						<div className="w-full flex justify-center my-4">  
							<Loader />  
						</div>  
					)}  
				</>  
			)  
		}
		{
			creatingPost && <CreatePost open={creatingPost} setOpen={setCreatingPost} />
		}
	</div>
)
}