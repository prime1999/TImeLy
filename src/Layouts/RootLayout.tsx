import { Outlet } from "react-router-dom";

const RootLayouts = () => {
	return (
		<div className="flex flex-col min-h-screen m-0">
			<div className="grow mb-8">
				<Outlet />
			</div>
		</div>
	);
};

export default RootLayouts;
