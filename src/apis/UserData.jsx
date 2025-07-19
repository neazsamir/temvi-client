import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'


export const profileData = async (username) => {
	try {
		const { data } = await axios.get(`/app/userData/${username}`)
		
		return data.user
	} catch (e) {
		const { data } = e.response

		if (data) toast.error(data.msg)
		else toast.error('Failed to load data')
		return null
	}
}