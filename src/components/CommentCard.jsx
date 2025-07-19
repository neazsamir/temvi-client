import { formatTime } from '../utils/formatTime.js'
import { Link } from 'react-router-dom'

export const CommentCard = ({ comment = {} }) => {
	const { avatar, username } = comment.user || {}
	const { createdAt, text } = comment
	
	return (
		<div>
			<Link to={`/profile/${username}`} className="flex items-center gap-2 w-fit">
				<img src={avatar} alt={username} className="h-8 w-8 rounded-full object-cover" />
				<span className="text-sm font-bold">{username?.toUpperCase()}</span> •
				<span className="text-[10px] font-semibold text-dark">{formatTime(createdAt)}</span>
			</Link>
			<div className="ms-10">
				<div className="w-fit max-w-[80%] break-words bg-dark2 rounded-xl rounded-tl-none p-2 mt-1.5">
					{text}
				</div>
			</div>
		</div>
	)
}