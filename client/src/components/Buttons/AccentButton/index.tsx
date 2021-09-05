import theme from "../../../styles/theme";
import { Button } from "grommet";

const AccentButton = (props: any) => (
	<Button
		primary
		disabled={props?.disabled}
		color={props?.color ? props?.color : theme.global?.colors?.primary}
		{...props}
	/>
);

export default AccentButton;
