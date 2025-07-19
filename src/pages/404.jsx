import { Link, useNavigate } from 'react-router-dom'

export const FourOFour = () => {
const navigate = useNavigate()

return (  
 <div className="h-screen w-screen flex items-center justify-center flex-col">  
		<h1 className="text-2xl md:text-3xl text-dark text-center font-bold">  
			This page is currently unavailable  
		</h1>  
	  <div className="grid grid-cols-2 items-center justify-center gap-3 font-bold max-w-sm mt-3">  
	    <button onClick={() => navigate(-1)} className="bg-primary px-3 py-2 rounded-lg text-white">  
	    	GO BACK  
	    </button>  
	    <Link to="/" className="bg-dark2 px-3 py-2 rounded-lg">  
	    	GO TO HOME  
	    </Link>  
	  </div>  
 </div>  
)

}

