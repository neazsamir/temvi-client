import { useAppContext } from '../store/AppContext'
import { useEffect } from 'react'

export const PreviewImg = () => {
	const { previewImg, setPreviewImg } = useAppContext()
	
	useEffect(() => {
		if (previewImg) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = 'scroll'
	}, [previewImg])
	
	
	return (
	previewImg &&	<div
					onClick={() => setPreviewImg('')}
					className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
				>
					<img
						src={previewImg}
						alt="Full Avatar"
						onClick={(e) => e.stopPropagation()}
						className="max-w-full max-h-full rounded-xl shadow-lg"
					/>
		</div>
	)
}