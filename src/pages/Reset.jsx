import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { PrimaryBtn } from '../components/PrimaryBtn'
import { Loader } from '../components/Loader'
import axios from '../lib/axios.js'


export const Reset = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const query = new URLSearchParams(location.search)
	const token = query.get('token')
	const { user, appLoading } = useAppContext()

	const [email, setEmail] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState('')
	const [error, setError] = useState('')
	const [secondsLeft, setSecondsLeft] = useState(0)

	// Auto-fill email from user context if available
	useEffect(() => {
		if (user?.email) setEmail(user.email)
	}, [user])

	// Cooldown logic
	useEffect(() => {
		if (token) return
		const lastSent = Number(localStorage.getItem('lastResetEmail'))
		const now = Date.now()
		const diff = Math.floor((now - lastSent) / 1000)
		const remaining = 120 - diff
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

	const handleSendReset = async () => {
	setLoading(true)
	setError('')
	setResult('')

	try {
		const { data } = await axios.post('/auth/sendResetMail', { email })

		localStorage.setItem('lastResetEmail', Date.now())
		setSecondsLeft(120)
		setResult(data.msg || 'Password reset link sent to your email.')
		} catch (err) {
			const errorMsg = err?.response?.data?.msg || 'Something went wrong.'
			setError(errorMsg)
		} finally {
			setLoading(false)
		}
	}

	const handleResetPassword = async () => {
		if (newPassword !== confirmPassword) {
			setError('Passwords do not match')
			return
		}
		setLoading(true)
		setError('')
		
		if(!newPassword.trim()) return
		try {
			const { data } = await axios.post('/auth/resetPassword', { token, newPassword, })
			
			setResult('Password reset successful. You can now login.')
		} catch (e) {
			const errorMsg = e?.response?.data?.msg || 'Something went wrong.'
			setError(errorMsg)
		} finally {
			setLoading(false)
		}
	}

	const formatTime = (s) => {
		const m = String(Math.floor(s / 120)).padStart(2, '0')
		const sec = String(s % 120).padStart(2, '0')
		return `${m}:${sec}`
	}

	

	return (
		!appLoading && <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary to-secondary px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
				{token ? (
					<>
						<h1 className="text-3xl font-extrabold mb-4">Reset Password</h1>
						<p className="text-md text-dark mb-4">{result || 'Enter your new password'}</p>
						{!result && (
							<>
								<input
									type="password"
									className="w-full p-3 mb-3 border rounded-xl outline-none"
									placeholder="New password"
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
								/>
								<input
									type="password"
									className="w-full p-3 mb-4 border rounded-xl outline-none"
									placeholder="Confirm password"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
								/>
								<PrimaryBtn loading={loading} text="RESET PASSWORD" onClick={handleResetPassword} />
							</>
						)}
						{result && (
							<Link to={user?.email ? '/' : '/login'} className="block mt-5 font-semibold text-primary">
								{ user?.email ? 'Go to Home' : 'Go to Login' }
							</Link>
						)}
						{error && <p className="text-red-500 mt-3 font-semibold">{error}</p>}
					</>
				) : (
					<>
						<h1 className="text-3xl font-extrabold mb-2">Forgot your password?</h1>
						<p className="text-sm mb-5 text-dark">
							We’ll send a reset link to your email address
						</p>
						<input
							type="email"
							className="w-full p-3 mb-4 border rounded-xl outline-none"
							placeholder="Enter your email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={!!user?.email}
						/>
						{secondsLeft > 0 && (
							<p className="text-center font-semibold mb-3">
								Resend in <span className="text-primary font-bold">{formatTime(secondsLeft)}</span>
							</p>
						)}
						<PrimaryBtn loading={loading} text="SEND RESET LINK" disabled={secondsLeft > 0 || !email} onClick={handleSendReset} />
						{result && <p className="text-green-600 mt-3 font-semibold">{result}</p>}
						{error && <p className="text-red-500 mt-3 font-semibold">{error}</p>}
					</>
				)}
			</div>
		</div>
	)
}