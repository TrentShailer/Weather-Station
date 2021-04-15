import React from "react";
import { Container, Grid, Dialog, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import StatCard from "./StatCard.js";
import Footer from "./Footer.js";
import axios from "axios";
import { withSnackbar } from "notistack";

import {
	faThermometerHalf,
	faCloudShowersHeavy,
	faCloudDownloadAlt,
	faSun,
	faLightbulb,
	faWind,
	faTint,
	faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ResponsiveLine } from "@nivo/line";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: {
				temperature: 0,
				humidity: 0,
				windSpeed: 0,
				uv: 0,
				light: 0,
				pressure: 0,
				weather: "",
			},
			updated: "",
			openGraph: false,
			theme: {
				background: "#424242",
				textColor: "#e0e0e0",
				fontSize: 12,
				axis: {
					domain: {
						line: {
							stroke: "#777777",
							strokeWidth: 2,
						},
					},
					ticks: {
						line: {
							stroke: "#777777",
							strokeWidth: 1,
						},
					},
				},
				grid: {
					line: {
						stroke: "#dddddd",
						strokeWidth: 0.5,
					},
				},
				tooltip: {
					container: {
						background: "#212121",
					},
				},
			},
			data: [],
			dataValue: "",
			dataUnit: "",
		};
		this.GetData = this.GetData.bind(this);
		this.CloseGraph = this.CloseGraph.bind(this);
		this.OpenGraph = this.OpenGraph.bind(this);
	}

	GetData() {
		axios
			.post("/GetData")
			.then((response) => {
				this.setState({ values: response.data.values, updated: response.data.updated });
			})
			.catch((error) => {
				this.props.enqueueSnackbar("Failed to fetch data.", { variant: "error" });
			});
	}

	componentDidMount() {
		this.GetData();
		setInterval(this.GetData, 60000);
	}

	CloseGraph = () => {
		this.setState({ openGraph: false });
	};

	OpenGraph = (unit, dataValue) => {
		axios
			.post(`/Get${dataValue}`)
			.then((response) => {
				this.setState({
					unit: unit,
					dataValue: dataValue,
					data: response.data.data,
					openGraph: true,
				});
			})
			.catch((error) => {
				this.props.enqueueSnackbar("Failed to fetch data.", { variant: "error" });
			});
	};

	render() {
		return (
			<div>
				<CssBaseline />
				<Dialog maxWidth="xl" fullScreen open={this.state.openGraph} onClose={this.CloseGraph}>
					<DialogTitle>{this.state.dataValue}</DialogTitle>
					<DialogContent>
						<ResponsiveLine
							theme={this.state.theme}
							data={this.state.data}
							margin={{ top: 50, right: 60, bottom: 100, left: 100 }}
							xScale={{ type: "point" }}
							yScale={{
								type: "linear",
								min: 0,
								max: "auto",
								stacked: false,
								reverse: false,
							}}
							yFormat={(value) => `${Number(value)}${this.state.dataUnit}`}
							curve="monotoneX"
							axisTop={null}
							axisRight={null}
							axisBottom={{
								orient: "bottom",
								tickSize: 5,
								tickPadding: 5,
								tickRotation: -45,
								legend: "Date",
								legendOffset: 75,
								legendPosition: "middle",
							}}
							axisLeft={{
								orient: "left",
								tickSize: 5,
								tickPadding: 5,
								tickRotation: 0,
								legend: this.state.dataValue,
								legendOffset: -75,
								legendPosition: "middle",
								format: (value) => `${Number(value)}${this.state.dataUnit}`,
							}}
							colors={{ scheme: "accent" }}
							pointSize={10}
							pointColor={{ from: "color", modifiers: [] }}
							pointBorderColor={{ from: "serieColor", modifiers: [] }}
							pointLabelYOffset={-12}
							enableArea={true}
							useMesh={true}
						/>
					</DialogContent>
				</Dialog>
				<IconButton onClick={this.GetData} style={{ position: "absolute", marginLeft: 20 }}>
					<FontAwesomeIcon color="#2196f3" icon={faRedoAlt} />
				</IconButton>
				<Container style={{ marginTop: 50 }}>
					<Grid container style={{ flexGrow: 1 }} spacing={8}>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={10}>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faThermometerHalf}
										title="Temperature"
										value={this.state.values.temperature}
										unit="°C"
									/>
								</Grid>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faTint}
										title="Humidity"
										value={this.state.values.humidity}
										unit="%"
									/>
								</Grid>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faCloudShowersHeavy}
										title="Weather"
										value={this.state.values.weather}
										unit=""
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={10}>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faWind}
										title="Wind Speed"
										value={this.state.values.windSpeed}
										unit=" km/h"
									/>
								</Grid>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faLightbulb}
										title="Light Intensity"
										value={this.state.values.light}
										unit=" Lux"
									/>
								</Grid>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faSun}
										title="UV Index"
										value={this.state.values.uv}
										unit=""
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={10}>
								<Grid item>
									<StatCard
										OpenGraph={this.OpenGraph}
										icon={faCloudDownloadAlt}
										title="Air Pressure"
										value={this.state.values.pressure}
										unit=" hPa"
									/>
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
