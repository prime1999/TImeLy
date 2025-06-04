import {
	MdOutlineSchedule,
	MdArrowCircleRight,
	MdNoteAlt,
} from "react-icons/md";
import { PiClockCountdownFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { PiNotepadFill } from "react-icons/pi";

// schedule slide
export const Schedule = () => {
	return (
		<div className="w-full h-full p-4 bg-gray-900 rounded-md">
			<div className="flex justify-between items-center text-gray-200">
				<h4 className="font-inter font-semibold text-md">Schedule</h4>
				<PiNotepadFill className="text-md text-green-400 font-semibold" />
			</div>
			<p className="text-xs font-inter text-slate-300 mt-4">
				{/* TODO  show next course on the time-table*/}Your next course will
				show here
			</p>
			<span className="flex items-center gap-2 mt-6 cursor-pointer group">
				<p className="text-xs font-inter text-slate-300 font-semibold cursor-pointer duration-500 group-hover:text-slate-400">
					See all today's courses
				</p>
				<MdArrowCircleRight className="text-md text-green-400 mt-1 duration-1000 group-hover:ml-2" />
			</span>
		</div>
	);
};
// count down slide
export const CountDown = () => {
	return (
		<div className="flex flex-col justify-center items w-full h-full p-4 bg-gray-900 rounded-md lg:h-48 lg:gap-4">
			<div className="flex justify-between items-center text-gray-200">
				<h4 className="font-inter font-semibold text-md text-gray-200 lg:text-2xl">
					Count-Down
				</h4>
				<PiClockCountdownFill className="text-lg text-green-400 font-semibold lg:text-2xl" />
			</div>
			<p className="text-lg font-inter text-green-400 font-bold mt-4">
				{/* TODO  show count down to next examination*/}100 Days
			</p>

			<p className="text-sm font-inter text-slate-300 font-semibold mt-2">
				To your next examination
			</p>
		</div>
	);
};
// notes slide
export const Notes = () => {
	return (
		<div className="w-full h-full p-4 bg-gray-900 rounded-md">
			<div className="flex justify-between items-center text-gray-200">
				<h4 className="font-inter font-semibold text-md">Notes</h4>
				<MdNoteAlt className="text-md text-green-400 font-semibold" />
			</div>
			<span className="flex justify-between items-center text-xs font-inter mt-4">
				<p className="text-xs font-inter text-slate-300">
					{/* TODO  show students notes*/}Your notes will show here
				</p>
				<button className="text-green-400 font-semibold cursor-pointer duration-700 hover:text-green-500">
					See all
				</button>
			</span>
			<span className="flex items-center gap-2 mt-6 cursor-pointer group">
				<p className="text-xs font-inter text-slate-300 font-semibold cursor-pointer duration-500 group-hover:text-slate-400">
					Add more notes
				</p>
				<FaCirclePlus className="text-md text-green-400 mt-1 duration-1000 group-hover:ml-2" />
			</span>
		</div>
	);
};
// courses slide
export const Courses = () => {
	return (
		<div className="flex flex-col justify-center items w-full h-full p-4 bg-gray-900 rounded-md lg:h-48 lg:gap-4">
			<div className="flex justify-between items-center text-gray-200">
				<h4 className="font-inter font-semibold text-md lg:text-2xl">
					Your Courses
				</h4>
				<MdNoteAlt className="text-md text-green-400 font-semibold lg:text-2xl" />
			</div>
			<span className="flex justify-between items-center text-xs font-inter mt-4 lg:text-lg">
				<p className="text-xs font-inter text-slate-300 lg:text-md">
					{/* TODO  show students courses*/}Your courses will show here
				</p>
				<button className="text-green-400 font-semibold cursor-pointer duration-700 hover:text-green-500">
					See all
				</button>
			</span>
			<span className="flex items-center gap-2 mt-6 cursor-pointer group">
				<p className="text-xs font-inter text-slate-300 font-semibold cursor-pointer duration-500 group-hover:text-slate-400 lg:text-sm">
					Add more courses
				</p>
				<FaCirclePlus className="text-md text-green-400 mt-1 duration-1000 group-hover:ml-2" />
			</span>
		</div>
	);
};
