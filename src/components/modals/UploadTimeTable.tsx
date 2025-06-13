import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { AppDispatch } from "@/lib/store";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { RiFileExcel2Fill } from "react-icons/ri";
import { checkTimeTable, createTimetable } from "@/lib/slice/TimeTableSlice";
import ConfirmationModal from "./ConfirmationModal";
import Button from "@/lib/utils/Button";

const UploadTimeTable = ({ open, setOpen }: any) => {
	// state for the confirmation modal
	const [openModal, setOpenModal] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();
	const [parsedData, setParsedData] = useState([]);
	// get the time table stor destails from the redux store
	const { isLoading } = useSelector((state: any) => state.timeTable);

	const onDrop = useCallback((acceptedFiles: any) => {
		if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0];
		const reader = new FileReader();

		reader.onload = (event: any) => {
			const binaryStr = event?.target.result;
			const workbook = XLSX.read(binaryStr, { type: "binary" });

			// Assuming you want to process the first sheet
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];

			// Convert the sheet to a 2D array
			const data: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });
			console.log("Extracted Data:", data);

			// Store as stringified array
			setParsedData(data);
		};
		console.log(parsedData);

		reader.readAsArrayBuffer(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/vnd.ms-excel": [".xls"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
		},
	});

	// function to dispatch the upload time table function
	const handleUpload = async () => {
		try {
			if (parsedData.length < 1)
				// TODO
				//show msg
				return;
			// check if th etime table for the department is already in the DB
			const timeTable = await dispatch(checkTimeTable("faculty")).unwrap();
			if (timeTable && timeTable.exist === true) {
				setOpen(false);
				setOpenModal(true);
				return;
			}
			// if the parsedData is ready, then
			await dispatch(createTimetable(JSON.stringify(parsedData))).unwrap();
			// TODO
			// show success msg
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdate = () => {};

	return (
		<>
			<Dialog open={open}>
				<DialogContent className="font-inter text-gray-600 sm:max-w-[425px] dark:text-gray-400">
					<DialogHeader>
						<DialogTitle className="text-black dark:text-gray-200">
							Upload Time Table
						</DialogTitle>
						<hr />
						<div>
							<p className="text-xs font-semibold">
								You can only upload time table{" "}
								<span className="capitalize font-bold text-gray-800 dark:text-white">
									pertaining to your faculty
								</span>{" "}
								or department.
							</p>
							<p className="text-xs mt-2 font-semibold">
								Any update made is solely done by you, So make sure you are
								about to upload the right time table
							</p>
							<div className="flex flex-col items-center">
								<div
									{...getRootProps()}
									className="flex items-center justify-center mt-4 w-full h-40 border-1 border-dashed border-green-500 rounded cursor-pointer focus:outline-none"
								>
									<input {...getInputProps()} />
									{isDragActive && parsedData.length < 1 ? (
										<div className="flex flex-col gap-2 items-center justify-center">
											<RiFileExcel2Fill className="text-2xl text-green-400" />
											<p className="text-xs">Drop the Excel file here...</p>
										</div>
									) : !isDragActive && parsedData.length < 1 ? (
										<div className="flex flex-col gap-2 items-center justify-center">
											<RiFileExcel2Fill className="text-2xl text-green-400" />
											<p className="text-xs">
												Drag & drop an Excel file here, or click to select
											</p>
										</div>
									) : (
										parsedData.length > 0 && (
											<div className="flex flex-col justify-center items-center gap-2">
												<RiFileExcel2Fill className="text-2xl text-green-400" />
												<p className="text-sm text-gray-700 dark:text-gray-300">
													Time-table file to be uploaded
												</p>
											</div>
										)
									)}
								</div>

								{/* {parsedData.length > 0 && (
									<div className="mt-4 w-full bg-gray-100 p-4 rounded">
										<h2 className="text-lg font-semibold mb-2">
											Extracted Data (JSON):
										</h2>
										<pre className="overflow-auto max-h-60">
											{JSON.stringify(parsedData, null, 2)}
										</pre>
									</div>
								)} */}
							</div>
						</div>
					</DialogHeader>
					<DialogFooter>
						<Button
							isLoading={isLoading}
							handleFunction={handleUpload}
							className="w-1/2 bg-green-400 rounded-md p-2 text-black font-inter text-sm font-semibold"
						>
							Upload
						</Button>

						<button
							onClick={() => setOpen(false)}
							className="w-1/2 bg-red-400 rounded-md p-2 text-sm text-white cursor-pointer duration-700 hover:bg-red-500"
						>
							Cancel
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<ConfirmationModal
				open={openModal}
				setOpen={setOpenModal}
				handleUpdate={handleUpdate}
			>
				<div className="text-xs font-semibold">
					<h4 className="text-sm">
						The Time table for the Faculty already exists.
					</h4>
					<hr className="my-2" />
					<h6>
						Do you want to change the time table with the new time-tble data
						submitted?
					</h6>
				</div>
			</ConfirmationModal>
		</>
	);
};

export default UploadTimeTable;
