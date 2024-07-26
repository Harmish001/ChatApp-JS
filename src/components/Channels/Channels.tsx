import React, { useContext } from "react";
import {
	CardHeader,
	Card,
	CardBody,
	Image,
	HStack,
	Heading,
	Box,
	VStack,
	Text,
} from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { useGetAllUsers } from "../../hooks/UserInfoHook";
import { EMPTY_AVATAR_IMAGE } from "../../Constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { useGetAllChannels } from "../../hooks/ChannelHook";
import { UnlockIcon } from "@chakra-ui/icons";
import { LockIcon } from "@chakra-ui/icons";

const Channels = () => {
	const { handleSelectUser } = useSelectUser();
	const {
		state: { user_id },
		activeUsers,
		color,
	} = useContext(AuthContext);
	const { data } = useGetAllChannels();
	const navigate = useNavigate();

	const handleClick = (channel: any) => {
		const payload = {
			id: channel._id,
			name: channel.channel_name,
            isLock: channel.is_private
		};
		handleSelectUser(payload);
		navigate("/");
	};
	console.log(data);
	return (
		<Box mx={4}>
			<HStack justifyContent="center" my={4}>
				<Heading color={color}>Channels</Heading>
			</HStack>
			<HStack gap={4}>
				{data &&
					data.channels.length > 0 &&
					data.channels.map((channel: any, index: number) => {
						const { channel_name, _id } = channel;
						return (
							<Card
								key={index}
								minWidth={300}
								cursor="pointer"
								onClick={() => handleClick(channel)}
								borderRadius={12}
								_hover={{
									bgColor: getHoverColor(color),
									color: getFontColor(color),
								}}
							>
								<CardBody>
									<HStack justifyContent="start" alignItems="center">
										{!channel.is_private ? (
											<UnlockIcon w={6} h={6} />
										) : (
											<LockIcon w={6} h={6} />
										)}
										<VStack gap={0} alignItems="start">
											<CardHeader pt={0} pb={1} pl={2}>
												<Text
													fontSize="large"
													fontWeight={500}
													_hover={{ color: getFontColor(color) }}
												>
													{channel_name}
												</Text>
											</CardHeader>
											{/* {activeUsers.length > 0 && activeUsers.includes(_id) && (
                        <Badge variant="solid" colorScheme="green">
                          active
                        </Badge>
                      )} */}
										</VStack>
									</HStack>
								</CardBody>
							</Card>
						);
					})}
			</HStack>
		</Box>
	);
};

export default Channels;