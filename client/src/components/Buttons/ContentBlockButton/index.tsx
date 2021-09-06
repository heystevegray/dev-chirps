import { useMutation } from "@apollo/client";
import { Button } from "grommet";
import { Halt } from "grommet-icons";
import {
	TOGGLE_POST_BLOCK,
	TOGGLE_REPLY_BLOCK,
} from "../../../graphql/mutations";

interface Props {
	iconSize: string;
	isReply: boolean;
	isBlocked: boolean;
	id: string;
}

const ContentBlockButton = ({
	iconSize = "small",
	id,
	isBlocked,
	isReply = false,
}: Props) => {
	const [togglePostBlock, { loading }] = useMutation(TOGGLE_POST_BLOCK);
	const [toggleReplyBlock] = useMutation(TOGGLE_REPLY_BLOCK);
	const label = `Block ${isReply ? "Reply" : "Post"}`;

	return (
		<Button
			tip={label}
			disabled={loading}
			hoverIndicator
			focusIndicator
			a11yTitle={label}
			icon={
				<Halt
					color={isBlocked ? "status-critical" : "dark-4"}
					size={iconSize}
				/>
			}
			onClick={() => {
				if (isReply) {
					toggleReplyBlock({
						variables: { where: { id } },
					}).catch((error) => {
						console.log(error);
					});
				} else {
					togglePostBlock({
						variables: { where: { id } },
					}).catch((error) => {
						console.log(error);
					});
				}
			}}
		/>
	);
};

export default ContentBlockButton;
