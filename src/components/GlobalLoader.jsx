import { Loader } from './Loader'


export const GlobalLoader = () => (
	<div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 flex items-center justify-center">
		<Loader size={52} dotSize={15} />
	</div>
)