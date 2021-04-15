import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

function App() {
	const darkTheme = createMuiTheme({
		palette: {
			type: "dark",
		},
	});
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Button variant="contained" color="primary">
				Hello World
			</Button>
		</ThemeProvider>
	);
}
export default App;
