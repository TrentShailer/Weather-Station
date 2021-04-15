import React from "react";
import { Container, Grid } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import StatCard from "./StatCard.js";
import Footer from "./Footer.js";
import axios from "axios";
import { withSnackbar } from "notistack";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: { temperature: 0, humidity: 0, windSpeed: 0, uv: 0, light: 0, pressure: 0 },
			updated: "2021-04-15 5:50pm NZT",
		};
		this.GetData = this.GetData.bind(this);
	}

	componentDidMount() {
		setInterval(this.GetData(), 100);
	}

	GetData = () => {
		axios
			.post("/GetData")
			.then((response) => {
				this.setState({ values: response.data.values, updated: response.data.updated });
			})
			.catch((error) => {
				this.props.enqueueSnackbar("Failed to fetch data.", { variant: "error" });
			});
	};

	render() {
		return (
			<div>
				<CssBaseline />
				<Container style={{ marginTop: 50 }}>
					<Grid container style={{ flexGrow: 1 }} spacing={10}>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={10}>
								<Grid item>
									<StatCard title="Temperature" value={this.state.values.temperature} unit="°C" />
								</Grid>
								<Grid item>
									<StatCard title="Humidity" value={this.state.values.humidity} unit="%" />
								</Grid>
								<Grid item>
									<StatCard title="Wind Speed" value={this.state.values.windSpeed} unit="km/h" />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={10}>
								<Grid item>
									<StatCard title="UV Index" value={this.state.values.uv} unit="" />
								</Grid>
								<Grid item>
									<StatCard title="Light Intensity" value={this.state.values.light} unit="Lux" />
								</Grid>
								<Grid item>
									<StatCard title="Air Pressure" value={this.state.values.pressure} unit="hPa" />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Container>
				<Footer time={this.state.updated} />
			</div>
		);
	}
}
export default withSnackbar(App);
