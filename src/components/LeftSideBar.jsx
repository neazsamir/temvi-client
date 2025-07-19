import { formatNumber } from '../utils/formatNumber.js'
import axios from '../lib/axios.js'
import { useState, useEffect } from 'react'
import { Loader } from './Loader'
import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { EditProfile } from '../components/EditProfile'


export const LeftSideBar = ({ user, setUser }) => {
	const [visitors, setVisitors] = useState([])
	const [visitorsOpen, setVisitorsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [editOpen, setEditOpen] = useState(false) // modal open state

	useEffect(() => {
		if (!user || visitors.length > 0) return

		const getVisitors = async () => {
			setLoading(true)
			try {
				const { data } = await axios.get(`/app/visitors?username=${user.username}`)
				setVisitors(data?.visitors || [])
			} finally {
				setLoading(false)
			}
		}

		getVisitors()
	}, [user, visitors.length])

	const toggleVisitors = () => setVisitorsOpen(prev => !prev)

	return (
		<div className="hidden md:flex flex-col gap-5 max-h-screen overflow-y-auto max-w-[40%] min-w-[40%] h-fit">
			<div className="relative group bg-white overflow-hidden rounded-lg shadow-even-0 w-full pb-4">
				<button
					onClick={() => setEditOpen(true)}
					className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-dark2 text-black p-1 rounded-full hover:bg-dark cursor-pointer z-10"
					aria-label="Edit profile"
				>
					<FaPen />
				</button>

				<img src={user?.cover} alt="my cover" className="w-full" />
				<div className="grid grid-cols-2 items-center justify-between mt-1 relative">
					<div className="text-center">
						<p className="text-xl font-extrabold">{formatNumber(user?.followers)}</p>
						<p className="font-bold text-[12px] text-dark">Followers</p>
					</div>
					<div className="text-center">
						<p className="text-xl font-extrabold">{formatNumber(user?.following)}</p>
						<p className="font-bold text-[12px] text-dark">Following</p>
					</div>
					<img
						src={user?.avatar}
						alt="my avatar"
						className="absolute left-1/2 -top-8 xl:-top-10 -translate-x-1/2 h-12 w-12 lg:h-14 lg:w-14 xl:h-20 xl:w-20 rounded-full object-cover"
					/>
				</div>
				<p className="text-center font-bold mt-2">@{user?.username?.toUpperCase()}</p>
				<pre className="px-4 mt-4 font-sans whitespace-pre-wrap">{user?.bio}</pre>

				{editOpen && (
					<EditProfile
						user={user}
						setUser={setUser}
						open={editOpen}
						setOpen={setEditOpen}
					/>
				)}
			</div>

			<div className="bg-white max-h-[50vh] overflow-y-auto rounded-lg shadow-even-0 w-full h-fit p-4">
				<div className="font-bold mb-3 text-xl flex justify-between items-center">
					Profile visitors
					<button onClick={toggleVisitors} className="text-2xl bg-dark2 rounded-lg px-3 py-1">
						{visitorsOpen ? <FaAngleUp /> : <FaAngleDown />}
					</button>
				</div>

				{visitorsOpen && (
					<div>
						{loading ? (
							<div className="w-fit mx-auto">
								<Loader />
							</div>
						) : visitors.length > 0 ? (
							<ul className="flex flex-col gap-3">
								{visitors.map(v => (
									<li key={v.username} className="w-full flex items-center gap-2">
										<Link
											to={`/profile/${v.username}`}
											className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md w-full"
										>
											<img src={v.avatar} alt={v.username} className="h-10 w-10 rounded-full" />
											<span className="font-bold">@{v.username.toUpperCase()}</span>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<p className="font-bold text-center text-base text-dark">No data available</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}