import registerImg from "../assets/images/inputprofile.jpg";
import StudentForm from "@/components/forms/StudentForm";
import Logo from "@/components/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getCurrentUser } from "@/lib/slice/StudentSlice";

const Register = () => {
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	// get the pathname from the current url
	const paths = location.pathname.split("/");

	useEffect(() => {
		// function to check if the user has created an account
		const handleLoad = async () => {
			try {
				const student: any = await dispatch(getCurrentUser(paths[3])).unwrap();
				// if not then redirect back to the register page
				if (!student?.email || !student?.matricNumber) {
					navigate("/register");
				}
			} catch (error) {
				console.error("Failed to load user:", error);
			}
		};

		handleLoad();
	}, []);
	return (
		<main className="flex justify-center items-center h-screen w-[100vw] overflow-hidden">
			<div className="flex w-full h-full mx-auto justify-between gap-4 overflow-y-hidden">
				<div className="w-full h-full flex items-center justify-center mb-4 lg:w-7/12 scrollable-div">
					{" "}
					<div className="w-full h-full p-4 mx-auto flex flex-col overflow-y-auto scrollable-div lg:w-11/12 lg:p-12 xl:w-full xl:px-24 xl:py-12">
						<Logo />
						<div className="mt-8">
							<div className="mb-12">
								<h1 className="text-3xl font-inter font-semibold">
									Welcome 👋
								</h1>
								<p className="text-gray-400 text-sm mt-2">
									Let's know more about you.
								</p>
							</div>
							<StudentForm />
						</div>
						<p className="text-xs font-inter text-gray-400 font-semibold my-8">
							©timelycopyright
						</p>
					</div>
				</div>
				<div
					style={{
						backgroundImage: `url(${registerImg})`,
						backgroundSize: "cover",
					}}
					className="h-full lg:w-1/2"
				></div>
			</div>
		</main>
	);
};

export default Register;
