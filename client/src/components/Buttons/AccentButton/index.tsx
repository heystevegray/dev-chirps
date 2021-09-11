import theme from "../../../styles/theme";
import { Button, ButtonExtendedProps } from "grommet";

const AccentButton = (props: ButtonExtendedProps) => (
	<Button
		primary
		tip={props?.tip}
		disabled={props?.disabled}
		color={props?.color ? props?.color : theme.global?.colors?.brand}
		{...props}
	/>
);

export default AccentButton;
