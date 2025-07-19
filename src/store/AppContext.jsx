import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../lib/axios.js'


const AppContext = createContext()


export const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [previewImg, setPreviewImg] = useState('')
	const [appLoading, setAppLoading] = useState(true)
	
	const getUserData = async () => {
		setAppLoading(true)
		try {
			const { data } = await axios.get('/app/myData')
			setUser(data.user)
		} catch (e) {
			setUser(null)
		} finally {
			setAppLoading(false)
		}
	}
	
	useEffect(() => {
		getUserData()
	}, [])
	
	return (
		<AppContext.Provider value={{ user, setUser, appLoading, previewImg, setPreviewImg }}>
			{ children }
		</AppContext.Provider>
	)
}


export const useAppContext = () => useContext(AppContext)