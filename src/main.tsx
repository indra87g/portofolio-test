import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { DataProvider } from "./contexts/DataContext.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider>
				{/* because ErrorPage use useTheme */}
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<DataProvider>
						<App />
					</DataProvider>
				</ErrorBoundary>
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>,
);
