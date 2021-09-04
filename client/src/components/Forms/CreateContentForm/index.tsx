import { useMutation } from "@apollo/client";
import { Box, Form, FormField, TextArea } from "grommet";
import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { CREATE_POST, CREATE_REPLY } from "../../../graphql/mutations";
import {
	GET_POST,
	GET_POSTS,
	GET_PROFILE_CONTENT,
} from "../../../graphql/queries";
import { LoadingButton } from "../../Buttons/LoadingButton";
import CharacterCountLabel from "../../CharacterCountLabel";
import RequiredLabel from "../../RequiredLabel";

interface Props {
	parentPostId?: string;
}

const CreateContentForm = ({ parentPostId }: Props) => {
	const history = useHistory();
	const [contentCharacterCount, setContentCharacterCount] = useState(0);
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;

	const [createPost, { loading }] = useMutation(CREATE_POST, {
		onCompleted: ({ createPost: { id } }) => {
			history.push(`/post/${id}`);
		},
		refetchQueries: () => [
			{
				query: GET_POSTS,
				variables: {
					filter: { followedBy: username, includeBlocked: false },
				},
			},
			{
				query: GET_PROFILE_CONTENT,
				variables: {
					username,
				},
			},
		],
	});

	const [createReply] = useMutation(CREATE_REPLY, {
		onCompleted: ({ createReply: { id } }) => {
			history.push(`/reply/${id}`);
		},
		refetchQueries: () => [
			{ query: GET_POST, variables: { id: parentPostId } },
			{ query: GET_PROFILE_CONTENT, variables: { username } },
		],
	});

	return (
		<Form
			messages={{ required: "Required" }}
			onSubmit={(event: any) => {
				if (parentPostId) {
					createReply({
						variables: {
							data: {
								postId: parentPostId,
								text: event.value.text,
								username,
							},
						},
					}).catch((error) => {
						console.log(error);
					});
				} else {
					createPost({
						variables: {
							data: {
								text: event.value.text,
								username,
							},
						},
					}).catch((error) => {
						console.log(error);
					});
				}
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
				placeholder={`Write your ${parentPostId ? "reply" : "post"}`}
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
					label={`${parentPostId ? "Reply" : "Publish"}`}
					type="submit"
				/>
			</Box>
		</Form>
	);
};

export default CreateContentForm;
