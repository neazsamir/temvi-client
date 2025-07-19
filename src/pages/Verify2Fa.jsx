import { useState, useRef, useEffect } from 'react'
import { verify2Step } from '../apis/Verify2Step'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import { PrimaryBtn } from '../components/PrimaryBtn'
import { useAppContext } from '../store/AppContext'

export const Verify2Fa = () => {
	const { setUser } = useAppContext()
  const navigate = useNavigate()
  const { user, appLoading } = useAppContext()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])

  const handleChange = (e, index) => {
    const val = e.target.value
    if (!/^\d?$/.test(val)) return

    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)

    if (val && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    const newOtp = [...otp]
    paste.forEach((digit, idx) => {
      if (/^\d$/.test(digit) && idx < 6) {
        newOtp[idx] = digit
      }
    })
    setOtp(newOtp)
    if (paste.length > 0) {
      const nextIndex = Math.min(paste.length, 5)
      inputsRef.current[nextIndex].focus()
    }
  }

  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await verify2Step(otp.join(''))
      if (data.username) setUser(data)
    } finally { setLoading(false) }
  }

  useEffect(() => {
  	if (!appLoading && user?.email) navigate('/')
    const checkRequest = async () => {
      try {
        const { data } = await axios.get('/auth/checkOtpRequester')
        setError('')
      } catch (e) {
        const { data } = e.response
        console.log(data)
        if (data) setError(data.msg)
        else setError('Something went wrong')
      	navigate('/login')
      }
    }
    checkRequest()
  }, [user, appLoading])

  return (
    !appLoading && <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary to-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        {
          error ? (
            <h1 className="text-2xl font-bold text-center">{error}</h1>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-primary mb-6">Enter OTP Code</h1>
              <p className="text-dark mb-8">We sent a 6-digit code to your email. Please enter it below.</p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-3 mb-6 px-4 max-w-xs mx-auto">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={handlePaste}
                      ref={(el) => (inputsRef.current[i] = el)}
                      className="w-full aspect-square text-center text-xl font-semibold rounded-xl bg-dark2 text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  ))}
                </div>

                <PrimaryBtn loading={loading} text="VERIFY OTP" type="submit" disabled={!isOtpComplete} />
              </form>
            </>
          )
        }
      </div>
    </div>
  )
}