import { Link } from "react-router-dom";
import { Box, Text } from "grommet";

const GoHome = () => {
	return (
		<Box align="center" justify="center" margin="medium">
			<Link to="/">
				<Text as="p" color="brand">
					Go Home
				</Text>
			</Link>
		</Box>
	);
};

export default GoHome;
