import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { MdEmail, MdNumbers } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { createUser } from "@/lib/slice/AuthSlice";
import { AppDispatch } from "@/lib/store";
import Alert from "@/lib/utils/Alert";
import SubmitButton from "@/lib/utils/SubmitButton";
import { CreateUserSchema } from "@/lib/Validation";

const CreateUserForm = () => {
	// get the auth loading state from the redux store
	const { isLoading } = useSelector((state: any) => state.auth);
	// init navigation
	const navigate = useNavigate();
	// init dispatch
	const dispatch = useDispatch<AppDispatch>();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const form = useForm<z.infer<typeof CreateUserSchema>>({
		resolver: zodResolver(CreateUserSchema),
		defaultValues: {
			MatricNumber: "" as any,
			email: "",
			password: "",
		},
	});

	const handleShowPassword = () => {
		setShowPassword(() => !showPassword);
	};

	// function to handle submission of form
	const onSubmit = async (values: z.infer<any>) => {
		try {
			const user = {
				MatricNumber: values.MatricNumber,
				email: values.email,
				password: values.password,
			};
			console.log("check");
			const newUser = (await dispatch(createUser(user))) as any;
			if (newUser.payload.student) {
				navigate(`students/${newUser?.payload?.student?.id as any}/register`);
			}
			// show error message from the server
			toast.error(newUser.payload.message, {
				className: "fixed top-[100]",
				style: { border: "red" },
			});
		} catch (error) {
			// show error message from the submission process (frontend)
			toast.error("Please try again", {
				className: "fixed top-10 right-10",
				style: { border: "red" },
			});
			console.log(error);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 w-full mx-auto"
			>
				<CustomFormField
					fieldType={FormFieldType.input}
					control={form.control}
					name="MatricNumber"
					label="Matric Number"
					placeholder="123456"
					type="number"
					inputMode="numeric"
					iconSrc={<MdNumbers />}
				/>

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
					Get Started
				</SubmitButton>
			</form>
			<Alert />
		</Form>
	);
};

export default CreateUserForm;
