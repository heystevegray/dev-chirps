import StyledAccentButton from "./Styles";
import theme from "../../../styles/theme";

const AccentButton = (props: any) => (
	<StyledAccentButton
		primary
		background={props?.background || theme.global?.colors?.secondary}
		width={props?.width || 150}
		color="secondary"
		{...props}
	/>
);

export default AccentButton;
