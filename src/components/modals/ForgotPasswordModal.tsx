import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { Input } from "../ui/input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import SubmitButton from "@/lib/utils/SubmitButton";
import { forgotPassword } from "@/lib/slice/AuthSlice";
import Alert from "@/lib/utils/Alert";

type Props = {
	open: boolean;
	setOpen: any;
};

const ForgotPasswordModal = ({ open, setOpen }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const [email, setEmail] = useState<string>("");
	const { isLoading } = useSelector((state: any) => state.auth);

	// function send the password recovery mail
	const handlePasswordRecovery = async (e: any) => {
		try {
			e.preventDefault();
			// check the input pattern
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			//if ie is an email pattern, then
			if (emailRegex.test(email)) {
				// call the dispatch function
				await dispatch(forgotPassword(email)).unwrap();
				setOpen(false);
				toast("Mail sent");
			} else {
				// if not, then
				toast("Invalid Email");
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<form onSubmit={handlePasswordRecovery}>
							<div className="flex flex-col gap-4 font-inter">
								<span className="text-sm text-slate-600 font-semibold dark:text-slate-300">
									<p>Enter your log in mail</p>
									<p className="mt-2">
										A mail will be sent to the provided email
									</p>
								</span>
								<Input
									type="text"
									placeholder="Your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<SubmitButton
									isLoading={isLoading}
									disableButton={email === "" ? true : false}
									className="w-full mt-2 bg-green-400 text-black rounded-lg font-inter font-bold"
								>
									Send mail
								</SubmitButton>
							</div>
						</form>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<button
								onClick={() => setOpen(false)}
								className="font-inter w-full bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
							>
								Cancel
							</button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Alert />
		</>
	);
};

export default ForgotPasswordModal;
