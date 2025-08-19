type Props = {
	notification: {
		title: string;
		actions: string;
	};
};

const CourseRequestDetails = ({ notification }: Props) => {
	const actions = JSON.parse(notification.actions);

	return (
		<main className="font-inter">
			<h4 className="font-semibold text-md">{notification.title}</h4>
			<div>
				{actions
					.filter((action: any) => action.label === "show details")
					.map((action: any, i: number) => (
						<div key={i} className="mt-4">
							{/* If payload.data exists, loop over its entries */}
							{(action.payload?.data || action?.payload?.schedule) && (
								<div className="text-sm">
									{typeof action.payload?.data === "string" ? (
										<h6 className="font-inter text-xs font-medium text-green-400">
											{action.payload?.data}
										</h6>
									) : (
										Object.entries(
											action.payload.data || action.payload.schedule
										).map(([key, value]: any) => {
											if (key === "schedule") {
												let scheduleArray: any[] = [];

												if (Array.isArray(value)) {
													// Already an array
													scheduleArray = value;
												} else if (typeof value === "string") {
													try {
														const parsed = JSON.parse(value);
														scheduleArray = Array.isArray(parsed) ? parsed : [];
													} catch (e) {
														console.error("Invalid schedule JSON:", e);
													}
												}

												// Only render if we have something
												if (scheduleArray.length > 0) {
													return (
														<div key={key}>
															<h4 className="text-md font-semibold my-2 capitalize">
																{key}
															</h4>
															{scheduleArray.map(
																(scheduleItem: any, index: number) => (
																	<div
																		key={index}
																		className="mb-2 ml-4 text-xs"
																	>
																		{Object.entries(scheduleItem).map(
																			([sKey, sValue]: any) => (
																				<p
																					key={sKey}
																					className="capitalize text-green-500 mb-2"
																				>
																					<span className="font-medium text-gray-300">
																						{sKey}:
																					</span>{" "}
																					{sValue}
																				</p>
																			)
																		)}
																	</div>
																)
															)}
														</div>
													);
												}
											}

											// For all other keys
											return (
												<>
													{key !== "userId" && (
														<p
															key={key}
															className="my-2 capitalize text-green-500"
														>
															<span className="font-medium text-gray-800">
																{key}:
															</span>{" "}
															{value}
														</p>
													)}
												</>
											);
										})
									)}
								</div>
							)}
						</div>
					))}
			</div>
		</main>
	);
};
export default CourseRequestDetails;
