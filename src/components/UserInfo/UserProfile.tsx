import { EmailIcon } from "@chakra-ui/icons";
import { PhoneIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";

const UserProfile = ({ data }: { data: any }) => {
	const { profile_picture, display_name, email, contact } = data;
	return (
		<Flex
			bg="#edf3f8"
			_dark={{
				bg: "#3e3e3e",
			}}
			p={50}
			w="full"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				w="sm"
				mx="auto"
				bg="white"
				_dark={{
					bg: "gray.800",
				}}
				shadow="lg"
				rounded="lg"
				overflow="hidden"
			>
				<Image
					w="full"
					h={56}
					fit="contain"
					objectPosition="center"
					src={profile_picture}
					alt="avatar"
				/>

				<Flex alignItems="center" px={6} py={3} bg="gray.900">
					{/* <Icon as={MdHeadset} h={6} w={6} color="white" /> */}

					<Text mx={3} color="white" fontWeight="bold" fontSize="lg">
						Focusing
					</Text>
				</Flex>

				<Box py={4} px={6}>
					<Text
						fontSize="xl"
						fontWeight="bold"
						color="gray.800"
						_dark={{
							color: "white",
						}}
					>
						{display_name}
					</Text>

					<Text
						py={2}
						color="gray.700"
						_dark={{
							color: "gray.400",
						}}
					>
						Full Stack maker & UI / UX Designer , love hip hop music Author of
						Building UI.
					</Text>

					<Flex
						alignItems="center"
						mt={4}
						color="gray.700"
						_dark={{
							color: "gray.200",
						}}
					>
						<PhoneIcon h={6} w={6} mr={2} />
						<Text px={2} fontSize="sm">
							{contact}
						</Text>
					</Flex>

					{/* <Flex
						alignItems="center"
						mt={4}
						color="gray.700"
						_dark={{
							color: "gray.200",
						}}
					>
						{/* <Icon as={MdLocationOn} h={6} w={6} mr={2} /> */}

					{/* <Text px={2} fontSize="sm">
							California
						</Text>
					</Flex> */}
					<Flex
						alignItems="center"
						mt={4}
						color="gray.700"
						_dark={{
							color: "gray.200",
						}}
					>
						<EmailIcon h={6} w={6} mr={2} />
						<Text px={2} fontSize="sm">
							{email}
						</Text>
					</Flex>
				</Box>
			</Box>
		</Flex>
	);
};

export default UserProfile;
