import StyledAccentButton from "./Styles";
import theme from "../../../styles/theme";

const AccentButton = (props: any) => (
	<StyledAccentButton
		{...props}
		primary
		background={props?.background || theme.global?.colors?.secondary}
		color="secondary"
	/>
);

export default AccentButton;
