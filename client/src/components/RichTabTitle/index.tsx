import { Text, Box, TextProps } from "grommet";
import { ReactElement } from "react";

interface Props {
	icon: ReactElement<any, any>;
	label: string;
	size?: TextProps["size"];
}

const RichTabTitle = ({ icon, label, size }: Props) => (
	<Box direction="row" align="center" gap="xsmall" margin="xsmall">
		{icon}
		<Text
			margin={{ left: "small" }}
			size={size}
			style={{ fontWeight: 600 }}
		>
			{label}
		</Text>
	</Box>
);

export default RichTabTitle;
