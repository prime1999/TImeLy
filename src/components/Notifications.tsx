import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { RiTodoFill } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";
import { PiStudentFill } from "react-icons/pi";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { markAsRead, setNotification } from "@/lib/slice/NotificationSlice";
import { timeAgo } from "@/lib/utils/helperFunctions/TimeFormater";
import TableLoader from "@/lib/utils/tableLoader";
import ShowNotificationDetailsModal from "./modals/ShowNotificationDetailsModal";
import { addStudentCourse, updateCourse } from "@/lib/slice/CourseSlice";

type Props = {
	isLoading: boolean;
	notifications: any;
	getIsReadLength: any;
};

const Notifications = ({
	isLoading,
	notifications,
	getIsReadLength,
}: Props) => {
	// state for the show details modal
	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();

	const markNotification = async (notificationId: any) => {
		try {
			const res: any = await dispatch(markAsRead(notificationId));
			if (res && res.$id) {
				// show success msg
				toast("marked");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDispatch = async (notification: any) => {
		try {
			// dispatch function to mark a notification as read
			await dispatch(setNotification(notification));
			// close the notification modal
			setOpen(true);
		} catch (error) {
			console.log(error);
		}
	};
	const approveAddCourse = async (notification: any) => {
		try {
			// init the res variable
			let res;
			if (notification.title === "Request to add a course") {
				// dispatch the function to approve the course and add it to the DB
				res = await dispatch(
					addStudentCourse(JSON.parse(notification.actions)[0])
				).unwrap();
			} else if (notification.title === "Request to update course details") {
				// dispatch the function to approve the course and update it in the DB
				res = await dispatch(
					updateCourse(JSON.parse(notification.actions)[0])
				).unwrap();
			}
			if (res && res.msg === "Course created") {
				// if the course was approved successfully
				toast(res.msg);
				// then mark the notification as read
				if (notification.isRead === false) {
					await markNotification(notification.$id);
				}
			} else {
				toast(res.msg);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className="font-inter h-[400px] pb-4 overflow-auto scrollable-div">
			<h4 className="p-4 font-semibold text-sm mt-2">Notifications</h4>
			<hr className="my-2" />
			<div className="text-sm">
				<div className="flex items-center justify-center h-full">
					{isLoading && <TableLoader />}
				</div>
				{notifications && notifications.length > 0 && !isLoading ? (
					<div>
						<h6 className="p-4 w-24 ml-2 flex items-center border-b-2 border-green-700 text-center">
							Inbox
							{getIsReadLength() > 0 && (
								<span className="bg-red-700 py-1 px-2 rounded-full ml-2 font-semibold">
									{getIsReadLength()}
								</span>
							)}
						</h6>
						<hr className="mb-2" />
						<div>
							{Array.isArray(notifications) &&
								notifications?.map((notification: any) => (
									<>
										<div
											key={notification.$id}
											className={`py-2 px-4 border-l-6 ${
												notification.type === "request"
													? "border-red-200"
													: "border-green-200"
											}`}
										>
											<div className="flex items-start justify-between">
												{" "}
												<div className="flex gap-2">
													<span className="relative">
														<PiStudentFill className="rounded-full bg-green-200 p-2 w-8 h-8 text-lg text-black" />
														<span className="absolute right-0 bottom-1 w-[14px] h-[14px] bg-green-500 rounded-full border-2 border-white"></span>
													</span>
													<div>
														<div>
															<h6 className="dark:text-gray-300">
																Notification from{" "}
																<span className="font-semibold dark:text-gray-400">
																	{notification.student[0].name}
																</span>
															</h6>
															<span className="text-xs text-gray-500">
																{timeAgo(notification.createdAt)}
															</span>
														</div>
													</div>
												</div>
												<span className="text-xs font-semibold">
													{notification.isRead ? (
														<SiTicktick className="text-lg text-green-500" />
													) : (
														<button
															onClick={() => markNotification(notification.$id)}
															className="cursor-pointer duration-500 hover:text-gray-400"
														>
															Mark as Read
														</button>
													)}
												</span>
											</div>
											{notification.type === "request" && (
												<div className="flex flex-col bg-gray-100 p-2 rounded-lg ml-12 mt-2 dark:bg-gray-800">
													<div className="flex items-start gap-2">
														<RiTodoFill className="text-green-500 mt-1" />
														<span className="text-xs">
															<p className="font-semibold">
																{notification.title}
															</p>
															<p className="text-[10px]">
																{notification.message}
															</p>
														</span>
													</div>
													<div className="flex gap-2 items-center flex-wrap mt-2">
														{JSON.parse(notification.actions).map(
															(action: any) => (
																<button
																	disabled={
																		action.label !== "show details" &&
																		notification.isRead
																	}
																	onClick={() =>
																		action.label === "show details"
																			? handleDispatch(notification)
																			: action.label === "approve key" &&
																			  approveAddCourse(notification)
																	}
																	className={`text-[10px] capitalize py-1 px-2 font-semibold cursor-pointer rounded-lg duration-500 ${
																		action.label === "approve key"
																			? "bg-green-500 hover:bg-green-600"
																			: action.label === "decline key"
																			? "bg-red-500 hover:bg-red-600"
																			: action.label === "show details"
																			? "bg-blue-500 hover:bg-blue-600"
																			: "bg-orange-500 hover:bg-orange-600"
																	}`}
																>
																	{action.label}
																</button>
															)
														)}
													</div>
												</div>
											)}
										</div>
										<hr />
									</>
								))}
						</div>
					</div>
				) : (
					!isLoading &&
					!Array.isArray(notifications) && (
						<div className="flex items-center justify-center text-center">
							<h1 className="font-inter font-semibold text-lg">
								No Notifications for now
							</h1>
						</div>
					)
				)}
			</div>
			<Toaster />
			<ShowNotificationDetailsModal open={open} setOpen={setOpen} />
		</main>
	);
};

export default Notifications;
