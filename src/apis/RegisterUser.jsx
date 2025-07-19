import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'

export const registerUser = async (username, email, password) => {
	try {
		const { data } = await axios.post('/auth/register', { username, email, password })
		
		if (data?.success) {
			toast.success(data.msg)
			return data.newUser || {}
		} else toast.error(data.msg)
	} catch (e) {
		const { data, status } = e.response
		
		if (data) toast.error(data.msg)
		else toast.error('Internal server error')
		return {}
	}
}