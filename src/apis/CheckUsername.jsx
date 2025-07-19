import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'

export const checkUsername = async (u) => {
	try {
		const res = await axios.post('/auth/checkUsername', { u })
		console.log(res)
		return res.data?.exists
	} catch (e) {
		console.log(e)
		if (e.response) return e.response.data?.extraDetails?.exists
		else toast.error('Internal server error')
	}
}