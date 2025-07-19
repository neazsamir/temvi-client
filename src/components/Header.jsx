import { NavLink, Link } from 'react-router-dom'
import { GoHome, GoGear } from "react-icons/go";
import { TfiBell } from "react-icons/tfi";
import { Search } from './Search'
import { Settings } from './Settings'
import { Notifications } from './Notifications'
import { IoIosSearch } from "react-icons/io";
import { useState } from 'react'
import { useAppContext } from '../store/AppContext'


export const Header = () => {
	const [searchOpen, setSearchOpen] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [notificationsOpen, setNotificationsOpen] = useState(false)
	const { user, setUser } = useAppContext()
	
	
	
	return (
		<div className="bg-white px-4 py-3 shadow-even sticky  z-40 top-0 left-0 w-full">
			<nav className="flex items-center justify-between gap-3 max-w-7xl mx-auto md:px-5">
	  		{
	  			!user?.verified && <div className="absolute -bottom-4 left-0 w-full bg-amber-400 text-center text-sm">
	  				<Link to="verify/email" className="text-blue-400 hover:underline">Click here</Link> to verify your account
	  			</div>
	  		}
					<NavLink className={({isActive}) => `border-2 border-solid rounded-full ${isActive ? 'border-primary' : 'border-transparent'}`} to="/profile">
						<img src={user?.avatar} className="h-9 w-9 rounded-full object-cover" alt="Temvi logo" />
					</NavLink>
					<NavLink className={({isActive}) => `sm:text-3xl text-2xl hover:text-primary ${isActive ? 'text-primary' : 'text-dark'}`}  to="/">
						<GoHome />
					</NavLink>
					<button onClick={() => setSearchOpen(true)} className="sm:text-3xl text-2xl text-dark hover:text-primary md:hidden">
						<IoIosSearch />
					</button>
				  <div onClick={() => setSearchOpen(true)} className="hidden md:flex gap-3 items-center px-3 py-2 rounded-2xl w-full md:max-w-sm lg:max-w-md bg-dark2 text-gray-400">
				  	<IoIosSearch className="text-2xl text-dark" />
				  	Search on Temvi
				  </div>
					<button onClick={() => setNotificationsOpen(true)} className="relative text-dark hover:text-primary text-2xl sm:text-3xl">
					  <TfiBell />
					  {user?.notifications?.length > 0 && (
					    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
					      {user.notifications.length > 99 ? '99+' : user.notifications.length}
					    </span>
					  )}
					</button>
					<button onClick={() => setSettingsOpen(true)} className="sm:text-3xl text-2xl text-dark hover:text-primary">
						<GoGear />
					</button>
			</nav>
			<Search open={searchOpen} setOpen={setSearchOpen} />
			<Settings open={settingsOpen} setOpen={setSettingsOpen} user={user} setUser={setUser} />
			{
				notificationsOpen && <Notifications setUser={setUser} user={user} open={true} setOpen={setNotificationsOpen} />
			}
		</div>
	)
}