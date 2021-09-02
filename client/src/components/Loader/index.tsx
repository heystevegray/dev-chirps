import { Box, Spinner } from "grommet";

import StyledLoader from "./styles";

export interface LoaderProps {
	centered?: boolean;
	color?: string;
}

const Loader = ({ centered, color }: LoaderProps) => (
	<StyledLoader centered={centered}>
		<Box align="center" direction="row" gap="medium">
			<Spinner
				border={[
					{ side: "all", color: "transparent", size: "medium" },
					{ side: "horizontal", color, size: "medium" },
				]}
			/>
		</Box>
	</StyledLoader>
);

Loader.defaultProps = {
	centered: false,
	color: "brand",
	size: "large",
};

export default Loader;
