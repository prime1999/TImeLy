type Props = {
	notification: {
		title: string;
		actions: string; // this is expected to be a JSON string
	};
};

const CourseRequestDetails = ({ notification }: Props) => {
	// Safely parse actions from the stringified JSON
	const actions = JSON.parse(notification.actions);

	return (
		<main className="font-inter">
			<h4 className="font-semibold text-md">{notification.title}</h4>
			<div>
				{actions
					.filter((action: any) => action.label === "show details")
					.map((action: any, i: number) => (
						<div key={i} className="mt-2">
							{action.payload?.data?.courseTitle && (
								<div className="flex gap-2 items-center text-sm">
									<h6 className="font-semibold text-gray-600">Course Title:</h6>
									<p className="text-gray-800">
										{action.payload.data.courseTitle}
									</p>
								</div>
							)}

							{action.payload?.data?.venue && (
								<div className="flex gap-2 items-center text-sm">
									<h6 className="font-semibold text-gray-600">Venue:</h6>
									<p className="text-gray-800">{action.payload.data.venue}</p>
								</div>
							)}
						</div>
					))}
			</div>
		</main>
	);
};

export default CourseRequestDetails;
