import { FourOFour } from './404'
import { Profile } from '../components/Profile'
import { ProfileIntro } from '../components/ProfileIntro'
import { Container } from '../components/Container'
import { GlobalLoader } from '../components/GlobalLoader'
import { UserPosts } from '../components/UserPosts'
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { profileData } from '../apis/UserData'
import axios from '../lib/axios.js'



export const UserProfile = () => {
	const { appLoading, user:myData, setUser:setMyData } = useAppContext()
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState(null)
	const location = useLocation()
	const params = useParams()
	
	useEffect(() => {
		const getProfile = async () => {
			setLoading(true)
			try {
				const data = await profileData(params.username)
				setUser(data)
			} finally { setLoading(false) }
		}
		getProfile()
	}, [location.pathname])
	
	useEffect(() => {
		if (user?.username === myData?.username || !user || !myData) return
		
		const addVisitor = async () => await axios.post('/app/visitors', { username: user.username, visitor: myData.username })
		
		addVisitor()
	}, [user, myData])
	
	
	if (appLoading) return
	return (
		loading ? <GlobalLoader /> : !user && !loading ? <FourOFour /> : (<div className="min-h-screen bg-dark2 md:p-5">
			<Profile user={user} setMyData={setMyData} me={myData?.username === user?.username} setUser={setUser} />
			<Container className='flex flex-col md:flex-row md:gap-4 md:mt-4'>
			 <div className="bg-white md:rounded-xl p-4 md:min-w-[40%] md:max-w-[40%] shadow-even-0 h-fit">
				<ProfileIntro bio={user?.bio} username={user?.username} vibes={user?.vibes} />
			 </div>
			 <div className="md:p-4 md:pt-0 md:max-h-screen md:overflow-y-auto w-full">
				<UserPosts username={user?.username} />
			 </div>
			</Container>
		</div>)
	)
}