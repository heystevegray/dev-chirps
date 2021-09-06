import { useMutation } from "@apollo/client";
import { Button } from "grommet";
import { Halt } from "grommet-icons";
import { CHANGE_ACCOUNT_BLOCKED_STATUS } from "../../../graphql/mutations";

interface Props {
	accountId: string;
	iconSize: string;
	isBlocked: boolean;
}

const AccountBlockButton = ({
	accountId,
	iconSize = "small",
	isBlocked,
}: Props) => {
	const [changeAccountBlockedStatus, { loading }] = useMutation(
		CHANGE_ACCOUNT_BLOCKED_STATUS
	);

	return (
		<Button
			tip="Block User"
			hoverIndicator
			focusIndicator
			a11yTitle="Block User"
			disabled={loading}
			icon={
				<Halt
					color={isBlocked ? "status-critical" : "dark-4"}
					size={iconSize}
				/>
			}
			onClick={() => {
				changeAccountBlockedStatus({
					variables: { where: { id: accountId } },
				}).catch((error) => {
					console.log(error);
				});
			}}
		/>
	);
};

export default AccountBlockButton;
