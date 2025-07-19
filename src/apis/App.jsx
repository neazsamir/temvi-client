import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'



export const toggleFollow = async (username, following) => {
	try {
		const config = {
			url: following ? '/app/unfollow' : '/app/follow',
			method: following ? 'delete' : 'post',
			...(following && { data: { username } }),
			...(!following && { data: { username } }),
		}

		const { data } = await axios(config)

		return true
	} catch (e) {
		const { data } = e.response || {}
		const fallback = following ? 'Failed to unfollow' : 'Failed to follow'
		toast.error(data?.msg || fallback)
		return false
	}
}


export const toggleHideUser = async (userId) => {
	try {
		const { data } = await axios.patch('/app/toggleHideUser', { userId })

		return true
	} catch (e) {
		const { data } = e.response
		
		if (data) toast.error(data.msg)
		else toast.error('Something went wrong')
		return false
	}
}


export const updateBio = async (text) => {
	try {
		const { data } = await axios.put('/app/bio', { text })
		toast.success(data.msg)
		return true
	} catch (e) {
		const { data } = e.response
		
		if (data) toast.error(data.msg)
		else toast.error('Failed to hide')
		return false
	}
}

export const updateAvatar = async (form) => {
	try {
		const { data } = await axios.put('/app/avatar', form, {
  		headers: {
  		 'Content-Type': 'multipart/form-data',
  		},
		})
		return true
	} catch (e) {
		const { data } = e.response

		if (data) toast.error(data.msg)
		else toast.error('Failed to upload avatar')
		return false
	}
}

export const updateCover = async (cover) => {
	try {
		const { data } = await axios.put('/app/cover', { cover })
		return true
	} catch (e) {
		const { data } = e.response

		if (data) toast.error(data.msg)
		else toast.error('Failed to upload avatar')
		return false
	}
}