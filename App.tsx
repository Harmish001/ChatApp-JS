import { Box, HStack, Stack } from "@chakra-ui/react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ChatSidebar from "./components/Sidebar/Sidebar";
import { ChatRoom } from "./components/Room/Room";
import { useContext, useEffect, useState } from "react";
import { useSelectUser } from "./context/SelectedUser";
import { socket } from "./providers/Routes";


function App() {
  const { selectedUser } = useSelectUser();

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
        <HStack>
          <ChatSidebar />
          {selectedUser !== null && <ChatRoom />}
        </HStack>
      </Box>
    </div>
  );
}

export default App;
