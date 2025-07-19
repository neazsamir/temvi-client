import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'

export const loginUser = async (email, password) => {
	if (!email?.trim()) {
		toast.error('Email is required')
		return
	} else if (!password?.trim()) {
		toast.error('Password is required')
		return
	}
	
	try {
		const { data } = await axios.post('/auth/login', {
			email, password
		})
		if (data?.success) toast.success(data?.msg)
		else toast.error(data?.msg)
		
		return data.user || {}
	} catch (e) {
		const { data, status } = e.response
		
		if (status === 401) return { ...data, status }
		if (data) toast.error(data.msg)
		else toast.error('Failed to login. Please try again later')
		return {}
	}
}