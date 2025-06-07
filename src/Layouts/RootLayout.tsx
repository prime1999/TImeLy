import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

const RootLayouts = () => {
	return (
		<div className="flex flex-col min-h-screen m-0">
			<div className="grow mb-8">
				<Navbar />
				<Outlet />
				<MobileNav />
				<Footer />
			</div>
		</div>
	);
};

export default RootLayouts;
