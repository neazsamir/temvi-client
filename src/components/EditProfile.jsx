import { useState, useEffect, useRef } from 'react'
import { PrimaryBtn } from './PrimaryBtn'
import { updateBio, updateAvatar, updateCover } from '../apis/App'
import covers from '../constants/covers.js'
import { ImgWithLoader } from './ImgWithLoader'


export const EditProfile = ({ open, setOpen, user, setUser }) => {
	const [bio, setBio] = useState(user?.bio || '')
	const [avatar, setAvatar] = useState(user?.avatar)
	const [cover, setCover] = useState(user?.cover || covers[0])
	const [fileForm, setFileForm] = useState(null)
	const [loading, setLoading] = useState(false)
	const fileRef = useRef(null)
	
	useEffect(() => {
	const handlePopState = (e) => {
		if (open) {
			setOpen(false) // Close modal
			window.history.pushState(null, '', window.location.href) // Prevent actual back navigation
		}
	}

	if (open) {
		document.body.style.overflow = 'hidden'
		window.history.pushState(null, '', window.location.href) // Push new state to detect back
		window.addEventListener('popstate', handlePopState)
	} else {
		document.body.style.overflow = 'auto'
	}

	return () => {
		document.body.style.overflow = 'auto'
		window.removeEventListener('popstate', handlePopState)
	}
	}, [open])
	
	
	const handleUpdate = async () => {
	setLoading(true)
	try {
		let hasChanges = false
		const updatedUser = { ...user }

		if (fileForm) {
			await updateAvatar(fileForm)
			updatedUser.avatar = avatar
			hasChanges = true
		}

		if (bio.trim() !== user.bio) {
			await updateBio(bio)
			updatedUser.bio = bio.trim()
			hasChanges = true
		}

		if (cover !== user.cover) {
			await updateCover(cover)
			updatedUser.cover = cover
			hasChanges = true
		}

		if (hasChanges) {
			setUser(updatedUser)
			setOpen(false)
		}
	} finally {
		setLoading(false)
	}
}
	
	const handleFileChange = (e) => {
		const file = e.target.files[0]
		const form = new FormData()
		form.append('file', file)
		setFileForm(form)
		
		const reader = new FileReader
			reader.readAsDataURL(file)
			reader.onload = async () => {
				const base64image = reader.result
				setAvatar(base64image)
		}
	}
	
	return (
  open && <div>
    <div onClick={() => setOpen(false)} className="bg-black opacity-60 z-[60] fixed left-0 top-0 right-0 bottom-0" />
    
    <div className="fixed inset-0 z-[61] p-4 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl p-4 bg-white shadow-even-md overflow-y-auto max-h-[85vh]">
        <div className="flex justify-center">
          <ImgWithLoader
            src={avatar}
            alt="My avatar"
            onClick={() => fileRef.current.click()}
            className="h-20 w-20 rounded-full border-[3px] border-solid border-primary p-1 object-cover"
            containerClassName="rounded-full"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/**"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <ImgWithLoader
          src={cover}
          alt="My cover"
          className=" w-full rounded-xl my-4 p-1 border-[3px] border-solid border-primary object-cover"
          containerClassName="rounded-xl"
        />

        <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
          {covers.map((c, i) => (
            <img
              key={c}
              onClick={() => setCover(c)}
              src={c}
              alt={i + 1}
              className={`w-12 h-12 rounded-full border-2 border-solid object-cover ${cover === c ? 'border-primary' : 'border-dark2'} p-1`}
            />
          ))}
        </div>

        <span className="text-base font-bold mb-2 block">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="outline-none border border-solid border-dark rounded resize-none w-full h-14 p-3 text-sm mb-4"
        />
        <PrimaryBtn onClick={handleUpdate} text="UPDATE" loading={loading} />
      </div>
    </div>
  </div>
)
}