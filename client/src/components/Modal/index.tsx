import { Box, Heading, Layer } from "grommet";
import { Close } from "grommet-icons";
import { ReactElement } from "react";

interface Props {
	children: ReactElement | ReactElement[];
	handleClose: () => void;
	isOpen: boolean;
	title: string;
	width: string;
}

const Modal = ({
	children,
	handleClose,
	isOpen,
	title,
	width = "medium",
}: Props) => (
	<Box align="center" justify="center">
		{isOpen && (
			<Layer onEsc={handleClose} onClickOutside={handleClose}>
				<Box
					align="center"
					border={{
						color: "brand",
						size: "xsmall",
						style: "solid",
						side: "bottom",
					}}
					direction="row"
					background="dark-1"
					justify="between"
					pad="small"
				>
					<Heading level="2" size="1.5rem">
						{title}
					</Heading>
					{handleClose && (
						<Close
							color="brand"
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					)}
				</Box>
				<Box
					height="100%"
					background="dark-1"
					pad="large"
					gap="large"
					width={width}
				>
					{children}
				</Box>
			</Layer>
		)}
	</Box>
);

export default Modal;
