import { ApolloError, useMutation } from "@apollo/client";
import { Box, Form, FormField, Image, TextInput } from "grommet";
import { useEffect, useState, useRef } from "react";
import { UPDATE_PROFILE } from "../../../graphql/mutations";
import { GET_VIEWER } from "../../../graphql/queries";
import { AuthProps, Profile } from "../../../graphql/types";
import { updateProfileContentAuthor } from "../../../lib/updateQueries";
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
	const validFormats = ["image/jpeg", "image/jpg", "image/png"];
	const descriptionLength =
		(profileData.description && profileData.description.length) || 0;
	const [description, setDescription] = useState(profileData.description);
	const [imageFile, setImageFile] = useState<string | null>();
	const [fullName, setFullName] = useState(profileData.fullName);
	const [username, setUsername] = useState(profileData.username);
	const avatarInput = useRef<HTMLInputElement>(null);
	const [descCharacterCount, setDescCharacterCount] =
		useState(descriptionLength);
	const [showSavedMessage, setShowSavedMessage] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
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
				updateProfileContentAuthor(
					cache,
					profileData.username,
					updateProfile
				);
				updateViewer(viewerWithProfile);
			},
			onCompleted: () => {
				setShowSavedMessage(true);
			},
			onError: (error) => {
				console.error(error.message);
				setShowErrorMessage(true);
			},
			fetchPolicy: "network-only",
		}
	);

	const getAvatarFile = () => {
		let file: File | undefined = undefined;

		if (avatarInput.current) {
			file = avatarInput.current?.files?.[0];
		}

		return file;
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSavedMessage(false);
			setShowErrorMessage(false);
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
			onSubmit={() => {
				let avatar = undefined;
				const file = getAvatarFile();

				if (file) {
					avatar = { avatar: file };
				}

				const data = {
					description,
					fullName,
					username,
					// Only send the avatar if it is defined
					...avatar,
				};

				updateProfile({
					variables: {
						data,
						where: { username: profileData.username },
					},
				}).catch((error) => {
					console.error(error);
				});
			}}
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
			<FormField
				htmlFor="avatar"
				id="avatar"
				label="Avatar (choose a square image for best results)"
				name="avatar"
				validate={() => {
					const file = getAvatarFile();
					if (file && !validFormats.includes(file.type)) {
						return "Upload JPG or PNG files only";
					} else if (file && file.size > 2 * 1024 * 1024) {
						return "Maximum file size is 2MB";
					}
				}}
			>
				<Box
					alignSelf="start"
					height="36px"
					width="36px"
					margin={{ left: "small" }}
					overflow="hidden"
					round="full"
				>
					<Image
						fit="cover"
						src={imageFile || profileData.avatar}
						alt={`${fullName} profile image`}
					/>
				</Box>
				<TextInput
					accept={validFormats.join(", ")}
					onChange={(event) => {
						const url = event.target.files?.length
							? URL.createObjectURL(event.target.files[0])
							: null;
						setImageFile(url);
					}}
					ref={avatarInput}
					type="file"
				/>
			</FormField>
			<LoadingButton
				loading={loading}
				label="Save Profile"
				showSavedMessage={showSavedMessage}
				showErrorMessage={showErrorMessage}
				errorMessage={"Error updating profile data 😬"}
			/>
		</Form>
	);
};

export default EditProfileForm;
