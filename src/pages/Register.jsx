import { useState } from 'react'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryBtn } from '../components/PrimaryBtn'
import { Loader } from '../components/Loader'
import { checkUsername } from '../apis/CheckUsername'
import { registerUser } from '../apis/RegisterUser'
import { useAppContext } from '../store/AppContext'

export const Register = () => {
	const { setUser } = useAppContext()
	const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateUsername = async (value) => {
    if (!value) return 'Username is required'
    if (value.length < 4 || value.length > 20) return 'Must be 4–20 characters'
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) return 'Start with letter, only letters & numbers'
    const usernameExists = await checkUsername(value)
    if (usernameExists) return 'Username already exists'
    return ''
  }

  const validatePassword = (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'At least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}:;'",.?/~`_|\\+=-])/.test(value))
      return 'Include upper, lower, number, special char'
    return ''
  }

  const handleUsernameChange = async (e) => {
    const val = e.target.value
    setUsername(val)
    setUsernameError(await validateUsername(val))
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    setPasswordError(validatePassword(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const usernameErr = await validateUsername(username)
    const passwordErr = validatePassword(password)

    setUsernameError(usernameErr)
    setPasswordError(passwordErr)

    if (usernameErr || passwordErr) return
		
		setLoading(true)
    try {
      const data = await registerUser(username, email, password)
      localStorage.setItem('lastResentEmail', Date.now())
      setUser(data)
      if (data.username) navigate('/verify/email')
    } finally { setLoading(false) }
  }

  const isFormValid = () =>
    email.trim() &&
    username.trim() &&
    password.trim() &&
    !usernameError &&
    !passwordError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary to-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02]">

        <h1 className="text-3xl font-extrabold text-primary text-center mb-1">Create an Account ✨</h1>
        <p className="text-center text-dark mb-6">Join us and explore the community</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username Field */}
          <div className="space-y-1">
            <div className="relative h-14">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
                className={`w-full h-full bg-dark2 text-black placeholder-dark rounded-xl py-3 pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 ${
                  usernameError
                    ? 'focus:ring-red-500'
                    : username.length > 0
                    ? 'focus:ring-green-500'
                    : 'focus:ring-primary'
                } transition-all`}
              />
              <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-dark text-xl" />
            </div>
            {usernameError && <p className="text-red-500 text-xs">{usernameError}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <div className="relative h-14">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-full bg-dark2 text-black placeholder-dark rounded-xl py-3 pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-dark text-xl" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative h-14">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`w-full h-full bg-dark2 text-black placeholder-dark rounded-xl py-3 pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 ${
                  passwordError
                    ? 'focus:ring-red-500'
                    : password.length > 0
                    ? 'focus:ring-green-500'
                    : 'focus:ring-primary'
                } transition-all`}
              />
              <FiLock
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark text-xl cursor-pointer hover:text-primary transition"
              />
            </div>
            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
          </div>

          {/* Submit Button */}
          <PrimaryBtn  loading={loading} disabled={!isFormValid()} text='REGISTER' type="submit" />
        </form>

        {/* Footer Link */}
        <div className="text-sm text-dark mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline transition">Sign in</Link>
        </div>
      </div>
    </div>
  )
}