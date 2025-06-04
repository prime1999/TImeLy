import Link from "next/link";

const Footer = () => {
	return (
		<footer className="flex flex-col items-center justify-center text-xs font-inter text-gray-400 font-semibold pb-8">
			<p className="">©timelycopyright</p>

			<span className="flex items-center gap-2 text-sm">
				created by{" "}
				<Link
					href="https://portfolio-site-lac-six.vercel.app/"
					target="blank"
					className="font-mono text-green-500 text-lg font-bold duration-700 hover:text-green-700 dark:hover:text-green-600"
				>
					Eminence
				</Link>
			</span>
		</footer>
	);
};

export default Footer;
