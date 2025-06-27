import { timeAgo } from "@/lib/utils/helperFunctions/TimeFormater";
import { PiStudentFill } from "react-icons/pi";
import { RiTodoFill } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";

type Props = {
	isLoading: boolean;
	notifications: any;
};

const Notifications = ({ isLoading, notifications }: Props) => {
	console.log(notifications);

	const getIsReadLength = () => {
		return notifications.filter(
			(notification: any) => notification.isRead === false
		);
	};

	return (
		<main className="font-inter h-[400px] pb-4 overflow-auto scrollable-div">
			<h4 className="p-4 font-semibold text-sm mt-2">Notifications</h4>
			<hr className="my-2" />
			<div className="text-sm">
				{notifications && notifications.length > 0 ? (
					<div>
						<h6 className="p-4 w-24 ml-2 flex items-center border-b-2 border-green-700">
							Inbox{" "}
							<span className="bg-red-700 py-1 px-2 rounded-full ml-2 font-semibold">
								{getIsReadLength().length}
							</span>
						</h6>
						<hr className="mb-2" />
						<div>
							{notifications.map((notification: any) => (
								<>
									{" "}
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
											<button className="text-xs font-semibold">
												{notification.isRead ? (
													<></>
												) : (
													<p className="cursor-pointer duration-500 hover:text-gray-400">
														Mark as Read
													</p>
												)}
											</button>
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
																className={`text-[10px] capitalize py-1 px-2 font-semibold cursor-pointer rounded-lg ${
																	action.label === "approve key"
																		? "bg-orange-500 hover:bg-orange-600"
																		: action.label === "decline key"
																		? "bg-red-500 hover:bg-red-600"
																		: action.label === "show details"
																		? "bg-blue-500 hover:bg-blue-600"
																		: "bg-green-500 hover:bg-green-600"
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
					<div>bvhdvshb</div>
				)}
			</div>
		</main>
	);
};

export default Notifications;
