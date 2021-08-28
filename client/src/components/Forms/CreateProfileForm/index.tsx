import { useMutation } from "@apollo/client";
import { Form, FormField } from "grommet";
import { useState } from "react";
import { CREATE_PROFILE } from "../../../graphql/mutations";
import { GET_VIEWER } from "../../../graphql/queries";
import CharacterCountLabel from "../../CharacterCountLabel";
import { LoadingButton } from "../../LoadingButton";
import RequiredLabel from "../../RequiredLabel";
import {
	getUsernameErrors,
	validateDescription,
	validateUsername,
} from "../EditProfileForm";

interface Props {
	accountId: string;
	updateViewer: React.Dispatch<React.SetStateAction<null>>;
}

const CreateProfileForm = ({ accountId, updateViewer }: Props) => {
	const [descCharCount, setDescCharCount] = useState(0);
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
				username: getUsernameErrors(createProfileError),
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
					console.error(error);
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
				validate={(fieldData) => validateUsername(fieldData)}
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
				validate={(fieldData) => validateDescription(fieldData)}
			/>
			<LoadingButton loading={loading} label="Save Profile" />
		</Form>
	);
};

export default CreateProfileForm;
