import { Container } from './Container'
import { EditProfile } from './EditProfile'
import { useState, useEffect } from 'react'
import { toggleFollow, toggleHideUser } from '../apis/App'
import { FollowingList } from './FollowingList'
import { CreatePost } from './CreatePost'
import { useAppContext } from '../store/AppContext'
import { formatNumber } from '../utils/formatNumber.js'

export const Profile = ({ user, me, setUser, setMyData }) => {
	const { previewImg: showAvatar, setPreviewImg: setShowAvatar } = useAppContext()
	const [loading, setLoading] = useState(false)
	const [editorOpen, setEditorOpen] = useState(false)
	const [postOpen, setPostOpen] = useState(false)
	const [isFollowLoading, setIsFollowLoading] = useState(false)

	const isMyProfile = !!me
	const following = user?.imFollowing
	const hidden = user?.hidden

	useEffect(() => {
		const escHandler = (e) => {
			if (e.key === 'Escape') setShowAvatar('')
		}
		document.addEventListener('keydown', escHandler)
		return () => document.removeEventListener('keydown', escHandler)
	}, [])

	const handleFollow = async () => {
		if (isMyProfile || isFollowLoading) return
		setIsFollowLoading(true)

		const newFollowState = !following

		// Optimistic update
		setUser((p) => ({
			...p,
			imFollowing: newFollowState,
			followers: newFollowState ? p.followers + 1 : p.followers - 1,
		}))
		setMyData((p) => ({
			...p,
			following: newFollowState ? p.following + 1 : p.following - 1,
		}))

		try {
			const result = await toggleFollow(user?.username, following)
			if (!result) throw new Error()
		} catch (err) {
			// Revert if failed
			setUser((p) => ({
				...p,
				imFollowing: following,
				followers: following ? p.followers + 1 : p.followers - 1,
			}))
			setMyData((p) => ({
				...p,
				following: following ? p.following + 1 : p.following - 1,
			}))
		} finally {
			setIsFollowLoading(false)
		}
	}

	const handleHide = async () => {
		if (isMyProfile) return

		const newHiddenState = !hidden
		setUser((p) => ({ ...p, hidden: newHiddenState }))

		try {
			const result = await toggleHideUser(user?._id)
			if (!result) throw new Error()
		} catch (err) {
			// Revert if failed
			setUser((p) => ({ ...p, hidden }))
		}
	}

	return (
		<Container className='bg-white md:rounded-2xl md:p-6 lg:p-8 md:shadow-even-0'>
			<img
				src={user?.cover}
				alt={`${user?.username}'s cover photo`}
				className="w-full md:rounded-lg object-cover md:max-h-[350px] lg:max-h-[450px]"
			/>

			<div className="flex md:items-center flex-col md:flex-row md:justify-between">
				<div className="flex flex-col md:flex-row gap-3 px-4 relative">
					<img
						src={user?.avatar}
						alt={user?.username}
						onClick={() => setShowAvatar(user?.avatar)}
						className="rounded-full object-cover h-24 w-24 md:h-36 md:w-36 lg:h-40 lg:w-40 absolute -top-[70px] md:left-8 md:-top-[65px] cursor-pointer"
					/>
					<div className="mt-8 md:ms-44 lg:ms-48 md:mt-0">
						<p className="text-xl md:mt-2 font-bold">
							{user?.username?.toUpperCase()}
						</p>
						<p className="md:text-sm text-base lg:text-base font-bold flex items-center gap-1 whitespace-nowrap">
							{formatNumber(user?.followers || 0)} <span className="text-dark text-base md:text-xs">Followers</span> • {formatNumber(user?.following || 0)} <span className="md:text-sm text-dark text-base">Following</span>
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 items-center gap-2 px-4 md:p-0 md:px-6 font-bold text-sm mt-2 md:mt-0">
					<button
						onClick={() => {
							if (isMyProfile) return setPostOpen(true)
							return handleFollow()
						}}
						disabled={isFollowLoading}
						className={`bg-primary rounded py-2 px-3 text-white transition duration-200 ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{isMyProfile ? 'NEW POST' : following ? 'FOLLOWING' : 'FOLLOW'}
					</button>

					<button
						onClick={() => {
							if (isMyProfile) return setEditorOpen(true)
							return handleHide()
						}}
						className="rounded bg-dark2 py-2 px-3 min-w-[120px] truncate"
					>
						{isMyProfile ? 'EDIT PROFILE' : hidden ? 'UNHIDE USER' : 'HIDE USER'}
					</button>
				</div>
			</div>

			<FollowingList loading={loading} setLoading={setLoading} username={user?.username} />
			<EditProfile setOpen={setEditorOpen} open={editorOpen} user={user} setUser={setUser} />

			{isMyProfile && postOpen && (
				<CreatePost open={postOpen} setOpen={setPostOpen} />
			)}
		</Container>
	)
}