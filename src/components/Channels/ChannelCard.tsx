import * as React from "react";
import {
	Container,
	Box,
	HStack,
	useColorModeValue,
	Center,
	Link,
	Image,
	Flex,
	Text,
	Button,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";

const ChannelCard = ({
	data,
	handleClick,
}: {
	data: any;
	handleClick: any;
}) => {
	const { image, channel_name, description } = data;

	const { color } = React.useContext(AuthContext);
	const bg = useColorModeValue("white", "#2f3244");

	return (
		<Flex alignItems="center" justifyContent="center">
			<Box
				borderRadius={12}
				w="xs"
				bg="white"
				_dark={{
					bg: "gray.800",
				}}
				shadow="lg"
				rounded="lg"
				overflow="hidden"
				mx={2}
			>
				<Image w="full" h={56} fit="cover" src={image} alt="avatar" />

				<Box py={5} textAlign="center">
					<Text display="block" fontSize="2xl" fontWeight="bold">
						{channel_name}
					</Text>
					<Text fontSize="sm" color="gray.700" my={2}>
						{description}
					</Text>
					<Button
						bgColor={color}
						color={getFontColor(color)}
						_hover={{
							bgColor: getHoverColor(color),
							color: getFontColor(color),
						}}
						borderRadius={12}
						mt={2}
						onClick={() => handleClick(data)}
					>
						Explore Channel
					</Button>
				</Box>
			</Box>
		</Flex>
	);
};

export default ChannelCard;
