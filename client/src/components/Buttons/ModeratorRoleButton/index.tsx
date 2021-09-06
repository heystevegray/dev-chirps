import { useMutation } from "@apollo/client";
import { Button } from "grommet";
import { UserAdmin } from "grommet-icons";
import { CHANGE_ACCOUNT_MODERATOR_ROLE } from "../../../graphql/mutations";

interface Props {
	accountId: string;
	iconSize: string;
	isModerator: boolean;
	label?: string;
}

const ModeratorRoleButton = ({
	accountId,
	iconSize = "small",
	isModerator,
	label = "Change User Moderator Role",
}: Props) => {
	const [changeAccountModeratorRole, { loading }] = useMutation(
		CHANGE_ACCOUNT_MODERATOR_ROLE
	);

	return (
		<Button
			tip={label}
			hoverIndicator
			focusIndicator
			a11yTitle={label}
			disabled={loading}
			icon={
				<UserAdmin
					color={isModerator ? "brand" : "dark-4"}
					size={iconSize}
				/>
			}
			onClick={() => {
				changeAccountModeratorRole({
					variables: { where: { id: accountId } },
				}).catch((err) => {
					console.log(err);
				});
			}}
		/>
	);
};

export default ModeratorRoleButton;
