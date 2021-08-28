import { Box, Text } from "grommet";
import AccentButton from "../AccentButton";
import Loader from "../Loader";

interface Props {
	loading: boolean;
	label: string;
	showSavedMessage?: boolean;
	savedMessage?: string;
}

export const LoadingButton = ({
	loading,
	label,
	showSavedMessage = false,
	savedMessage = "",
}: Props) => {
	return (
		<Box
			align="center"
			direction="row"
			justify="end"
			margin={{ top: "large" }}
			gap="medium"
			pad={{
				vertical: "small",
			}}
		>
			{loading && <Loader size="medium" />}
			{showSavedMessage && (
				<Text as="p">{savedMessage || "Changes Saved!"}</Text>
			)}
			<AccentButton
				primary
				disabled={loading}
				label={label}
				type="submit"
			/>
		</Box>
	);
};
