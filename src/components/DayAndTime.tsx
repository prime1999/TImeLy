import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdTextFields } from "react-icons/md";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { TimePickerInput } from "@/lib/utils/TimePickerInput";
import { Period } from "@/lib/utils/TimePicker";
import { TimePeriodSelect } from "@/lib/utils/PeriodInput";

const DayAndTime = ({ ...props }: any) => {
	const [period, setPeriod] = useState<Period>("AM");
	const minuteRef = useRef<HTMLInputElement>(null);
	const hourRef = useRef<HTMLInputElement>(null);
	const secondRef = useRef<HTMLInputElement>(null);
	const periodRef = useRef<HTMLButtonElement>(null);

	return (
		<div>
			<div className="flex flex-col gap-2 items-start">
				<CustomFormField
					fieldType={FormFieldType.select}
					control={props.form.control}
					name="days"
					array={props.array}
					label="Lecture Days"
					handleSelect={(value: string) => props.setDay(value)}
					placeholder="day of lecture"
					className="w-[300px]"
				/>
				<CustomFormField
					fieldType={FormFieldType.input}
					control={props.form.control}
					name="venue"
					label="Lecture Venue"
					// onChange={(value: string) => props.setVenue(value)}
					placeholder="Venue of Lecture"
					iconSrc={<MdTextFields />}
					className="w-[300px]"
				/>
				<div className="flex flex-col gap-2">
					{/* ------------------------ for the startTime --------------------------- */}
					<div className="flex flex-col items-start gap-2">
						<h4 className="text-sm font-inter font-semibold">Start-time</h4>
						<div className="flex items-center gap-2">
							<div className="grid gap-1 text-center">
								<TimePickerInput
									picker="hours"
									date={props.startDate}
									setDate={props.setStartDate}
									ref={hourRef}
									onRightFocus={() => minuteRef.current?.focus()}
								/>
							</div>
							<div className="grid gap-1 text-center">
								<TimePickerInput
									picker="minutes"
									date={props.startDate}
									setDate={props.setStartDate}
									ref={minuteRef}
									onLeftFocus={() => hourRef.current?.focus()}
									onRightFocus={() => secondRef.current?.focus()}
								/>
							</div>
							<div className="grid gap-1 text-center">
								<TimePeriodSelect
									period={period}
									setPeriod={setPeriod}
									date={props.startDate}
									setDate={props.setStartDate}
									ref={periodRef}
									onLeftFocus={() => secondRef.current?.focus()}
								/>
							</div>
						</div>
					</div>
					{/* ------------------------ for the endTime --------------------------- */}
					<div className="flex flex-col items-start gap-2">
						<h4 className="text-sm font-inter font-semibold">End-time</h4>
						<div className="flex items-center gap-2">
							<div className="grid gap-2 text-center">
								<TimePickerInput
									picker="hours"
									date={props.endDate}
									setDate={props.setEndDate}
									ref={hourRef}
									onRightFocus={() => minuteRef.current?.focus()}
								/>
							</div>
							<div className="grid gap-1 text-center">
								<TimePickerInput
									picker="minutes"
									date={props.endDate}
									setDate={props.setEndDate}
									ref={minuteRef}
									onLeftFocus={() => hourRef.current?.focus()}
									onRightFocus={() => secondRef.current?.focus()}
								/>
							</div>
							<div className="grid gap-1 text-center">
								<TimePeriodSelect
									period={period}
									setPeriod={setPeriod}
									date={props.endDate}
									setDate={props.setEndDate}
									ref={periodRef}
									onLeftFocus={() => secondRef.current?.focus()}
								/>
							</div>
							<button
								onClick={props.handleSetDate}
								className="w-full font-inter bg-green-500 rounded-md p-2 px-4 text-black font-semibold duration-700 cursor-pointer hover:bg-green-700"
							>
								Set
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* -------------- show chosen time ---------------- */}
			<div className="flex gap-2 items-center flex-wrap">
				{props.schedule.length !== 0 &&
					props.schedule.map((list: any, i: number) => (
						<div
							key={i}
							className="flex items-center gap-2 font-semibold mt-2 p-2 bg-green-400 rounded-md font-inter text-xs text-black"
						>
							<div>
								<h6>{list.venue}</h6>
							</div>
							<div>
								<h6>{list.day}</h6>
							</div>
							<div>
								<p>{`${list.startDate} - ${list.endDate}`}</p>
							</div>
							<span
								onClick={() =>
									props.removeSchedule(list.day, list.startDate, list.endDate)
								}
								className="ml-4 text-white text-sm cursor-pointer duration-500 hover:rotate-45"
							>
								<FaTrash />
							</span>
						</div>
					))}
			</div>
		</div>
	);
};

export default DayAndTime;
