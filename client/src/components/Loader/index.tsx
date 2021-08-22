import { Refresh } from "grommet-icons";

import StyledLoader from "./styles";

export interface LoaderProps {
	centered?: boolean;
	color?: string;
	size?: string;
}

const Loader = ({ centered, color, size }: LoaderProps) => (
	<StyledLoader centered={centered}>
		<Refresh color={color} size={size} />
	</StyledLoader>
);

Loader.defaultProps = {
	centered: false,
	color: "brand",
	size: "large",
};

export default Loader;
