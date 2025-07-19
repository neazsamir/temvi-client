import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'


export const postComment = async (postId, text) => {
	if (!text?.trim()) return
	try {
		const { data } = await axios.post('/post/comment', { postId, text})
		
		if (data?.success) toast.success(data.msg)
		return true
	} catch (e) {
		const { data } = e.response
		
		if (data) toast.error(data.msg)
		else toast.error('Something went wrong')
		return false
	}
}