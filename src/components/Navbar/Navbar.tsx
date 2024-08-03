"use client";
import React, { useContext, useState } from "react";
import {
	Box,
	Flex,
	HStack,
	Link as ChakraLink,
	IconButton,
	useDisclosure,
	useColorModeValue,
	Stack,
	Avatar,
} from "@chakra-ui/react";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import ConfirmModal from "../Modal/ConfirmModal";

const logo = "gossip.png";

const MobileSidebar = () => {
	return (
		<Box pb={4} display={{ md: "none" }}>
			{/* <Stack as={"nav"} spacing={4}>
				<Link to={"/users"}>
					<ChakraLink
						px={2}
						py={1}
						rounded={"md"}
						_hover={{
							textDecoration: "none",
							bg: useColorModeValue("gray.200", "gray.700"),
						}}
					>
						New User
					</ChakraLink>
				</Link>
			</Stack> */}
		</Box>
	);
};

const Navbar = () => {
	const { user, color } = useContext(AuthContext);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [openModal, setOpenModal] = useState(false);

	const handleNavigate = () => {
		navigate("/user-info");
	};

	const handleOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleLogout = () => {
		queryClient.clear();
		localStorage.removeItem("user_id");
		localStorage.removeItem("username");
		localStorage.removeItem("selected-platform");
		handleCloseModal();
		navigate("/login");
	};

	return (
		<Box bg={color} px={4}>
			<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
				{/* <IconButton
					size={"md"}
					icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
					aria-label={"Open Menu"}
					display={{ md: "none" }}
					onClick={isOpen ? onClose : onOpen}
				/> */}
				<HStack spacing={8} alignItems={"center"}>
					<Box>
						<Link to={"/"}>
							<img src={logo} alt="Logo" height={50} width={50} />
						</Link>
					</Box>
					<HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
						New User
						{/* </ChakraLink> */}
						{/* </Link> */}
					</HStack>
				</HStack>
				<Flex alignItems={"center"} gap={2}>
					{/* <IconButton
            size={"md"}
            icon={<EditIcon />}
            border={"50%"}
            aria-label={"Open Menu"}
            display={{ sm: "none" }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
					<Avatar
						size={"sm"}
						src={user.profile_picture}
						style={{ cursor: "pointer" }}
						onClick={handleNavigate}
					/>
					<ChakraLink
						px={3}
						py={2}
						mx={3}
						borderRadius={12}
						_hover={{
							textDecoration: "none",
							bg: getHoverColor(color),
						}}
						color={getFontColor(color)}
						// href={"/logout"}
						onClick={handleOpenModal}
						fontWeight={500}
					>
						Logout
					</ChakraLink>
				</Flex>
			</Flex>

			{isOpen && <MobileSidebar />}
			{openModal && (
				<ConfirmModal
					isOpen={openModal}
					onClose={handleCloseModal}
					onSubmit={handleLogout}
				/>
			)}
		</Box>
	);
};

export default Navbar;
