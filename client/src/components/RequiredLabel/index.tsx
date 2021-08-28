import { Box, Text } from "grommet";

const RequiredLabel = ({ children }: { children: any }) => (
	<Box direction="row">
		<Text margin={{ right: "xsmall" }}>{children}</Text>
		<Text color="status-critical">*</Text>
	</Box>
);

export default RequiredLabel;
