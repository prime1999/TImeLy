import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { MdHome } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa";
import { PiNotepadFill } from "react-icons/pi";
import { logUserOut } from "@/lib/slice/AuthSlice";
import ProfileModal from "./modals/ProfileModal";

const MobileNav = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
	const [linkState, setLinkState] = useState<any>([
		{ name: "dashboard", icon: <MdHome />, isActive: false },
		{ name: "Exam", icon: <PiNotepadFill />, isActive: false },
		{ name: "Courses", icon: <FaBookOpen />, isActive: false },
	]);

	const location = useLocation();
	// get the pathname from the current url
	const paths = location.pathname.split("/");

	// function to log a user out
	const logOutUser = async () => {
		try {
			await dispatch(logUserOut());
			navigate(`/signIn`);
		} catch (error) {
			console.log(error);
		}
	};
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
						<li>
							{/* for the profile */}
							<Popover>
								<PopoverTrigger>
									<span className="flex flex-col items-center justify-center gap-2 text-2xl duration-700 hover:text-green-400">
										<BsPersonCircle className="" />
										<p className="text-xs">Account</p>
									</span>
								</PopoverTrigger>
								<PopoverContent className="w-[150px] py-2 px-2">
									<ul className="font-inter text-xs">
										<li className="group mb-4">
											<button
												onClick={() => setOpenProfileModal(true)}
												className="flex items-center gap-2 duration-700 group-hover:gap-4 group-hover:text-green-400"
											>
												<BsPersonCircle className="text-green-400 text-lg w-12 cursor-pointer" />
												<p>Profile</p>
											</button>
										</li>
										<li
											onClick={() => logOutUser()}
											className="flex items-center gap-2 duration-700  cursor-pointer hover:gap-4 hover:text-green-400"
										>
											<BiLogOutCircle className="text-green-400 text-lg w-12 cursor-pointer" />
											<p>Log-Out</p>
										</li>
									</ul>
								</PopoverContent>
							</Popover>
						</li>
					</ul>
				</div>
			</div>
			<ProfileModal open={openProfileModal} setOpen={setOpenProfileModal} />
		</nav>
	);
};

export default MobileNav;
