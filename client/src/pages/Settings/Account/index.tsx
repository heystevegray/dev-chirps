import { useAuth } from "../../../context/AuthContext";
import MainLayout from "../../../layouts/MainLayout";
import passwordValidator from "password-validator";
import validator from "validator";
import { useState } from "react";
import { Box, Heading, Form, FormField, Text } from "grommet";
import RequiredLabel from "../../../components/RequiredLabel";
import { LoadingButton } from "../../../components/Buttons/LoadingButton";
import { UPDATE_ACCOUNT } from "../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import NotAvailableMessage from "../../../components/NotAvailableMessage";
import DeleteAccountModal from "../../../components/Modals/DeleteAccountModal";

const schema = new passwordValidator();
schema
	.is()
	.min(8)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits()
	.has()
	.symbols();

const Account = () => {
	const { logout, viewerQuery } = useAuth();
	const { email: viewerEmail, id: viewerId } = viewerQuery.data.viewer;
	const [email, setEmail] = useState(viewerEmail);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [invalidPassword, setInvalidPassword] = useState(false);

	const [updateAccountEmail, { loading }] = useMutation(UPDATE_ACCOUNT, {
		onCompleted: logout,
	});

	const [updateAccountPassword, { loading: loadingAccountPassword }] =
		useMutation(UPDATE_ACCOUNT, {
			onCompleted: logout,
		});

	return (
		<MainLayout>
			<Box
				border={{
					color: "dark-1",
					size: "xsmall",
					style: "solid",
					side: "bottom",
				}}
				pad={{ bottom: "large" }}
				margin={{ bottom: "large", top: "medium" }}
			>
				<Heading
					color="dark-3"
					level={2}
					margin={{ bottom: "large", top: "small" }}
				>
					Account Settings
				</Heading>
				<Heading level={3} margin={{ bottom: "small" }}>
					Change Email
				</Heading>
				<Text as="p" color="dark-2" margin={{ bottom: "medium" }}>
					After updating your email you will be redirected to log in
					again.
				</Text>
				<Form
					messages={{ required: "Required" }}
					onSubmit={() => {
						updateAccountEmail({
							variables: {
								data: { email },
								where: { id: viewerId },
							},
						}).catch((error) => {
							console.error(error);
						});
					}}
				>
					<FormField
						id="email"
						htmlFor="email"
						label={<RequiredLabel>Email Address</RequiredLabel>}
						name="email"
						onInput={(event: any) => {
							setEmail(event.target.value);
						}}
						placeholder="Enter your updated email address"
						required
						validate={(fieldData: any) => {
							if (!validator.isEmail(fieldData)) {
								return "Please enter a valid email address";
							}
						}}
						value={email}
					/>
					<Box align="center" direction="row" justify="end">
						<LoadingButton
							disabled={loading || viewerEmail === email}
							loading={loading}
							label="Update Email"
							type="submit"
						/>
					</Box>
				</Form>
			</Box>
			<Box
				border={{
					color: "dark-1",
					size: "xsmall",
					style: "solid",
					side: "bottom",
				}}
				pad={{ bottom: "large" }}
				margin={{ bottom: "large", top: "medium" }}
			>
				<Heading level={3} margin={{ bottom: "medium" }}>
					Change Password
				</Heading>
				<Text as="p" color="dark-2" margin={{ bottom: "medium" }}>
					After updating your password you will be redirected to log
					in again.
				</Text>
				<Form
					messages={{
						required: "Both current and new passwords are required",
					}}
					onSubmit={() => {
						updateAccountPassword({
							variables: {
								data: {
									password,
									newPassword,
								},
								where: { id: viewerId },
							},
						})
							.then(() => {
								setInvalidPassword(false);
							})
							.catch((error) => {
								console.error(error);
								setInvalidPassword(true);
							});
					}}
				>
					<FormField
						htmlFor="password"
						id="password"
						label={<RequiredLabel>Current Password</RequiredLabel>}
						name="password"
						onInput={(event: any) => {
							setPassword(event.target.value);
						}}
						placeholder="Confirm your current password"
						required
						type="password"
						value={password}
					/>
					<FormField
						htmlFor="newPassword"
						id="newPassword"
						label={<RequiredLabel>New Password</RequiredLabel>}
						name="newPassword"
						onInput={(event: any) => {
							setNewPassword(event.target.value);
						}}
						placeholder="Enter your new password"
						required
						type="password"
						validate={(fieldData) => {
							if (!schema.validate(fieldData)) {
								return "Passwords must be least 8 characters with lowercase and uppercase letters, digits, and special characters.";
							}
						}}
						value={newPassword}
					/>
					{invalidPassword && (
						<NotAvailableMessage text="Incorrect Current Password" />
					)}
					<Box align="center" direction="row" justify="end">
						<LoadingButton
							disabled={
								loadingAccountPassword ||
								!password ||
								!newPassword
							}
							loading={loadingAccountPassword}
							label="Update Password"
							type="submit"
						/>
					</Box>
				</Form>
			</Box>
			<Box
				border={{
					color: "dark-1",
					size: "xsmall",
					style: "solid",
					side: "bottom",
				}}
				pad={{ bottom: "large" }}
				margin={{ bottom: "large", top: "medium" }}
			>
				<Heading level={3} margin={{ bottom: "medium" }}>
					Delete Account 👋
				</Heading>
				<Text as="p" color="dark-2" margin={{ bottom: "medium" }}>
					Danger zone! Click this button to permanently delete your
					account and all of its data.
				</Text>
				<DeleteAccountModal accountId={viewerId} />
			</Box>
		</MainLayout>
	);
};

export default Account;
