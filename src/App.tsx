import { Box, HStack, Stack, useMediaQuery } from "@chakra-ui/react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ChatSidebar from "./components/Sidebar/Sidebar";
import { ChatRoom } from "./components/Room/Room";
import { useContext, useEffect, useState } from "react";
import { useSelectUser } from "./context/SelectedUser";
import { socket } from "./providers/Routes";
import ChannelRoom from "./components/Room/ChannelRoom";

function App() {
	const { selectedUser, selectedChannel } = useSelectUser();
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const isTablet = useMediaQuery("(min-width: 800px)")[0];

	useEffect(() => {
		socket.connect();
		socket.on("connection", () => {
			console.log("socket connected");
		});
		return () => {
			socket.off("connection");
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		setIsSidebarVisible(isTablet);
	}, [isTablet]);

	return (
		<div className="App">
			{!isSidebarVisible && (
				<Box>
					<HStack gap={0}>
						{selectedUser !== null && selectedUser?.type == "chatRoom" && (
							<ChatRoom />
						)}
						{selectedUser !== null &&
							selectedUser.id != null &&
							!selectedUser?.chatuser_id && <ChannelRoom />}
					</HStack>
				</Box>
			)}
			{isSidebarVisible && (
				<Box>
					<HStack gap={0}>
						<ChatSidebar />
						{selectedUser !== null && selectedUser?.type == "chatRoom" && (
							<ChatRoom />
						)}
						{selectedUser !== null &&
							selectedUser.id != null &&
							!selectedUser?.chatuser_id && <ChannelRoom />}
					</HStack>
				</Box>
			)}
		</div>
	);
}

export default App;
