import axios from '../lib/axios.js'
import { useState, useEffect } from 'react'
import { Loader } from './Loader'
import { EditVibes } from './EditVibes'
import { useAppContext } from '../store/AppContext'
import { MdModeEdit } from "react-icons/md";


export const ProfileIntro = ({ bio, username, vibes = [] }) => {
	const { setPreviewImg, user, setUser } = useAppContext()
	const [photos, setPhotos] = useState([])
	const [loading, setLoading] = useState(false)
	const [isEditingVibes, setIsEditingVibes] = useState(false)
	const isMyIntro = username === user?.username
	
	
	useEffect(() => {
		const getPhotos = async () => {
			setLoading(true)
			try {
				const { data } = await axios.get(`/app/photos?username=${username}`)

				setPhotos(data.photos)
			} finally { setLoading(false) }
		}
		getPhotos()
	}, [])
	
	useEffect(() => {
		if (isEditingVibes) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = 'scroll'
	}, [isEditingVibes])
	
	return (
	 <div className="">
	  { bio && <p className="text-xl font-bold">Bio</p> }
	  <p className="text-base break-words">{ bio }</p>
	  <div className="text-xl font-bold mt-10 mb-3 flex items-center justify-between">
		  Vibes
		  {
	  		isMyIntro && (<button onClick={() => setIsEditingVibes(true)} className="text-2xl hover:text-primary">
	  			<MdModeEdit />
	  		</button>)
	  	}
	  </div>
	   <div className="flex flex-wrap items-center gap-2.5 my-5 w-full">
	  	 {
	  		vibes?.length > 0 ? vibes.map((v, i) => (
	  			<span key={i} className="bg-dark2 px-3 py-2 rounded-full hover:text-white hover:bg-primary transition duration-300 ease-in font-bold uppercase text-sm">
	  				{ v }
	  			</span>
	  		)) : <p className="font-bold text-base text-center w-full text-dark">Vibes not added</p>
	  	}
	   </div>
	  <p className="text-xl font-bold mt-10 mb-3">Photos</p>
			{
				photos?.length > 0 ? (
				 <div className="grid grid-cols-3 items-center gap-1">
					{
						photos.slice().reverse().map(photo => (<img onClick={() => setPreviewImg(photo)} key={photo} src={photo} alt="Photo" className="rounded" />))
					}
			  </div>
				) : loading ? <div className="w-fit mx-auto"><Loader /></div> : <p className="text-center font-bold text-dark">Unavailable</p>
			}
			{
				isEditingVibes && isMyIntro && <EditVibes setUser={setUser} myVibes={user?.vibes} open={isEditingVibes} setOpen={setIsEditingVibes} />
			}
	 </div>
	)
}