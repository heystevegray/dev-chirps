import { Anchor, Box, Button, Heading, Menu } from "grommet";
import { Menu as MenuIcon } from "grommet-icons";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import AccentButton from "../Buttons/AccentButton";
import CreateContentForm from "../Forms/CreateContentForm";
import Modal from "../Modal";

const NavBar = () => {
	const { logout, viewerQuery } = useAuth();
	const history = useHistory();
	const location = useLocation();
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<header>
			<Box
				align="center"
				border={{
					color: "dark-1",
					style: "solid",
					size: "xsmall",
					side: "bottom",
				}}
				direction="row"
				justify="between"
				pad="small"
			>
				<Heading color="brand" level="1" size="32px">
					<Anchor href="/" label="devchirps" />
				</Heading>
				{location.pathname !== "/" && (
					<Box align="center" direction="row">
						<Modal
							handleClose={() => {
								setModalOpen(false);
							}}
							isOpen={modalOpen}
							title="Create a New Post"
							width="large"
						>
							<CreateContentForm />
						</Modal>
						<Box>
							<AccentButton
								label="New Post"
								margin={{ right: "small" }}
								onClick={() => {
									setModalOpen(!modalOpen);
								}}
							/>
						</Box>
						<Menu
							a11yTitle="User Menu"
							dropBackground="dark-1"
							dropAlign={{ right: "right", top: "top" }}
							icon={<MenuIcon color="brand" size="20px" />}
							items={[
								{
									label: "Profile",
									onClick: () => {
										history.push(
											`/profile/${viewerQuery.data.viewer.profile.username}`
										);
									},
								},
								{ label: "Logout", onClick: logout },
							]}
							justifyContent="end"
						/>
					</Box>
				)}
			</Box>
		</header>
	);
};

export default NavBar;
