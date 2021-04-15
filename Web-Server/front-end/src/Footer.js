import React from "react";
import { Typography, Grid, IconButton } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		window.addEventListener("resize", () => {
			this.forceUpdate();
		});
	}

	ExtraInfo(props) {
		return (
			<Grid
				style={{ flexGrow: 1, position: "fixed", bottom: 0, paddingLeft: 20, paddingRight: 20 }}
				container
				justify="space-between"
				alignItems="center"
			>
				<Grid item>
					<Typography color="textSecondary">Made by Trent Shailer</Typography>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">Updated {props.time}</Typography>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">Palmerston North, New Zealand</Typography>
				</Grid>

				<Grid item>
					<IconButton href="https://github.com/TrentShailer/Weather-Station">
						<GitHubIcon />
					</IconButton>
				</Grid>
			</Grid>
		);
	}

	BasicInfo(props) {
		return (
			<Grid
				style={{ flexGrow: 1, position: "fixed", bottom: 0, paddingLeft: 20, paddingRight: 20 }}
				container
				justify="space-between"
				alignItems="center"
			>
				<Grid item>
					<Typography color="textSecondary">Made by Trent Shailer</Typography>
				</Grid>
				<Grid item>
					<IconButton href="https://github.com/TrentShailer/Weather-Station">
						<GitHubIcon />
					</IconButton>
				</Grid>
			</Grid>
		);
	}

	render() {
		return (
			<div>
				{window.innerWidth < 900 ? (
					<this.BasicInfo {...this.props} />
				) : (
					<this.ExtraInfo {...this.props} />
				)}
			</div>
		);
	}
}
export default Footer;
