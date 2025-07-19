import { FaXmark } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { Loader } from './Loader'
import { CommentCard } from './CommentCard'
import { PostCard } from './PostCard'
import axios from '../lib/axios.js'
import { useInfiniteQuery } from '@tanstack/react-query'

export const Comments = ({ open, setOpen, postId, username, me, post }) => {
	const [error, setError] = useState('')

	const fetchComments = async ({ pageParam = 1 }) => {
		try {
			const { data } = await axios.get(`/post/comment?postId=${postId}&page=${pageParam}`)
			return data
		} catch (e) {
			setError(e?.response?.data?.msg || 'Something went wrong')
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
		queryKey: ['comments', postId],
		queryFn: fetchComments,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		getNextPageParam: (lastPage) => {
			if (lastPage?.page < lastPage?.totalPages) return lastPage?.page + 1
			return undefined
		}
	})

	const comments = data?.pages?.flatMap(page => page?.comments || []) || []

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		})
		const el = document.getElementById('load-more-trigger')
		if (el) observer.observe(el)
		return () => el && observer.unobserve(el)
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	return (
		<div>
			<div onClick={() => setOpen(false)} className="fixed left-0 top-0 right-0 bottom-0 bg-black opacity-60 z-[60]" />
			<div className="w-full max-w-md fixed left-1/2 md:top-1/2 bottom-0 md:bottom-0 -translate-x-1/2 md:-translate-y-1/2 bg-white p-4 rounded-t-lg md:rounded-b-lg shadow-even z-[61] max-h-[80vh] h-fit overflow-x-hidden">
				<div className="flex items-center font-bold border-b border-solid border-dark2 pb-3">
					<p className="w-fit mx-auto font-bold md:text-xl">
						{username?.toUpperCase()}'s post
					</p>
					<FaXmark onClick={() => setOpen(false)} className="hover:text-red-500 text-2xl cursor-pointer" />
				</div>
				<div>
					<PostCard post={post} me={me} isCmmnt={true} />
				</div>
				<div className="w-full max-w-md h-full mt-4 px-2 flex flex-col gap-4">
					{isLoading ? (
						<div className="w-full flex justify-center"><Loader /></div>
					) : comments.length > 0 ? (
						<>
							{comments.map((c) => (
								<CommentCard key={c._id} comment={c} />
							))}
							<div id="load-more-trigger" className="h-2" />
							{isFetchingNextPage && <Loader />}
						</>
					) : (
						<p className="text-center text-sm text-gray-500 py-4">
							{error || 'No comments yet.'}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}