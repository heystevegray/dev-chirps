import { Box, Text, TextProps } from "grommet";

import StyledText from "./styles";

interface Props {
	margin?: TextProps["margin"];
	text: string;
}

const NotAvailableMessage = ({ text, ...rest }: Props) => (
	<Box {...rest}>
		<Text as="p" color="status-error">
			<StyledText>{`😬 ${text}`}</StyledText>
		</Text>
	</Box>
);

export default NotAvailableMessage;
