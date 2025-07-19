import { FaArrowLeft, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchUser } from '../apis/SearchUser'
import { Loader } from './Loader'
import { useSearchContext } from '../store/SearchContext'
import axios from '../lib/axios.js'
import { toast } from 'react-hot-toast'

export const Search = ({ open, setOpen }) => {
	const navigate = useNavigate()
	const { query, setQuery, result, setResult, history, setHistory, loading, setLoading } = useSearchContext()

	const handleChange = async (e) => {
		const q = e.target.value
		setQuery(q)
		setResult([])
		if (!q.trim()) return
		setLoading(true)
		try {
			const data = await searchUser(q.trim())
			setResult(data)
		} finally {
			setLoading(false)
		}
	}

	const handleClick = async (user) => {
		navigate(`/profile/${user.username}`)
		setOpen(false)

		setHistory((p) => p.some(u => u.username === user.username) ? p : [...p, user])

		await axios.post('/app/searchHistory', { username: user.username })
	}

	const handleRemove = async (usernameToRemove, e) => {
		e.stopPropagation()
	
		try {
			await axios.delete('/app/searchHistory', { data: { username: usernameToRemove } })

			setHistory((prev) => prev.filter(user => user.username !== usernameToRemove))
		} catch (error) {
			toast.error('Could not remove search history')
		}
	}

	return (
		open && <div className="bg-white rounded max-h-[900px] h-fit max-w-lg w-full p-4 fixed top-0 left-1/2 -translate-x-1/2 shadow-even-md overflow-y-auto">
			<div className="flex items-center gap-3 mb-4">
				<button onClick={() => setOpen(false)} className="text-3xl text-dark hover:text-black">
					<FaArrowLeft />
				</button>
				<div className="h-fit w-full relative">
					<input
						type="search"
						value={query}
						onChange={handleChange}
						className="outline-primary pr-3 pl-10 py-2 rounded-2xl w-full bg-dark2"
						placeholder="Search on Temvi"
					/>
					<FaMagnifyingGlass className="text-dark text-2xl absolute left-2 top-1/2 -translate-y-1/2" />
				</div>
			</div>

			<ul className="flex flex-col gap-2">
				{
					query ? result.map(u => (
						<li onClick={() => handleClick(u)} key={u?.username} className="flex items-center gap-4">
							<img src={u?.avatar} className="h-10 w-10 rounded-full" />
							<span className="font-bold">{u?.username?.toUpperCase()}</span>
						</li>
					)) : history.map(u => (
						<li onClick={(e) => handleClick(u, e)} key={u?.username} className="py-3 flex items-center gap-4">
							<img src={u?.avatar} className="h-10 w-10 rounded-full" />
							<span className="font-bold">{u?.username?.toUpperCase()}</span>
							<button
								onClick={(e) => handleRemove(u.username, e)}
								className="text-2xl inline-block ms-auto hover:text-red-500"
							>
								<FaXmark />
							</button>
						</li>
					))
				}
			</ul>

			{
				!query && history.length <= 0 ? (
					<p className="text-base font-bold text-dark text-center">No history</p>
				) : (
					query && !loading && result.length <= 0 ? (
						<p className="text-base font-bold text-dark text-center">No user found</p>
					) : null
				)
			}

			{loading && <div className="w-fit mx-auto">
				<Loader size={40} dotSize={9} />
			</div>}
		</div>
	)
}