import { Box, HStack, Stack } from "@chakra-ui/react";
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

  return (
    <div className="App">
      <Box>
        <HStack gap={0}>
          <ChatSidebar />
          {selectedUser !== null && selectedUser?.chatuser_id && <ChatRoom />}
          {selectedUser !== null && !selectedUser?.chatuser_id && (
            <ChannelRoom />
          )}
        </HStack>
      </Box>
    </div>
  );
}

export default App;
