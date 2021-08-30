import { Box, Text, Avatar as GrommetAvatar, TextProps } from "grommet";

interface Props {
	fullName: string;
	avatar?: string;
	size?: TextProps["size"];
}

const Avatar = ({ fullName, avatar, size = "medium" }: Props) => {
	let initials = "N/a";
	const name = fullName?.split(" ");

	if (name) {
		initials = `${name.shift()?.charAt(0)} ${name
			.pop()
			?.charAt(0)}`.toUpperCase();
	}

	return (
		<Box>
			{avatar && (
				<GrommetAvatar
					size={size}
					aria-label={`${fullName} profile image`}
					src={avatar}
				/>
			)}
			{!avatar && (
				<GrommetAvatar
					background="brand"
					style={{ color: "#FFF" }}
					src={avatar}
					size={size}
					aria-label={`${initials} profile image`}
				>
					<Text as="p">{initials}</Text>
				</GrommetAvatar>
			)}
		</Box>
	);
};

export default Avatar;
