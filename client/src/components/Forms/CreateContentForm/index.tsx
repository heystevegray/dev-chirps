import { useMutation } from "@apollo/client";
import { Box, Button, Form, FormField, TextArea } from "grommet";
import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { CREATE_POST } from "../../../graphql/mutations";
import AccentButton from "../../Buttons/AccentButton";
import { LoadingButton } from "../../Buttons/LoadingButton";
import CharacterCountLabel from "../../CharacterCountLabel";
import RequiredLabel from "../../RequiredLabel";

const CreateContentForm = () => {
	const history = useHistory();
	const [contentCharacterCount, setContentCharacterCount] = useState(0);
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;

	const [createPost, { loading }] = useMutation(CREATE_POST, {
		onCompleted: ({ createPost: { id } }) => {
			history.push(`/post/${id}`);
		},
	});

	return (
		<Form
			messages={{ required: "Required" }}
			onSubmit={(event: any) => {
				createPost({
					variables: {
						data: {
							text: event.value.text,
							username,
						},
					},
				});
			}}
		>
			<FormField
				component={TextArea}
				htmlFor="text"
				id="text"
				resize="vertical"
				label={
					<RequiredLabel>
						<CharacterCountLabel
							currentCharacters={contentCharacterCount}
							label="Content"
							max={256}
						/>
					</RequiredLabel>
				}
				name="text"
				onInput={(event: any) => {
					setContentCharacterCount(event.target.value.length);
				}}
				placeholder="Write your post"
				required
				validate={(fieldData: string) => {
					if (fieldData && fieldData.length > 256) {
						return "256 maximum character count exceeded";
					}
				}}
			/>
			<Box align="center" direction="row" justify="end">
				<LoadingButton
					loading={loading}
					label="Publish"
					type="submit"
				/>
			</Box>
		</Form>
	);
};

export default CreateContentForm;
