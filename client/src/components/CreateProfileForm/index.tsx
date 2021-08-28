import { useMutation } from "@apollo/client";
import { Box, Button, Form, FormField } from "grommet";
import { useState } from "react";
import { CREATE_PROFILE } from "../../graphql/mutations";
import { GET_VIEWER } from "../../graphql/queryies";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

interface Props {
	accountId: string;
	updateViewer: React.Dispatch<React.SetStateAction<null>>;
}

const CreateProfileForm = ({ accountId, updateViewer }: Props) => {
	const [descCharCount, setDescCharCount] = useState(0);
	const errorMessage = `Username is already in use 😞`;
	const [createProfile, { error: createProfileError, loading }] = useMutation(
		CREATE_PROFILE,
		{
			update: (cache, { data: { createProfile } }) => {
				// @ts-ignore
				const { viewer } = cache.readQuery({ query: GET_VIEWER });
				const viewerWithProfile = { ...viewer, profile: createProfile };
				cache.writeQuery({
					query: GET_VIEWER,
					data: { viewer: viewerWithProfile },
				});
				updateViewer(viewerWithProfile);
			},
		}
	);

	return (
		<Form
			messages={{ required: "This field is required 😬" }}
			errors={{
				username:
					createProfileError &&
					createProfileError.message.includes("duplicate key") &&
					errorMessage,
			}}
			onSubmit={(event: any) => {
				createProfile({
					variables: {
						data: {
							accountId,
							...event.value,
						},
					},
				}).catch((error) => {
					console.error(errorMessage);
					console.log(error);
				});
			}}
		>
			<FormField
				htmlFor="username"
				id="username"
				label={<RequiredLabel>Username</RequiredLabel>}
				name="username"
				required
				placeholder="Pick a unique username"
				validate={(fieldData) => {
					if (!/^[A-Za-z\d_]*$/.test(fieldData)) {
						return "Alphanumeric characters only (use underscores for whitespace)";
					}
				}}
			/>

			<FormField
				htmlFor="fullName"
				id="fullName"
				label="Full Name"
				name="fullName"
				placeholder="Add your full name"
			/>

			<FormField
				htmlFor="description"
				id="description"
				label={
					<CharacterCountLabel
						currentCharacters={descCharCount}
						label="Description"
						max={256}
					/>
				}
				name="description"
				placeholder="Write a short bio or description about yourself"
				onInput={(event: any) => {
					const characterCount = event.target.value.length;
					setDescCharCount(characterCount);
				}}
				validate={(fieldData) => {
					if (fieldData && fieldData.length > 256) {
						return "256 maximum character count exceeded";
					}
				}}
			/>

			<Box
				align="center"
				direction="row"
				justify="end"
				gap="small"
				pad={{
					vertical: "small",
				}}
			>
				{loading && <Loader size="medium" />}
				<Button
					disabled={loading}
					label="Create Profile"
					primary
					type="submit"
				/>
			</Box>
		</Form>
	);
};

export default CreateProfileForm;
