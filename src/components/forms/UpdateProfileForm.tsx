import { useState } from "react";
import { AppDispatch } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdNumbers } from "react-icons/md";
import { StudenFormSchema } from "@/lib/Validation";
import { levels } from "@/contants/Schools.info";
import { departmentsByFaculty, facultyNames } from "@/contants/Faculties.info";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "@/lib/utils/SubmitButton";
import Alert from "@/lib/utils/Alert";
import { updateStudentProfile } from "@/lib/slice/StudentSlice";

declare type Gender = "Male" | "Female";

const UpdateProfileForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [disableButton, setDisableButton] = useState<boolean>(false);

	const [departments, setdepartments] = useState<any>(null);

	const { isLoading, data } = useSelector((state: any) => state.student);
	const form = useForm<z.infer<typeof StudenFormSchema>>({
		resolver: zodResolver(StudenFormSchema),
		defaultValues: {
			email: data.Email,
			MatricNumber: data.MatricNumber,
			name: data.name,
			phone: data.PhoneNumber,
			school: data.school,
			faculty: data.faculty,
			department: data.department,
			level: data.level,
			gender: data.Gender as Gender,
		},
	});

	// function to handle the faculty selection to get the right departments
	const handleSelect = (value: string) => {
		const departments = departmentsByFaculty[value];
		setdepartments(departments);
	};

	const onSubmitForm = async (values: z.infer<typeof StudenFormSchema>) => {
		try {
			const profileData: any = {
				MatricNumber:
					values.MatricNumber?.toString() !== data.MatricNumber.toString()
						? values.MatricNumber
						: null,
				name: values.name !== data.name ? values.name : null,
				phone: values.phone !== data.PhoneNumber ? values.phone : null,
				faculty: values.faculty !== data.faculty ? values.faculty : null,
				department:
					values.department !== data.department ? values.department : null,
				level:
					values.level.toString() !== data.level.toString()
						? values.level
						: null,
			};
			console.log({
				profileData,
			});
			// check if the user changed anything in the pofile
			for (const key in profileData) {
				if (profileData[key] === null) {
					delete profileData[key];
				}
			}
			// check if the profileData is not empty
			if (Object.keys(profileData).length > 0) {
				setDisableButton(true);
				// call the redux function to update the profile
				const res: any = await dispatch(
					updateStudentProfile(profileData)
				).unwrap();
				if (res && res.$id) {
					// show error message from the server
					toast("Profile Updated");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<main className="h-[300px] mt-4 overflow-auto scrollable-div">
			<h4 className="font-inter text-md text-green-400 font-semibold">
				Edit Your Profile
			</h4>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmitForm)}
					className="space-y-6 w-full mx-auto"
				>
					<div className="flex flex-col items-center gap-4 w-full mt-4">
						<div className="w-full">
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
						</div>
						<div className="w-full">
							<CustomFormField
								fieldType={FormFieldType.input}
								control={form.control}
								name="name"
								label="Name"
								placeholder="ex: John Doe"
								type="text"
								iconSrc={<IoPersonCircleOutline />}
							/>
						</div>

						<div className="w-full">
							<CustomFormField
								fieldType={FormFieldType.phone_input}
								control={form.control}
								name="phone"
								label="Phone Number"
								placeholder="(555) 123-4567"
							/>
						</div>
						<div className="w-full">
							<CustomFormField
								fieldType={FormFieldType.select}
								control={form.control}
								name="faculty"
								array={facultyNames}
								label="Faculty"
								handleSelect={handleSelect}
								placeholder="faculty"
								defaultValue={data.faculty}
							/>
						</div>
						<div className="w-full flex gap-2">
							{" "}
							<div className="w-1/2">
								<CustomFormField
									fieldType={FormFieldType.select}
									control={form.control}
									name="department"
									label="Department"
									placeholder="department"
									array={departments}
									defaultValue={data.department}
								/>
							</div>
							<div className="w-1/2">
								<CustomFormField
									fieldType={FormFieldType.select}
									control={form.control}
									name="level"
									label="Level"
									placeholder="level"
									array={levels}
									defaultValue={data.level}
								/>
							</div>
						</div>
						<SubmitButton
							isLoading={isLoading}
							disableButton={disableButton}
							className="w-full bg-green-400 text-black rounded-lg font-inter font-bold"
						>
							Update Profile
						</SubmitButton>
					</div>
				</form>
			</Form>
			<Alert />
		</main>
	);
};

export default UpdateProfileForm;
