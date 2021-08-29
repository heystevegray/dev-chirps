import { Anchor, Box, Text } from "grommet";
import { Link } from "react-router-dom";
import { Children } from "../../../graphql/types";
import Avatar from "../../Avatar";

interface Props {
	fullName: string;
	avatar: string;
	children: Children;
}

const ListItem = ({ children, fullName, avatar }: Props) => {
	return (
		<Box
			border={{
				color: "dark-2",
				size: "xsmall",
				style: "solid",
				side: "bottom",
			}}
			gap="small"
			direction="row"
			pad={{ left: "small", top: "medium", right: "small" }}
		>
			<Avatar fullName={fullName} avatar={avatar} />
			{children}
		</Box>
	);
};

export default ListItem;
