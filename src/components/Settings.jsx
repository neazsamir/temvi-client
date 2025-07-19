import { FaXmark } from "react-icons/fa6";
import { FiLock } from 'react-icons/fi'
import { Switch } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { searchUser } from '../apis/SearchUser'
import { Loader } from './Loader'
import { PrimaryBtn } from './PrimaryBtn'
import { useSearchContext } from '../store/SearchContext'
import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'



export const Settings = ({ open, setOpen, user, setUser }) => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [loggingOut, setLoggingOut] = useState(false)
	const [passwordOpen, setPasswordOpen] = useState(false)
	const [password, setPassword] = useState('')

	const handleCheck = async () => {
		const result = await axios.post('/auth/2fa')
		setUser((p) => ({ ...p, _2fa: true }))
	}
	
	const handleOff = async () => {
		try {
			if (!password.trim()) return toast.error('Password is required')
			const { data } = await axios.delete('/auth/2fa', { data: { password }})
			
			if (data.success) {
				toast.success('2FA disabled')
				setUser((p) => ({ ...p, _2fa: false}))
				setPasswordOpen(false)
				setPassword('')
			}
		} catch (e) {
			const { data } = e.response
			setPasswordOpen(false)
			setPassword('')
			if (data) toast.error(data.msg)
			else toast.error('Could not disable 2FA')
		} finally { setLoading(false) }
	}
	
	const handleLogout = async () => {
		const { data } = await axios.post('/auth/logout')
		
		if (data?.success) {
			setUser(null)
			navigate('/login')
		}
		else toast.error('Could not logout')
	}
	
	useEffect(() => {
		if (passwordOpen) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = 'scroll'
	}, [passwordOpen])

	return (
		open && <div className="bg-white rounded h-fit max-w-sm w-full p-4 fixed top-0 right-0 shadow-even-md">
			<div className="flex items-center gap-3 mb-5">
				<FaXmark onClick={() => setOpen(false)} className="text-3xl hover:text-red-500" />
			  <span className="font-bold text-2xl">
				 Settings
			  </span>
			</div>
		  <div className="flex items-center justify-between text-xl font-bold">
		  	Two-Factor auth (2FA)
		  	<Switch
      checked={user?._2fa}
      onChange={() => {
		  		if (!user?._2fa) return handleCheck()
		  		setPasswordOpen(true)
		  	}}
      className={`group relative flex h-6 w-14 cursor-pointer rounded-full p-1 ease-in-out focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white ${user?._2fa ? 'bg-primary': 'bg-dark'}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${user?._2fa ? 'translate-x-7' : 'translate-x-0'}`}
      />
    </Switch>
		  </div>
		  <button onClick={() => {
		  	navigate('/reset')
		  	setOpen(false)
		  }} className="px-3 w-full py-2 rounded-lg bg-dark2 text-blue-400 font-bold mt-4 text-lg">RESET PASSWORD</button>
		  {
		  	loggingOut ? <div className="w-fit mt-3 mx-auto"><Loader /></div> : <button onClick={handleLogout} className="px-3 w-full py-2 rounded-lg bg-dark2 text-red-500 font-bold mt-4 text-lg">LOGOUT</button>
		  }
		  {
		  	passwordOpen && <>
		  		<div onClick={() => setPasswordOpen(false)} className="fixed top-0 left-0 bottom-0 right-0 bg-black opacity-60 z-[70]" />
		  	  <div className="fixed left-0 top-0 right-0 bottom-0 p-4 z-[71] flex items-center justify-center pointer-events-none">
		  	   <div className="max-w-sm w-full bg-white rounded-2xl p-4 pointer-events-auto">
		  	    <h2 className="text-2xl text-center mb-5 font-bold">Enter your password</h2>
		  	  	<div className="relative h-[50px] mb-3">
              <input
                type='password'
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-dark2 text-black placeholder-dark rounded-xl py-2 pl-4 pr-12 shadow-inner outline-primary"
              />
              <FiLock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark text-xl cursor-pointer hover:text-primary transition"
              />
            </div>
            <PrimaryBtn loading={loading} type="button" text="DISABLE" onClick={handleOff} />
          	<Link onClick={() => {
          		setOpen(false)
          		setPasswordOpen(false)
          	}} className="text-sm font-semibold hover:underline text-blue-400 w-full text-center mt-4 block" to="/reset">Forgot password? Reset it</Link>
		  	   </div>
		  	  </div>
		  	 </>
		  }
		</div>
	)
}