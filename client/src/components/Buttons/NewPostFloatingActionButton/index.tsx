import { Box, Button } from "grommet";
import { Add } from "grommet-icons";
import { useState } from "react";
import { useLocation } from "react-router";
import CreateContentForm from "../../Forms/CreateContentForm";
import Modal from "../../Modal";

const NewPostFloatingActionButton = () => {
	const location = useLocation();
	const [modalOpen, setModalOpen] = useState(false);
	const label = "New squeak";

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<>
			{location.pathname !== "/" && (
				<Box
					align="center"
					direction="row"
					style={{
						position: "fixed",
						right: 28,
						bottom: 54,
					}}
				>
					<Modal
						handleClose={handleClose}
						isOpen={modalOpen}
						title={`Create a ${label}`}
						width="large"
					>
						<CreateContentForm handleClose={handleClose} />
					</Modal>
					<Box
						round="full"
						overflow="hidden"
						align="center"
						justify="center"
					>
						<Button
							primary
							a11yTitle={`${label}`}
							tip={`${label}`}
							icon={<Add color="paper" size="28px" />}
							onClick={() => {
								setModalOpen(!modalOpen);
							}}
						/>
					</Box>
				</Box>
			)}
		</>
	);
};

export default NewPostFloatingActionButton;
