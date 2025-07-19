import { FaXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/formatTime.js';
import axios from '../lib/axios.js';

export const Notifications = ({ open, setOpen, user, setUser }) => {
	const navigate = useNavigate();
	const notifications = user.notifications || [];

	const handleDelete = async (notificationId) => {
		try {
			await axios.delete('/app/notification', {
				data: { notificationId },
			});

			const updatedNotifications = notifications.filter(n => n._id !== notificationId);
			setUser({ ...user, notifications: updatedNotifications });
		} catch (err) {
			console.error("Failed to delete notification", err);
		}
	};

	return (
		open && (
			<div className="bg-white rounded h-fit max-w-sm w-full p-4 fixed top-0 right-0 shadow-even-md z-[100]">
				<div className="flex items-center gap-3 mb-5">
					<FaXmark onClick={() => setOpen(false)} className="text-3xl hover:text-red-500 cursor-pointer" />
					<span className="font-bold text-xl md:text-2xl">Notifications</span>
				</div>

				<div className="flex flex-col gap-2 overflow-y-auto max-h-[90vh] pb-2 no-scrollbar">
					{notifications.length > 0 ? (
						notifications.map((n) => (
							<div onClick={() => {
								navigate(`/post/${n.payload?.postId}`)
								setOpen(false)
							}} key={n._id} className="flex items-center gap-2 group">
								<img src={n.payload.sender} alt="avatar" className="h-8 w-8 rounded-full" />
								
								<div className="flex-1 flex flex-col">
									<div className="flex items-center text-sm font-semibold gap-1">
										<div>{n.message} <span className="text-xs text-dark">• {formatTime(n.createdAt)}</span></div>
									</div>
								</div>

								<FaXmark
									className="text-black hover:text-red-500 cursor-pointer mt-1"
									onClick={() => handleDelete(n._id)}
								/>
							</div>
						))
					) : (
						<p className="font-bold text-center text-dark">No data available</p>
					)}
				</div>
			</div>
		)
	);
};