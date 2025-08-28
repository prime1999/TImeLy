import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { UserSchema } from "@/lib/Validation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import Logo from "@/components/Logo";
import { AppDispatch } from "@/lib/store";
import { authUser } from "@/lib/slice/AuthSlice";
import { checkCurrentSession } from "@/lib/actions/Student.actions";
import note from "@/assets/images/Notebook-bro.png";
import SubmitButton from "@/lib/utils/SubmitButton";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const SignIn = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	// state to open/close the forgot password modal
	const [openForotPasswordModal, setOpenForgotPasswordModal] =
		useState<boolean>(false);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { isLoading } = useSelector((state: any) => state.auth);
	const form = useForm<z.infer<typeof UserSchema>>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkSession = async () => {
			try {
				const session = await checkCurrentSession();

				// if a session already exists
				if (session) {
					// redirect the student to his/her dashboard
					navigate(`/dashboard`);
				}
			} catch (error) {
				console.log(error);
			}
		};
		checkSession();
		// if(session && session?.status === true )
	}, []);

	const handleShowPassword = () => {
		setShowPassword(() => !showPassword);
	};

	// function to handle the form submittion
	const onSubmit = async (values: z.infer<any>) => {
		try {
			// get the email from the document and also the password from the form values
			const userData = {
				email: values.email,
				password: values.password,
			};
			// dispatch the function to authenticate the user
			const logInRes = (await dispatch(authUser(userData)).unwrap()) as any;
			console.log(logInRes);

			// redirect the user if the authentication is successful
			if (logInRes && logInRes.student?.id) {
				toast(logInRes.msg);
				navigate(`/dashboard`);
			} else {
				toast("Wrong User Credentials");
			}
		} catch (error) {
			toast("Wrong User Credentials");
			console.log(error);
		}
	};
	return (
		<main className="w-full h-[100vh] flex items-center justify-center glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-200">
			<div className="relative w-[400px] border border-gray-800 rounded-lg px-6 pb-12 pt-24 overflow-hidden">
				<img
					src={note}
					alt="writing image"
					className="absolute -top-20 -z-50 w-52 h-52"
				/>
				<Logo />
				<div className="mb-8">
					<h1 className="text-3xl font-inter font-semibold">Hi there 👋</h1>
					<p className="text-gray-300 text-sm mt-2">
						Time to check your schedule.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 w-full mx-auto"
					>
						{/* <CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="MatricNumber"
							label="Matric Number"
							placeholder="123456"
							type="number"
							inputMode="numeric"
							iconSrc={<MdNumbers />}
						/> */}
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="email"
							label="Email"
							placeholder="timely@example.com"
							type="email"
							iconSrc={<MdEmail />}
						/>
						<CustomFormField
							fieldType={FormFieldType.input}
							control={form.control}
							name="password"
							label="Create password"
							type={!showPassword ? "password" : "text"}
							isPasswordField={true}
							handleShowPassword={handleShowPassword}
							iconSrc={showPassword ? <FaEyeSlash /> : <FaEye />}
						/>
						<SubmitButton
							isLoading={isLoading}
							className="w-full bg-green-400 text-black rounded-lg font-inter font-bold"
						>
							Get Updated
						</SubmitButton>
					</form>
				</Form>
				<div className="flex justify-center items-center gap-2 text-sm mt-4 font-inter">
					<h4>Don't have an Account?</h4>
					<Link
						to="/register"
						className="font-semibold duration-500 hover:text-green-500"
					>
						Register
					</Link>
				</div>
				<span className="flex items-center justify-center mt-2">
					<button
						onClick={() => setOpenForgotPasswordModal(true)}
						className="text-xs text-center font-inter font-semibold cursor-pointer duration-700 hover:text-slate-400"
					>
						Forgot password
					</button>
				</span>
				<p className="text-xs font-inter text-center text-gray-400 font-semibold mt-4">
					©timelycopyright
				</p>
			</div>
			<Toaster />
			<ForgotPasswordModal
				open={openForotPasswordModal}
				setOpen={setOpenForgotPasswordModal}
			/>
		</main>
	);
};

export default SignIn;
