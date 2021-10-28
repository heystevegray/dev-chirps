import { Box, ResponsiveContext } from "grommet";
import { ReactElement, useContext } from "react";

interface Props {
	children: ReactElement | ReactElement[] | null;
}

const Container = ({ children }: Props) => {
	const sizeSmall = useContext(ResponsiveContext) === "small";
	const padding = sizeSmall ? "0" : "0 1rem";
	const width = "840px";
	return (
		<Box
			margin="0 auto"
			pad={padding}
			width={{
				min: sizeSmall ? "100%" : width,
				max: width,
			}}
		>
			{children}
		</Box>
	);
};

export default Container;
