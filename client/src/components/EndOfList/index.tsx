import { Box, Text } from "grommet";

const EndOfList = ({ text = "End of list" }: { text?: string }) => {
	return (
		<Box direction="row" margin="large" justify="center">
			<Text color="dark-2">{text}</Text>
		</Box>
	);
};

export default EndOfList;
