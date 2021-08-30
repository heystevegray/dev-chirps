import { Anchor, Text } from "grommet";
import { Link } from "react-router-dom";

interface Props {
	fullName: string;
	username: string;
}

const UsernameHeader = ({ fullName, username }: Props) => {
	return (
		<Text as="p">
			<Text weight="bold">{fullName}</Text>{" "}
			<Link to={`/profile/${username}`}>
				<Anchor color="brand" as="span">
					@{username}
				</Anchor>
			</Link>
		</Text>
	);
};

export default UsernameHeader;
