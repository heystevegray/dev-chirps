import { Box } from "grommet";
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
				color: "dark-1",
				size: "xsmall",
				style: "solid",
				side: "bottom",
			}}
			gap="medium"
			direction="row"
			width="100%"
			pad={{
				left: "small",
				top: "medium",
				right: "small",
			}}
		>
			<Box width={{ min: "48px" }}>
				<Avatar fullName={fullName} avatar={avatar} />
			</Box>
			{children}
		</Box>
	);
};

export default ListItem;
