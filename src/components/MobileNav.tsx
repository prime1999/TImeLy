"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome } from "react-icons/md";
import { BsBellFill, BsPersonCircle } from "react-icons/bs";
import { PiNotepadFill } from "react-icons/pi";

const MobileNav = () => {
	const [linkState, setLinkState] = useState<any>([
		{ name: "Home", icon: <MdHome />, isActive: false },
		{ name: "Shedule", icon: <PiNotepadFill />, isActive: false },
		{ name: "Notification", icon: <BsBellFill />, isActive: false },
		{ name: "Profile", icon: <BsPersonCircle />, isActive: false },
	]);

	const pathname = usePathname();
	// get the pathname from the current url
	const paths = pathname.split("/");
	return (
		<nav className="fixed bottom-0 w-full bg-black lg:hidden">
			<div className="w-10/12 mx-auto">
				<ul className="w-full flex justify-between items-center py-4">
					{linkState.map((link: any, i: number) => (
						<Link
							href={`/students/${paths[2]}/${
								link.name.toLowerCase() === "home"
									? link.name
									: link.name.toLowerCase()
							}`}
							key={i}
							className={`flex flex-col items-center justify-center gap-2 duration-700 hover:text-green-400 ${
								paths[3] === link.name.toLowerCase()
									? "text-green-400"
									: paths[3] === "dashboard" &&
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
		</nav>
	);
};

export default MobileNav;
