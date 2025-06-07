import { useTheme } from "./theme-provider";
import { Switch } from "@/components/ui/switch";

const ThemeToggler = () => {
	const { theme, setTheme } = useTheme();

	const handleToggle = (checked: boolean) => {
		setTheme(checked ? "light" : "dark");
	};

	return (
		<main className="flex gap-2 items-center justify-center">
			<p className="font-inter text-xs font-semibold">Change theme</p>
			<Switch checked={theme === "light"} onCheckedChange={handleToggle} />
		</main>
	);
};

export default ThemeToggler;
