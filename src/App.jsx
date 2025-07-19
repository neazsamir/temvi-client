import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Toaster } from 'react-hot-toast'
import { FourOFour } from './pages/404'
import { Register } from './pages/Register';
import { MyProfile } from './pages/MyProfile';
import { SinglePost } from './pages/SinglePost'
import { UserProfile } from './pages/UserProfile';
import { Verify2Fa } from './pages/Verify2Fa';
import { VerifyEmail } from './pages/VerifyEmail';
import { Reset } from './pages/Reset';
import { GlobalLoader } from './components/GlobalLoader'
import { AppLayout } from './components/layout/AppLayout'
import { useAppContext } from './store/AppContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



export const App = () => {
	const { user, appLoading } = useAppContext()
	const loggedIn = user?.username
  const router = createBrowserRouter([
    {
    	path: '/',
    	element: <AppLayout />,
		  children: [
		    {
		      path: '/',
		      element: <Home />,
		    },
		    {
		      path: '/post/:postId',
		      element: <SinglePost />,
		    },
		    {
		      path: '/profile/:username',
		      element: <UserProfile />,
		    },
		    {
		      path: '/profile',
		      element: <MyProfile />,
		    },
		    {
		      path: '/verify/email',
		      element: <VerifyEmail />,
		    },
			 	{
		      path: '/login',
		      element: <Login />,
		    },
		    {
		      path: '/register',
		      element: <Register />,
		    },
		    {
		      path: '/verify/2fa',
		      element: <Verify2Fa />,
		    },
		    {
		      path: '/reset',
		      element: <Reset />,
		    },
    	],
		},
   {
	   path: "*",
	   element: <FourOFour />
		},
  ]);
  
  const queryClient = new QueryClient()

  return (
     <QueryClientProvider client={queryClient}>
     { appLoading && <GlobalLoader /> }
     	<Toaster />
    	<RouterProvider router={router} />
     </QueryClientProvider>
  );
};