import axios from '../lib/axios.js'

export const searchUser = async (q) => {
	try {
		const { data } = await axios.get(`/app/search?q=${q}`)
		return data.result
	} catch (e) { return [] }
}