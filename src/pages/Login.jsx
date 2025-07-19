import { useState } from 'react'
import { FiMail, FiLock } from 'react-icons/fi'
import { PrimaryBtn } from '../components/PrimaryBtn'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../apis/LoginUser'
import { useAppContext } from '../store/AppContext'


export const Login = () => {
	const navigate = useNavigate()
	const { setUser } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
  	try {
  		const data = await loginUser(email, password)
  		if (data?.status === 401) navigate('/verify/2fa')
  	  else if (data?.username) setUser(data)

  	} finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary to-secondary p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-center text-primary mb-2">Welcome Back 👋</h1>
          <p className="text-center text-dark mb-6">Login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dark2 text-black placeholder-dark rounded-xl py-3 pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark text-xl" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-dark2 text-black placeholder-dark rounded-xl py-3 pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <FiLock
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark text-xl cursor-pointer hover:text-primary transition"
              />
            </div>

            {/* Submit Button */}
            <PrimaryBtn loading={loading} text="LOGIN" type="submit" disabled={!email.trim() || !password.trim()}  />
          </form>
          {/* Extra Links */}
          <div className="flex justify-between text-sm text-dark mt-4">
            <Link to="/reset" className="hover:underline hover:text-primary transition">Forgot Password?</Link>
            <Link to="/register" className="hover:underline hover:text-primary transition">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}