import { Loader } from './Loader'

export const PrimaryBtn = ({
	disabled, type, loading, text, onClick
}) => {
	return (
		loading ? (<div className="w-fit mx-auto"><Loader /></div>) : (<button
	    type={type}
	    disabled={disabled}
	    onClick={onClick}
	    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-secondary transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
	  >
	     {text}
    </button>)
	)
}