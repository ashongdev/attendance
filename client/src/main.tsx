import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ContextProvider from "./context/AppContextProvider.tsx";
import Styles from "./exports/Styles.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ContextProvider>
			{/* For rendering stylesheets */}
			<Styles />

			<App />
		</ContextProvider>
	</StrictMode>
);
