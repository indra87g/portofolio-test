import {
	useState,
	useEffect,
	createContext,
	useContext,
	type ReactNode,
} from "react";

const ThemeContext = createContext<{
	darkMode: boolean;
	setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [darkMode, setDarkMode] = useState<boolean>(
		localStorage.getItem("theme") === "dark",
	);

	// Set the initial theme
	useEffect(() => {
		const theme = darkMode ? "dark" : "light";
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("theme", theme);
	}, [darkMode]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleThemeChange = (e: MediaQueryListEvent) => {
			setDarkMode(e.matches);
		};

		mediaQuery.addEventListener("change", handleThemeChange);
		return () =>
			mediaQuery.removeEventListener("change", handleThemeChange);
	}, []);

	return (
		<ThemeContext.Provider value={{ darkMode, setDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
