"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { AppDispatch } from "@/lib/store";
import { getCurrentUser } from "@/lib/slice/StudentSlice";
import Logo from "./Logo";
import ThemeToggler from "./ThemeToggler";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BiLogOutCircle } from "react-icons/bi";
import { checkCurrentSession } from "@/lib/actions/Student.actions";

const Navbar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { isLoading, student } = useSelector((state: any) => state.student);

	const pathname = usePathname();
	// get the pathname from the current url
	const paths = pathname.split("/");
	useEffect(() => {
		const handleLoad = async () => {
			try {
				console.log("navbar");
				const student = await checkCurrentSession();
				// if not then redirect back to the register page
				console.log(student);
				if (!student) {
					router.push("/logIn");
				}
			} catch (error) {
				console.error("Failed to load user:", error);
			}
		};
		handleLoad();
	}, []);
	return (
		<nav className="">
			<div className="flex items-center justify-between p-4 lg:hidden">
				{" "}
				<Logo />
				<div>
					<FaBell className="text-green-400 text-2xl w-12 cursor-pointer" />
				</div>
			</div>
			<div className="hidden w-11/12 mx-auto p-2 items-center justify-between lg:flex">
				<Logo />
				<div>
					<ul className="flex items-center gap-8 text-md font-inter font-normal">
						<li>
							<Link href="/" className="duration-700 hover:text-green-400">
								Classes
							</Link>
						</li>
						<li>
							<Link href="/" className="duration-700 hover:text-green-400">
								Exams
							</Link>
						</li>
						<li>
							<Link href="/" className="duration-700 hover:text-green-400">
								Notes
							</Link>
						</li>
						<li>
							<Link
								href={`/students/${paths[2]}/courses`}
								className="duration-700 hover:text-green-400"
							>
								Courses
							</Link>
						</li>
					</ul>
				</div>
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-4">
						<FaBell className="text-green-400 text-xl w-12 cursor-pointer" />
						<Popover>
							<PopoverTrigger>
								<BsPersonCircle className="text-green-400 text-xl w-12 cursor-pointer" />
							</PopoverTrigger>
							<PopoverContent className="w-[150px] py-2 px-2">
								<ul className="font-inter text-sm">
									<li className="group mb-4">
										<Link
											href="/"
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
