import {
	createContext,
	useState,
	useEffect,
	type ReactNode,
	useContext,
} from "react";
import {
	fetchAchievements,
	fetchProject,
	fetchSupportedLangs,
	fetchTranslations,
} from "../lib/sheets";
import { useErrorBoundary } from "react-error-boundary";
import { fetchContributions } from "../lib/github";
import {
	defaultContributions,
	type Achievement,
	type Contributions,
	type Project,
	type SupportedLang,
	type Translations,
} from "../lib/schemas";

interface Content {
	supportedLangs: SupportedLang[];
	projects: Project[];
	achievements: Achievement[];
	translations: Translations;
	contributions: Contributions;
	currentLang: string;
}

const DataContext = createContext<
	| (Content & {
			isLoading: boolean;
			loadContentForLang: (langCode: string) => Promise<void>;
	  })
	| null
>(null);

export function DataProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<Content>({
		supportedLangs: [],
		projects: [],
		achievements: [],
		translations: {},
		contributions: defaultContributions,
		currentLang: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const { showBoundary } = useErrorBoundary();

	useEffect(() => {
		const loadData = async () => {
			try {
				const [supportedLangs, projects, achievements, contributions] =
					await Promise.all([
						fetchSupportedLangs(),
						fetchProject(),
						fetchAchievements(),
						fetchContributions(),
					]);

				setContent((prev) => ({
					...prev,
					supportedLangs,
					projects,
					achievements,
					contributions,
				}));
			} catch (erorr) {
				console.error("Error fetching data:", erorr);
				showBoundary(new Error("Failed to fetch data"));
			}
		};
		loadData();
	}, []);
	
	const loadContentForLang = async (langCode: string) => {
		setIsLoading(true);
		try {
			const langInfo = content.supportedLangs.find(
				(l) => l.code === langCode,
			);
			if (!langInfo) throw new Error("Unsupported language");

			// Fetch all data in parallel
			const translations = await fetchTranslations(langInfo.sheetName);
			setContent((prev) => ({
				...prev,
				translations,
				currentLang: langCode,
			}));
		} catch (erorr) {
			console.error("Error fetching data:", erorr);
			showBoundary(new Error("Failed to fetch data"));
		} finally {
			setIsLoading(false);
		}
	};

	const value = {
		...content,
		isLoading,
		loadContentForLang,
	};

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
}

export function useData() {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
}
