import { Box, ResponsiveContext } from "grommet";
import { useContext } from "react";
import { Children } from "../../../graphql/types";

interface Props {
	children?: any;
	button?: Children;
}

const FormFieldContainer = ({ children, button }: Props) => {
	const sizeSmall = useContext(ResponsiveContext) === "small";
	return (
		<Box
			gap={sizeSmall ? "large" : "medium"}
			overflow="auto"
			margin={{ bottom: "large" }}
		>
			{children}
			<Box pad={{ bottom: "xlarge", right: "medium" }}>{button}</Box>
		</Box>
	);
};

export default FormFieldContainer;
