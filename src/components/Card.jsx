export const Card = ({ children, className }) => {
	return (
	 <div className={`shadow-even-md rounded-xl p-3 ${className}`}>
		{ children }
	 </div>
	)
}