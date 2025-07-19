import { toast } from 'react-hot-toast'
import axios from '../lib/axios.js'


export const verify2Step = async (otp) => {
	try {
		const { data } = await axios.post('/auth/verify-2fa', { otp })
		if (data.success) toast.success(data.msg)
		else toast.error(data.msg)
		
		return data.user || {}
	} catch (e) {
		const { data, status } = e.response
		
		if (data) toast.error(data.msg)
		else toast.error('Internal server error')
		return {}
	}
}