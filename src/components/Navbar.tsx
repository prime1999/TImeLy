import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import Logo from "./Logo";
import ThemeToggler from "./ThemeToggler";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getNotifications } from "@/lib/slice/NotificationSlice";
import Notifications from "./Notifications";

const Navbar = () => {
	const dispatch = useDispatch<AppDispatch>();
	// state for the notification modal
	const [open, setOpen] = useState<boolean>(true);

	const { isLoading, data } = useSelector((state: any) => state.notification);
	useEffect(() => {
		dispatch(getNotifications()).unwrap();
	}, [dispatch]);
	return (
		<nav className="">
			<div className="flex items-center justify-between p-4 lg:hidden">
				<Logo />
				<div>
					<FaBell className="text-green-400 text-2xl w-12 cursor-pointer" />
				</div>
			</div>
			<div className="hidden w-11/12 mx-auto p-2 items-center justify-between lg:flex">
				<Logo />
				<div>
					<ul className="flex items-center gap-8 text-md font-inter font-normal text-sm">
						<li>
							<Link
								to="/dashboard"
								className="duration-700 hover:text-green-400"
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link to="/" className="duration-700 hover:text-green-400">
								Classes
							</Link>
						</li>
						<li>
							<Link to="/" className="duration-700 hover:text-green-400">
								Exams
							</Link>
						</li>
						<li>
							<Link to="/courses" className="duration-700 hover:text-green-400">
								Courses
							</Link>
						</li>
					</ul>
				</div>
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-4">
						<Popover>
							<PopoverTrigger>
								<FaBell className="text-green-400 text-xl w-12 cursor-pointer" />
							</PopoverTrigger>
							<PopoverContent className="w-[400px] mt-4">
								<Notifications isLoading={isLoading} notifications={data} />
							</PopoverContent>
						</Popover>
						{/* for the profile */}
						<Popover>
							<PopoverTrigger>
								<BsPersonCircle className="text-green-400 text-xl w-12 cursor-pointer" />
							</PopoverTrigger>
							<PopoverContent className="w-[150px] py-2 px-2">
								<ul className="font-inter text-sm">
									<li className="group mb-4">
										<Link
											to="/"
											className="flex items-center gap-2 duration-700 group-hover:gap-4 group-hover:text-green-400"
										>
											<BsPersonCircle className="text-green-400 text-xl w-12 cursor-pointer" />
											<p>Profile</p>
										</Link>
									</li>
									<li className="flex items-center gap-2 duration-700  cursor-pointer hover:gap-4 hover:text-green-400">
										<BiLogOutCircle className="text-green-400 text-xl w-12 cursor-pointer" />
										<p>Log-Out</p>
									</li>
								</ul>
							</PopoverContent>
						</Popover>
					</div>
					<ThemeToggler />
				</div>
			</div>
			{/* <div className="relative">
				<Input
					type="text"
					placeholder="Search..."
					className="border border-slate-500 rounded-md p-2 w-full pl-8"
				/>
				<FaSearch className="absolute top-3 left-3 text-green-300" />
			</div> */}
		</nav>
	);
};

export default Navbar;
