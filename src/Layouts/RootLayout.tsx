import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

const RootLayouts = () => {
	return (
		<div className="flex flex-col h-screen m-0">
			<div className="grow mb-8 pb-20">
				<Navbar />
				<Outlet />
				<Footer />
			</div>
			<MobileNav />
		</div>
	);
};

export default RootLayouts;
