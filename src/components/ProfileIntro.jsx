import axios from '../lib/axios.js'
import { useState, useEffect } from 'react'
import { Loader } from './Loader'
import { useAppContext } from '../store/AppContext'



export const ProfileIntro = ({ bio, username }) => {
	const { setPreviewImg } = useAppContext()
	const [photos, setPhotos] = useState([])
	const [loading, setLoading] = useState(false)
	
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
	
	return (
	 <div className="">
	  { bio && <p className="text-xl font-bold">Bio</p> }
	  <p className="text-base break-words">{ bio }</p>
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
	 </div>
	)
}