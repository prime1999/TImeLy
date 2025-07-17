import type { E164Number } from "libphonenumber-js/core";
import { format } from "date-fns";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaCalendar } from "react-icons/fa";

export enum FormFieldType {
	input = "input",
	phone_input = "phoneInput",
	checkbox = "checkbox",
	select = "select",
	skeleton = "skeleton",
	textArea = "textarea",
	date = "date",
}
interface CustomProps {
	control: Control<any>;
	name: string;
	label?: string;
	type?: string;
	array?: any;
	inputMode?: string;
	placeholder?: string;
	pattern?: string;
	iconSrc?: any;
	isPasswordField?: boolean;
	handleShowPassword?: any;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
	fieldType: FormFieldType;
	class?: string;
	handleSelect?: any;
	disabled?: boolean;
	className?: string;
}

const RenderInput = ({ props, field }: { props: CustomProps; field: any }) => {
	console.log(props.array);
	switch (props.fieldType) {
		case FormFieldType.input:
			return (
				<div className="relative">
					{props.isPasswordField === true ? (
						<button
							type="button"
							onClick={props.handleShowPassword}
							className="absolute top-3 left-2 text-slate-500 cursor-pointer"
						>
							{props.iconSrc}
						</button>
					) : (
						<span className="absolute top-3 left-2 text-slate-500">
							{props.iconSrc}
						</span>
					)}
					<FormControl>
						<Input
							type={props.type}
							placeholder={props.placeholder}
							{...field}
							inputMode={props.inputMode}
							disabled={props.disabled}
							className={`shad-input border-1 pl-8 ${props.className}`}
						/>
					</FormControl>
				</div>
			);
		case FormFieldType.date:
			return (
				<FormControl className="w-full">
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<button
									className={`w-[240px] border border-gray-200 flex items-center p-2 rounded-md text-left font-inter text-xs dark:border-gray-400 ${
										!field.value && "text-muted-foreground"
									}`}
								>
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a date</span>
									)}
									<FaCalendar className="ml-auto h-4 w-4 opacity-50" />
								</button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								captionLayout="dropdown"
							/>
						</PopoverContent>
					</Popover>
				</FormControl>
			);
		case FormFieldType.textArea:
			return <Textarea placeholder={props.placeholder} {...field} />;
		case FormFieldType.phone_input:
			return (
				<FormControl className="w-full">
					<PhoneInput
						defaultCountry="NG"
						placeholder={props.placeholder}
						international
						withCountryCallingCode
						value={field.value as E164Number | undefined}
						onChange={field.onChange}
						className="mt-2 h-10 rounded-md px-3 text-sm border placeholder:text-dark-600 border-dark-500 focus:border-green-400 focus:ring-green-400 focus:shadow-green-400 focus:shadow-md dark:bg-[#151515] dark:text-white"
					/>
				</FormControl>
			);

		case FormFieldType.select:
			return (
				<Select
					onValueChange={(value) => {
						field.onChange(value); // Updates form state
						props.handleSelect?.(value); // Optional custom side effect
					}}
				>
					<SelectTrigger className={`w-full ${props.className}`}>
						<SelectValue placeholder={props.placeholder} />
					</SelectTrigger>
					<SelectContent>
						{props.array?.map((list: any, i: number) => (
							<SelectItem
								key={i}
								value={list.value}
								className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-800"
							>
								{list.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		case FormFieldType.skeleton:
			return props.renderSkeleton ? props.renderSkeleton(field) : null;
		default:
			return null;
	}
};

const CustomFormField = (props: CustomProps) => {
	const { control, label } = props;
	return (
		<main>
			<FormField
				control={control}
				name={props.name}
				render={({ field }) => (
					<FormItem>
						{props.fieldType !== FormFieldType.checkbox && label && (
							<FormLabel className="shad-input-label font-inter text-sm font-semibold">
								{label}
							</FormLabel>
						)}
						<RenderInput field={field} props={props} /> <FormMessage />
					</FormItem>
				)}
			/>
		</main>
	);
};

export default CustomFormField;
