import { useState } from 'react'
import { Profile } from '../components/Profile'
import { Container } from '../components/Container'
import { ProfileIntro } from '../components/ProfileIntro'
import { UserPosts } from '../components/UserPosts'
import { useAppContext } from '../store/AppContext'
import { CreatePost } from '../components/CreatePost'

export const MyProfile = () => {
	const { user, setUser, appLoading } = useAppContext()
	const [postOpen, setPostOpen] = useState(false)

	return (
		!appLoading && <div className="min-h-screen bg-dark2 md:p-5">
			<Profile user={user} setUser={setUser} me={true} following={false} />
			<Container className='flex flex-col md:flex-row md:gap-4 md:mt-4'>
				<div className="bg-white md:rounded-xl p-4 md:min-w-[40%] md:max-w-[40%] h-fit md:shadow-even-0">
					<ProfileIntro bio={user?.bio} username={user?.username} />
				</div>
				<div className="md:grow">
					{/* Clickable prompt opens CreatePost */}
					<div
						onClick={() => setPostOpen(true)}
						className="bg-white md:rounded-xl p-4 w-full h-fit md:mb-4 flex items-center gap-3 md:shadow-even-0 cursor-pointer"
					>
						<img src={user?.avatar} alt="profile image" className="h-8 w-8 rounded-full object-cover" />
						<div className="rounded-xl px-3 py-1 shadow-inner-dark2 text-dark text-[12px] sm:text-base bg-dark2 w-full">
							What's on your mind, {user?.username?.toUpperCase()}?
						</div>
					</div>

					{/* Posts */}
					<div className="w-full md:max-h-screen md:overflow-y-auto">
						<UserPosts username={user?.username} />
					</div>
				</div>
			</Container>


			{
				postOpen && <CreatePost open={postOpen} setOpen={setPostOpen} />
			}
		</div>
	)
}