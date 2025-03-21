import { StrictMode } from "react";
import { CookiesProvider } from "react-cookie";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ContextProvider from "./context/AppContextProvider.tsx";
import Styles from "./exports/Styles.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CookiesProvider defaultSetOptions={{ path: "/" }}>
			<ContextProvider>
				{/* For rendering stylesheets */}
				<Styles />

				<App />
			</ContextProvider>
		</CookiesProvider>
	</StrictMode>
);
