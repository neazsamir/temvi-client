import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from '../lib/axios.js'
import { Loader } from '../components/Loader'
import { PrimaryBtn } from '../components/PrimaryBtn'
import { useAppContext } from '../store/AppContext'



export const VerifyEmail = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const query = new URLSearchParams(location.search)
	const token = query.get('token')
	const { user, setUser, appLoading } = useAppContext()
	const [secondsLeft, setSecondsLeft] = useState(0)
	const [error, setError] = useState('')
	const [result, setrResult] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (token) return
		const lastResent = Number(localStorage.getItem('lastResentEmail'))
		const now = Date.now()
		const diff = Math.floor((now - lastResent) / 1000)
		const remaining = 60 - diff
		if (remaining > 0) setSecondsLeft(remaining)
	}, [token])

	useEffect(() => {
		if (secondsLeft <= 0) return
		const interval = setInterval(() => {
			setSecondsLeft(prev => {
				if (prev <= 1) {
					clearInterval(interval)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(interval)
	}, [secondsLeft])

	const handleResend = async () => {
		try {
			await axios.post('/auth/resend-token')
			setError('')
			localStorage.setItem('lastResentEmail', Date.now())
			setSecondsLeft(60)
		} catch (e) {
			const { data } = e.response
			if (data) setError(data.msg)
			else setError('Something went wrong')
		}
	}

	const formatTime = (s) => {
		const m = String(Math.floor(s / 60)).padStart(2, '0')
		const sec = String(s % 60).padStart(2, '0')
		return `${m}:${sec}`
	}
	
	
	useEffect(() => {
		const verifyToken = async () => {
			setLoading(true)
			try {
				const { data } = await axios.post(`/auth/verify-token?token=${token}`)
				setrResult(data.msg)
				setUser(p => ({...p, verified: true}))
			} catch (e) {
				const { data } = e.response
				
				if (data) setrResult(data.msg)
				else setrResult('Something went wrong')
			} finally { setLoading(false) }
		}
		verifyToken()
	}, [])
	
	useEffect(() => {
  if (appLoading) return
  if (!user?.email) {
    setTimeout(() => navigate('/login'), 0)
    return
  }
  if (user?.verified) {
    setTimeout(() => navigate('/'), 0)
  }
}, [appLoading, user])

	return (
		!appLoading && <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary to-secondary px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
				{token ? (
					// ✅ Verification result UI
					<>
						<h1 className="text-3xl font-extrabold mb-4 text-center">Email Verification</h1>
						<p className="text-md mb-6 text-dark text-center">
							{result || 'Checking token...'}
						</p>
						{
							loading ? (<div className="w-fit mx-auto"><Loader /></div>) : (<Link
							to="/"
							className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition"
						>
							Go to Homepage
						</Link>)
						}
					</>
				) : (
					// ✅ Default resend UI
					<>
						<h1 className="text-3xl font-extrabold mb-2 text-center">Confirm your email address</h1>
						<p className="text-sm mb-5 text-dark text-center">
							We have sent a confirmation link to your email address
						</p>
						{secondsLeft > 0 && (
							<div className="text-center font-semibold">
								Resend in{' '}
								<span className="text-primary font-bold">
									{formatTime(secondsLeft)}
								</span>
							</div>
						)}
						<PrimaryBtn loading={loading} text="RESEND" disabled={secondsLeft > 0} onClick={handleResend} />
						<p className="text-center text-sm font-semibold text-red-500 mb-0 mt-3">
							{error}
						</p>
					</>
				)}
			</div>
		</div>
	)
}