import { ApolloError, useMutation } from "@apollo/client";
import { Form, FormField } from "grommet";
import { useEffect, useState } from "react";
import { UPDATE_PROFILE } from "../../../graphql/mutations";
import { GET_VIEWER } from "../../../graphql/queries";
import { AuthProps, Profile } from "../../../graphql/types";
import { LoadingButton } from "../../Buttons/LoadingButton";
import CharacterCountLabel from "../../CharacterCountLabel";
import RequiredLabel from "../../RequiredLabel";

interface Props {
	profileData: Profile;
	updateViewer: AuthProps["updateViewer"];
}

export const getUsernameErrors = (
	error: ApolloError | undefined,
	errorMessage = ""
): string | boolean => {
	const message = errorMessage
		? errorMessage
		: `Username is already in use 😞`;
	if (error && error.message.includes("duplicate key")) {
		return message;
	}
	return false;
};

export const validateUsername = (fieldData: string): string | boolean => {
	if (!/^[A-Za-z\d_]*$/.test(fieldData)) {
		return "Alphanumeric characters only (use underscores for whitespace)";
	}
	return true;
};

export const validateDescription = (fieldData: string): string | boolean => {
	if (fieldData && fieldData.length > 256) {
		return "256 maximum character count exceeded";
	}
	return true;
};

const EditProfileForm = ({ profileData, updateViewer }: Props) => {
	const descriptionLength =
		(profileData.description && profileData.description.length) || 0;
	const [description, setDescription] = useState(profileData.description);
	const [fullName, setFullName] = useState(profileData.fullName);
	const [username, setUsername] = useState(profileData.username);
	const [descCharacterCount, setDescCharacterCount] =
		useState(descriptionLength);
	const [showSavedMessage, setShowSavedMessage] = useState(false);
	const [updateProfile, { error: updateProfileError, loading }] = useMutation(
		UPDATE_PROFILE,
		{
			update: (cache, { data: { updateProfile } }) => {
				// @ts-ignore
				const { viewer } = cache.readQuery({ query: GET_VIEWER });
				const viewerWithProfile = { ...viewer, profile: updateProfile };
				cache.writeQuery({
					query: GET_VIEWER,
					data: { viewer: viewerWithProfile },
				});
				updateViewer(viewerWithProfile);
			},
			onCompleted: () => {
				setShowSavedMessage(true);
			},
		}
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSavedMessage(false);
		}, 3000);

		return () => {
			clearTimeout(timer);
		};
	});

	return (
		<Form
			errors={{
				username: getUsernameErrors(updateProfileError),
			}}
			messages={{ required: "Required" }}
			onSubmit={() =>
				updateProfile({
					variables: {
						data: { description, fullName, username },
						where: { username: profileData.username },
					},
				}).catch((error) => {
					console.error(error);
				})
			}
		>
			<FormField
				htmlFor="username"
				id="username"
				label={<RequiredLabel>Username</RequiredLabel>}
				name="username"
				onInput={(event: any) => {
					setUsername(event.target.value);
				}}
				placeholder="Pick a unique username"
				required
				validate={(fieldData) => validateUsername(fieldData)}
				value={username}
			/>

			<FormField
				htmlFor="fullName"
				id="fullName"
				label="Full Name"
				name="fullName"
				onInput={(event: any) => {
					setFullName(event.target.value);
				}}
				placeholder="Add your full name"
				value={fullName}
			/>

			<FormField
				htmlFor="description"
				id="description"
				label={
					<CharacterCountLabel
						currentCharacters={descCharacterCount}
						label="Description"
						max={256}
					/>
				}
				name="description"
				onInput={(event: any) => {
					setDescription(event.target.value);
					setDescCharacterCount(event.target.value.length);
				}}
				placeholder="Write a short bio or description about yourself"
				validate={(fieldData) => validateDescription(fieldData)}
				value={description}
			/>
			<LoadingButton
				loading={loading}
				label="Save Profile"
				showSavedMessage={showSavedMessage}
			/>
		</Form>
	);
};

export default EditProfileForm;
