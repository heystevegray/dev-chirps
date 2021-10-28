import { Box, ResponsiveContext } from "grommet";
import { ReactElement, useContext } from "react";
import { Children } from "../../../graphql/types";
import Avatar from "../../Avatar";

interface Props {
	fullName?: string;
	avatar?: string;
	children: Children;
	icon?: ReactElement;
}

const ListItem = ({ children, fullName = "", avatar = "", icon }: Props) => {
	const sizeSmall = useContext(ResponsiveContext) === "small";
	const padding = sizeSmall
		? "small"
		: {
				left: "small",
				top: "medium",
				right: "small",
		  };

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
			pad={padding}
		>
			<Box width={{ min: "48px" }}>
				{icon ? icon : <Avatar fullName={fullName} avatar={avatar} />}
			</Box>
			{children}
		</Box>
	);
};

export default ListItem;
