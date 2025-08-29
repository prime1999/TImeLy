import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import Alert from "@/lib/utils/Alert";

type Props = {
	open: boolean;
	setOpen: any;
};

const ReportBugModal = ({ open, setOpen }: Props) => {
	const [message, setMessage] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [status, setStatus] = useState<boolean>(false);
	// function to send the message
	const sendMessage = async () => {
		const body = {
			title,
			message,
		};
		setStatus(true);
		const res = await fetch("http://localhost:5000/send-email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		setStatus(false);
		const data = await res.json();
		console.log(data);
	};
	return (
		<main className="glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(234,234,234)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 flex flex-col justify-center items p-4 text-gray-800 rounded-md dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400 lg:gap-4">
			<Dialog open={open}>
				<DialogContent className="font-inter text-gray-600 sm:max-w-[425px] dark:text-gray-400">
					<div>
						<div className="flex justify-center items-center gap-8 font-inter text-xs text-slate-900 font-semibold">
							<button
								onClick={() => setTitle("Report a bug")}
								className="bg-green-400 rounded-full px-4 py-2 cursor-pointer duration-500 hover:bg-green-600"
							>
								Report a bug
							</button>
							<button
								onClick={() => setTitle("Suggest an update")}
								className="bg-green-400 rounded-full px-4 py-2 cursor-pointer duration-500 hover:bg-green-600"
							>
								Suggest an update
							</button>
						</div>
						<div className="mt-4">
							<h6 className="font-inter text-slate-700 text-sm dark:text-slate-300 mb-2">
								Your message
							</h6>
							<Textarea onChange={(e) => setMessage(e.target.value)} />
						</div>
					</div>
					<DialogFooter className="flex flex-col">
						<div className="w-full flex flex-col font-inter text-xs font-semibold">
							<button
								onClick={() => sendMessage()}
								className={`w-full rounded-md p-2 text-gray-200  ${
									status
										? "bg-green-700 cursor-none"
										: "bg-green-500  cursor-pointer duration-700 hover:bg-green-600"
								}`}
							>
								Send report
							</button>
							<button
								onClick={() => setOpen(false)}
								className="w-full bg-red-500 mt-2 p-2 rounded-md text-gray-200 cursor-pointer duration-700 hover:bg-red-600"
							>
								Close
							</button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Alert />
		</main>
	);
};

export default ReportBugModal;
