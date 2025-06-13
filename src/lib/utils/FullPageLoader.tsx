import React from "react";

const FullPageLoader = () => {
	return (
		<div
			style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
			className="w-[100vw] h-[100vh] flex items-center justify-center"
		>
			<div className="full-loader"></div>
		</div>
	);
};

export default FullPageLoader;
