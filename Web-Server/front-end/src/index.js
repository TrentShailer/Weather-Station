import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

const darkTheme = createMuiTheme({
	palette: {
		type: "dark",
	},
});
ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<SnackbarProvider
				autoHideDuration={3000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				maxSnack={3}
			>
				<App />
			</SnackbarProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
