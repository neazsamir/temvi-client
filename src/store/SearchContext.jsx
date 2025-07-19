import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../lib/axios.js'


const SearchContext = createContext()


export const SearchProvider = ({ children }) => {
	const [query, setQuery] = useState('')
	const [result, setResult] = useState([])
	const [history, setHistory] = useState([])
	const [loading, setLoading] = useState(false)
	const [searchOpen, setSearchOpen] = useState(false)
	
	useEffect(() => {
		const getHistory = async () => {
			setLoading(true)
			try {
				const { data } = await axios.get('/app/searchHistory')
				
				setHistory(data.history)
			} finally {
				setLoading(false)
			}
		}
		getHistory()
	}, [])
	
	return (
		<SearchContext.Provider value={{ query, setQuery, result, setResult, history, setHistory, loading, setLoading, searchOpen, setSearchOpen }}>
			{ children }
		</SearchContext.Provider>
	)
}


export const useSearchContext = () => useContext(SearchContext)