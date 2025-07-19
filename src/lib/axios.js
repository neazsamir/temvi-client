import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
	baseURL: API_URL ? API_URL + '/api' : 'http://localhost:3000/api',
	withCredentials: true,
	header: {
		'Content-type': 'application/json'
	}
})


export default axiosInstance;