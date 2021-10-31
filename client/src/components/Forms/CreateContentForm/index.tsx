import { useMutation } from "@apollo/client";
import {
	Box,
	Button,
	Form,
	FormField,
	Stack,
	TextArea,
	TextInput,
	Image,
} from "grommet";
import { Close } from "grommet-icons";
import { useRef, useState } from "react";
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
import FormFieldContainer from "../FormFieldContainer";

interface Props {
	parentPostId?: string;
	handleClose: () => void;
}

const CreateContentForm = ({ parentPostId, handleClose }: Props) => {
	const history = useHistory();
	const [contentCharacterCount, setContentCharacterCount] = useState(0);
	const value = useAuth();
	const { username } = value.viewerQuery.data.viewer.profile;
	const mediaInput = useRef<HTMLInputElement>(null);
	const [mediaFile, setMediaFile] = useState<string | null>();
	const validFormats = ["image/gif", "image/jpeg", "image/jpg", "image/png"];

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

	const getMediaFile = () => {
		let file: File | undefined = undefined;

		if (mediaInput.current) {
			file = mediaInput.current?.files?.[0];
		}

		return file;
	};

	return (
		<Box fill="vertical" overflow="auto">
			<Form
				messages={{ required: "Required" }}
				onSubmit={(event: any) => {
					let media = undefined;
					const file = getMediaFile();

					if (file) {
						media = { media: file };
					}

					if (parentPostId) {
						createReply({
							variables: {
								data: {
									postId: parentPostId,
									text: event.value.text,
									username,
									// Only send the media if it is defined
									...media,
								},
							},
						})
							.catch((error) => {
								console.error(error);
							})
							.finally(handleClose);
					} else {
						createPost({
							variables: {
								data: {
									text: event.value.text,
									username,
									// Only send the media if it is defined
									...media,
								},
							},
						})
							.catch((error) => {
								console.error(error);
							})
							.finally(handleClose);
					}
				}}
			>
				<FormFieldContainer
					button={
						<Box
							align="center"
							direction="row"
							justify="end"
							margin={{ right: "small" }}
						>
							<LoadingButton
								loading={loading}
								label={`${parentPostId ? "Reply" : "Publish"}`}
								type="submit"
							/>
						</Box>
					}
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
						placeholder={`Write your ${
							parentPostId ? "reply" : "squeak"
						}`}
						required
						validate={(fieldData: string) => {
							if (fieldData && fieldData.length > 256) {
								return "256 maximum character count exceeded";
							}
						}}
					/>
					<FormField
						htmlFor="media"
						id="media"
						label="Image"
						name="media"
						validate={(fieldData) => {
							const file = getMediaFile();
							if (file && !validFormats.includes(file.type)) {
								return "Upload GIF, JPG or PNG files only";
							} else if (file && file.size > 5 * 1024 * 1024) {
								return "Maximum file size is 5 MB";
							}
						}}
					>
						{mediaFile && (
							<Stack anchor="top-right" margin="medium">
								<Image
									src={mediaFile}
									alt="Uploaded content image"
								/>
								<Box
									background="dark-1"
									margin="xsmall"
									overflow="hidden"
									round="full"
								>
									<Button
										a11yTitle="Remove Image"
										hoverIndicator
										icon={<Close size="18px" />}
										onClick={() => {
											setMediaFile(null);
											if (mediaInput.current?.value) {
												mediaInput.current.value = "";
											}
										}}
									/>
								</Box>
							</Stack>
						)}
						<TextInput
							accept={validFormats.join(", ")}
							onChange={(event) => {
								setMediaFile(
									event.target.files?.length
										? URL.createObjectURL(
												event.target.files[0]
										  )
										: null
								);
							}}
							ref={mediaInput}
							type="file"
						/>
					</FormField>
				</FormFieldContainer>
			</Form>
		</Box>
	);
};

export default CreateContentForm;
