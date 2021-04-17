import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	CardActions,
	IconButton,
	Container,
} from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import { grey } from "@material-ui/core/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StatCard extends React.Component {
	render() {
		return (
			<Card style={{ width: 250, height: 250 }}>
				<CardContent style={{ height: 185 }}>
					<Grid justify="space-between" alignItems="center" container>
						<Grid item>
							<Typography color="textSecondary" variant="h5">
								{this.props.title}
							</Typography>
						</Grid>
						<Grid item>
							<FontAwesomeIcon color={grey[300]} size="lg" icon={this.props.icon} />
						</Grid>
					</Grid>

					<Container style={{ textAlign: "center", marginTop: 50 }}>
						<Grid justify="center" alignItems="baseline" container>
							<Grid item>
								<Typography variant={this.props.title !== "Weather" ? "h3" : "h5"} gutterBottom>
									{this.props.value}
								</Typography>
							</Grid>
							<Grid item>
								<Typography color="textSecondary" variant="h5" gutterBottom>
									{this.props.unit}
								</Typography>
							</Grid>
						</Grid>
					</Container>
				</CardContent>
				<CardActions>
					<IconButton
						onClick={() => {
							this.props.OpenGraph(this.props.unit, this.props.title);
						}}
					>
						<TimelineIcon style={{ color: grey[400] }} />
					</IconButton>
				</CardActions>
			</Card>
		);
	}
}

export default StatCard;
