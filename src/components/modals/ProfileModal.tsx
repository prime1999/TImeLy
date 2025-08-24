import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
	BsPersonCircle,
	BsEnvelope,
	BsFillTelephoneFill,
} from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { getStudentProfile } from "@/lib/slice/StudentSlice";
import TableLoader from "@/lib/utils/tableLoader";
import UpdateProfileForm from "../forms/UpdateProfileForm";

type Props = {
	open: boolean;
	setOpen: any;
};

const ProfileModal = ({ open, setOpen }: Props) => {
	const [openUpdateProfileForm, setOpenUpdateProfileForm] =
		useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();
	const { data, isLoading } = useSelector((state: any) => state.student);

	useEffect(() => {
		dispatch(getStudentProfile());
	}, [dispatch]);
	return (
		<>
			<Dialog open={open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						{isLoading ? (
							<TableLoader />
						) : (
							<div>
								<div className="p-2 rounded-lg glassmorphism bg-[rgb(255,255,255,0.05)] border-[rgb(210,209,209)] shadow-[0_4px_30px_rgba(80,80,80,0.1)] border-1 dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgb(68,68,68)] dark:text-slate-400">
									<div className="flex items-start gap-2 font-inter font-normal">
										<BsPersonCircle className="text-4xl font-normal" />
										<div>
											<h3 className="flex items-center gap-2 font-semibold text-green-400">
												<span>{data?.name}</span>
												<MdEdit
													onClick={() =>
														setOpenUpdateProfileForm(!openUpdateProfileForm)
													}
													className="bg-green-400 text-slate-200 rounded-full w-5 h-5 text-xs p-1 cursor-pointer duration-500 hover:ml-2"
												/>
											</h3>
											<ul className="flex gap-2 items-center text-xs mt-1">
												<li>{data?.MatricNumber}</li>
												<li>|</li>
												<li>{data?.faculty}</li>
												<li>|</li>
												<li>{data?.department}</li>
												<li>|</li>
												<li>{data?.level} level</li>
											</ul>
										</div>
									</div>
									<hr className="my-6" />
									<div className="flex items-center justify-between px-4 font-inter font-semibold text-sm mb-4">
										<div>
											<h5 className="flex items-center gap-1 text-xs text-slate-700 font-extralight dark:text-slate-200">
												<BsEnvelope />
												<span>Email</span>
											</h5>
											<p className="text-xs font-normal mt-2 dark:text-slate-100">
												{data?.Email}
											</p>
										</div>
										<div>
											<h5 className="flex items-center gap-1 text-xs text-slate-700 font-extralight dark:text-slate-200">
												<BsFillTelephoneFill />
												<span>Phone-Number</span>
											</h5>
											<p className="text-xs font-normal mt-2 dark:text-slate-100">
												{data?.PhoneNumber}
											</p>
										</div>
									</div>
								</div>
								{openUpdateProfileForm && <UpdateProfileForm />}
							</div>
						)}
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<button
								onClick={() => setOpen(false)}
								className="font-inter w-full bg-red-400 rounded-md p-2 text-xs font-semibold text-white cursor-pointer duration-700 hover:bg-red-500"
							>
								Close
							</button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProfileModal;
