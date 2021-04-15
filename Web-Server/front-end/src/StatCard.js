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

class StatCard extends React.Component {
	render() {
		return (
			<Card style={{ width: 250, height: 250 }}>
				<CardContent>
					<Typography color="textSecondary" variant="h5" gutterBottom>
						{this.props.title}
					</Typography>
					<Container style={{ textAlign: "center", marginTop: 50 }}>
						<Grid justify="center" alignItems="baseline" container>
							<Grid item>
								<Typography variant="h3" gutterBottom>
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
					<IconButton>
						<TimelineIcon style={{ color: grey[500] }} />
					</IconButton>
				</CardActions>
			</Card>
		);
	}
}

export default StatCard;
