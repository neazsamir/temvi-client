import axios from '../lib/axios.js'
import { useState, useEffect } from 'react'
import { Loader } from './Loader'
import { Card } from './Card'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ImgWithLoader } from './ImgWithLoader'


export const FollowingList = ({ username, loading, setLoading }) => {
	const [list, setList] = useState([])
	const [open, setOpen] = useState(false)
	const [listLoading, setListLoading] = useState(false)
	const navigate = useNavigate()
	const handleClick = async () => {
		setOpen(!open)
		if (list.length > 0 && open) return
		setListLoading(true)
			try {
				const { data } = await axios.get(`/app/followingList?username=${username}`)
				setList(data.list || [])
			} finally { setListLoading(false) }
	}

	return (
	 <div className="py-3 border-t border-solid border-dark2 mt-8">
	  <div className="flex items-center justify-between font-bold px-4 md:px-0">
	  	Following
	    <button onClick={handleClick} className="text-xl bg-dark2 rounded px-2 py-1">
	      { open ? <FaAngleUp /> : <FaAngleDown /> }
	    </button>
	    </div>
	    <div className={`items-center gap-3 p-4 overflow-x-auto no-scrollbar ${ open ? 'flex' : 'hidden'}`}>
	    	{
	    	list.length > 0 ? (list.map(({username, avatar}) => {
						return (
							<Card className="w-[160px] shrink-0 p-2" key={username}>
								<div onClick={() => navigate(`/profile/${username}`)} className="w-full cursor-pointer">
									<ImgWithLoader
										src={avatar}
										alt={username}
										className="w-full h-[140px] rounded-xl object-cover"
										containerClassName="rounded-xl"
									/>
								</div>
								<p className="text-center font-bold mt-3 truncate">{username?.toUpperCase()}</p>
							</Card>
						)
					})
					) : listLoading ? (<div className="w-full flex justify-center"><Loader /></div>) : <p className="font-bold text-center w-full text-dark">No data available</p>
	    	}
	    </div>
	  </div>
	)
}