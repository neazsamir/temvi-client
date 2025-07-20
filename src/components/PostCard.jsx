import { MdPublic } from "react-icons/md";
import { BsFire } from "react-icons/bs";
import { FaComment, FaUsers, FaLock, FaTrash, FaPen } from "react-icons/fa";
import { IoMdShare, IoMdSend } from "react-icons/io";
import { Loader } from './Loader'
import { Comments } from './Comments'
import { postComment } from '../apis/Post'
import { useState, useEffect, useRef } from 'react'
import { formatNumber } from '../utils/formatNumber.js'
import { formatTime } from '../utils/formatTime.js'
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'
import { Link } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'








export const PostCard = ({ post = {}, me, isCmmnt = false, setEditingPost }) => {
	const { setPreviewImg } = useAppContext()
	const [comment, setComment] = useState('')
	const [commenting, setCommenting] = useState(false)
	const [commentsOpen, setCommentsOpen] = useState(false)
	const { createdAt, images, text, visibility, _id, creator } = post
	const { avatar, username } = creator || {}
	const [liked, setLiked] = useState(post?.liked || false)
	const [likes, setLikes] = useState(post?.likes || 0)
	const [comments, setComments] = useState(post?.comments || 0)
	const [isDeleted, setIsDeleted] = useState(false)
	const isMyPost = me?.username === username
	const cardRef = useRef()
	const [hasBeenVisibleFor15s, setHasBeenVisibleFor15s] = useState(false)

	useEffect(() => {
		if (commentsOpen && !isCmmnt) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = 'scroll'
	}, [commentsOpen])

	const handlePostComment = async () => {
		setCommenting(true)
		try {
			const result = await postComment(_id, comment) || false
			if (result) {
				setComment('')
				setComments(p => p + 1)
			}
			await axios.post('/post/viewHistory', { postId: _id })
		} finally {
			setCommenting(false)
		}
	}

	const openComment = () => {
		if (isCmmnt) return
		setCommentsOpen(true)
	}

	const handleLike = async () => {
		if (liked) return

		// Optimistic like
		setLiked(true)
		setLikes(p => p + 1)

		try {
			await axios.post(`/post/like`, { postId: _id })
			await axios.post('/post/viewHistory', { postId: _id })
		} catch (e) {
			// Revert if error
			setLiked(false)
			setLikes(p => p - 1)
			toast.error(e?.response?.data?.msg || 'Something went wrong')
		}
	}

	const handleDelete = async () => {
		if (!isMyPost) return

		// Optimistically hide post
		setIsDeleted(true)

		try {
			await axios.delete(`/post/post`, { data: { postId: _id } })
		} catch (e) {
			// Revert if delete failed
			setIsDeleted(false)
			toast.error(e?.response?.data?.msg || 'Something went wrong')
		}
	}

	useEffect(() => {
		if (!cardRef.current || hasBeenVisibleFor15s) return;

		let timeoutId = null;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
					timeoutId = setTimeout(() => {
						setHasBeenVisibleFor15s(true)
						axios.post('/post/viewHistory', { postId: _id }).catch(() => {})
					}, 15000)
				} else {
					clearTimeout(timeoutId)
				}
			},
			{ threshold: [0.6] }
		)

		observer.observe(cardRef.current)

		return () => {
			clearTimeout(timeoutId)
			if (cardRef.current) observer.unobserve(cardRef.current)
		}
	}, [hasBeenVisibleFor15s, _id])

	const handleShare = () => {
		const data = {
			title: 'Check this out!',
			text: `${username?.toUpperCase()} created new post on temvi 🤩`,
			url: `https://temvi.netlify.app/post/${_id}`
		}
		
		navigator.share(data).catch(() => toast.error("Sharing not supported"))
	}

	return (
		!isDeleted &&
		<div ref={cardRef} className="py-4 border-b-2 border-t-2 border-solid border-dark2 md:border-none w-full bg-white md:rounded-xl md:shadow-even-0">
			<div className="flex items-center justify-between px-4">
				<Link to={`/profile/${username}`} className="flex items-center gap-3">
					<img src={avatar} alt="images" className="h-10 w-10 rounded-full object-cover" />
					<div className="flex flex-col w-full">
						<p className="font-bold">{username?.toUpperCase()}</p>
						<span className="font-semibold text-sm text-dark inline-block w-full flex items-center gap-1">
							{formatTime(createdAt)} • {visibility === 'public' ? <MdPublic /> : visibility === "followers" ? <FaUsers /> : <FaLock />}
						</span>
					</div>
				</Link>
				{isMyPost && (
					<div className="flex items-center gap-2 text-xl">
						<button onClick={() => setEditingPost(post)} className="hover:text-primary"><FaPen /></button>
						<button onClick={handleDelete} className="hover:text-red-500"><FaTrash /></button>
					</div>
				)}
			</div>
			<pre className="mt-4 mb-3 px-4 break-words whitespace-pre-wrap font-sans">{text}</pre>
			<div className={`column-gap-0 gap-1 space-y-1 ${images?.length === 1 ? 'columns-1' : 'columns-2'}`}>
				{images?.map((img, i) => (
					<img onClick={() => setPreviewImg(img)} key={i} src={img} />
				))}
			</div>
			<div className="flex items-center justify-between font-bold px-4 my-3">
				<span className="flex items-center gap-1"><BsFire className="text-amber-400 text-2xl" /> {formatNumber(likes)}</span>
				<span onClick={openComment} className="flex items-center gap-1"> {formatNumber(comments)} Comments</span>
			</div>
			<div className="w-full flex items-center justify-center text-xl py-2 border-b border-t border-solid border-dark2 font-semibold">
				<button onClick={handleLike} className={`py-2 flex items-center justify-center gap-2 hover:text-amber-400 transition duration-300 ease-in w-1/3 ${liked ? 'text-amber-400' : 'text-dark'}`}>
					<BsFire /> <span className="text-base">{liked ? 'Liked' : 'Like'}</span>
				</button>
				{!isCmmnt && (
					<button onClick={openComment} className="py-2 flex items-center justify-center gap-2 text-dark hover:text-primary transition duration-300 ease-in w-1/3">
						<FaComment /> <span className="text-base">Comment</span>
					</button>
				)}
				<button onClick={handleShare} className="py-2 flex items-center justify-center gap-2 text-dark hover:text-primary transition duration-300 ease-in w-1/3">
					<IoMdShare /> <span className="text-base">Share</span>
				</button>
			</div>
			<div className={`w-full pt-4 h-fit flex items-center gap-3 ${!isCmmnt && 'p-4 pb-0'}`}>
				<img src={me?.avatar} alt="profile image" className="h-8 w-8 rounded-full object-cover" />
				<div className="w-full relative flex items-center">
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="rounded-xl outline-primary pl-3 pr-10 py-2 bg-dark2 w-full resize-none h-10"
						placeholder={`Comment as ${me?.username?.toUpperCase()}`}
					/>
					<button disabled={!comment.trim()} onClick={handlePostComment} className="absolute right-2 top-1/2 -translate-y-1/2 group">
						{commenting ? <Loader dotSize={10} size={40} /> : <IoMdSend className="text-3xl group-disabled:text-dark text-primary" />}
					</button>
				</div>
			</div>
			{!isCmmnt && commentsOpen && (
				<Comments
					open={commentsOpen}
					setOpen={setCommentsOpen}
					postId={_id}
					post={post}
					username={username}
					me={me}
				/>
			)}
		</div>
	)
}