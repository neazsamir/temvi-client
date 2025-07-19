import axios from 'axios'


const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	withCredentials: true,
	header: {
		'Content-type': 'application/json'
	}
})


export default axiosInstance;