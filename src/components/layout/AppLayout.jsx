import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header } from '../Header'
import { Comments } from '../Comments'
import { useAppContext } from '../../store/AppContext'
import { socket } from '../../lib/socket.js'
import { toast } from 'react-hot-toast'
import { PreviewImg } from '../PreviewImg'


export const AppLayout = () => {
  const { user, appLoading } = useAppContext()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const publicRoutes = ['/login', '/register', '/verify/2fa']
  const freeRoutes = ['/reset']
  const isPublic = publicRoutes.includes(pathname)
  const isFree = freeRoutes.includes(pathname)

  useEffect(() => {
	  if (appLoading || isFree) return
		
	  if (!user?.username && !isPublic) {
	    navigate('/login')
	    return
	  }
	  
	  if (user?.username && isPublic) {
	    navigate('/')
	    return
	  }
	}, [appLoading, user, pathname, navigate])

  useEffect(() => {
    if (!user?.username && !isPublic && !isFree && appLoading) return

    socket.emit('register', user?._id?.toString())

    socket.on('notification', (data) => {
      toast.custom((t) => (
        <div
        	onClick={() => navigate(`/post/${data?.payload?.postId?.toString()}`)}
          className={`${
            t?.visible ? 'animate-enter' : 'animate-leave'
          } bg-white shadow-even-md px-3 py-2 rounded-lg flex items-center gap-2 font-bold text-sm md:text-base`}
        >
          <img
            src={data?.payload?.sender}
            alt="avatar"
            className="h-8 w-8 rounded-full"
          />
          {data?.message}
        </div>
      ))
    })

    return () => {
      socket.off('notification')
    }
  }, [pathname, user])

	if (
	  appLoading ||
	  (!user?.username && !isPublic && !isFree) ||
	  (user?.username && isPublic)
	) {
	  return null
	}
	  
  return (
    <>
      {
  	   user?.username && <>
      		<Header />
      		<PreviewImg />
      	</>
      }
      <Outlet />
    </>
  )
}