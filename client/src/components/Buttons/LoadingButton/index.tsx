import { Box, Text } from "grommet";
import Loader from "../../Loader";
import AccentButton from "../AccentButton";

interface Props {
	loading: boolean;
	label: string;
	showSavedMessage?: boolean;
	savedMessage?: string;
	type?: string;
	disabled?: boolean;
}

export const LoadingButton = ({
	loading,
	label,
	showSavedMessage = false,
	savedMessage = "",
	disabled = false,
	...rest
}: Props) => {
	return (
		<Box
			{...rest}
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
				<Text as="p" color="status-ok">
					{savedMessage || "Changes Saved!"}
				</Text>
			)}
			<AccentButton
				color="brand"
				disabled={loading || disabled}
				label={label}
				type="submit"
			/>
		</Box>
	);
};