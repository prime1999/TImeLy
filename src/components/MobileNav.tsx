"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { BsBellFill, BsPersonCircle } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { PiNotepadFill } from "react-icons/pi";

const MobileNav = () => {
	const [linkState, setLinkState] = useState<any>([
		{ name: "dashboard", icon: <MdHome />, isActive: false },
		{ name: "Shedule", icon: <PiNotepadFill />, isActive: false },
		{ name: "Courses", icon: <FaBookOpen />, isActive: false },
		{ name: "Profile", icon: <BsPersonCircle />, isActive: false },
	]);

	const location = useLocation();
	// get the pathname from the current url
	const paths = location.pathname.split("/");
	return (
		<nav className="fixed bottom-2 w-full lg:hidden">
			<div className="glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-100">
				<div className="w-10/12 mx-auto">
					<ul className="w-full flex justify-between items-center py-4">
						{linkState.map((link: any, i: number) => (
							<Link
								to={`/${
									link.name.toLowerCase() === "dashboard"
										? link.name
										: link.name.toLowerCase()
								}`}
								key={i}
								className={`flex flex-col items-center justify-center gap-2 duration-700 hover:text-green-400 ${
									paths[1] === link.name.toLowerCase()
										? "text-green-400"
										: paths[1] === "dashboard" &&
										  link.name.toLowerCase() === "home" &&
										  "text-green-400"
								}`}
							>
								<span className="text-2xl">{link.icon}</span>
								<p className="text-sm font-inter">{link.name}</p>
							</Link>
						))}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default MobileNav;
