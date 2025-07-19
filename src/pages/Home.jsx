import { LeftSideBar } from '../components/LeftSideBar'
import { Container } from '../components/Container'
import { Feed } from '../components/Feed'
import { useAppContext } from '../store/AppContext'



export const Home = () => {
	const { user, setUser } = useAppContext()
	
	
	return (
	 user?.username && <div className="md:bg-dark2 bg-white min-h-screen">
		<div className="max-w-7xl mx-auto md:px-4 lg:px-0 md:flex gap-5 md:py-5 justify-between">
			 <LeftSideBar user={user} setUser={setUser} />
			 <Feed user={user} />
		 </div>
		</div>
	)
}