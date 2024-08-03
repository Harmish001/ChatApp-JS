import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import AuthContextProvider, { AuthContext } from "../context/AuthContext";
import { SelectedUserProvider } from "../context/SelectedUser";
import { io } from "socket.io-client";
import { Button, HStack, keyframes, Text, useToast } from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import { MoonIcon } from "@chakra-ui/icons";
import { useUpdateTheme } from "../hooks/AuthenticationHooks";
import { getFontColor, getHoverColor } from "../components/Room/Room";

const App = lazy(() => import("../App"));
const Users = lazy(() => import("../components/Users/UserList"));
const Channels = lazy(() => import("../components/Channels/Channels"));
const SignUpPage = lazy(() => import("../components/Signup/Signup"));
const LoginPage = lazy(() => import("../components/Login/Login"));
const UserInfoPage = lazy(() => import("../components/UserInfo/UserInfo"));

const URL = "http://localhost:5000";
export const socket = io(URL);
export function RouterProviders() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <SelectedUserProvider>
          <Layout>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" Component={App} />
                <Route path="/users" Component={Users} />
                <Route path="/channels" Component={Channels} />
                <Route path="/signup" Component={SignUpPage} />
                <Route path="/login" Component={LoginPage} />
                <Route path="/user-info" Component={UserInfoPage} />
              </Routes>
            </Suspense>
          </Layout>
        </SelectedUserProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

const Layout = ({ children }: any) => {
  const { user, setColor, color } = useContext(AuthContext);
  const { mutate } = useUpdateTheme();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleChange = (value: any) => {
    const { r, g, b } = value.rgb;
    const colorValue = `rgb(${r},${g},${b})`;
    if (r == 255 && g == 255 && b == 255) {
      mutate({ id: user.id, color: `rgb(219,219,219)` });
      setColor(`rgb(219,219,219)`);
    } else {
      mutate({ id: user.id, color: colorValue });
      setColor(colorValue);
    }
  };
  const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

  return (
    <>
      {user && user.id && <Navbar />}
      {children}
      {user && user.id && (
        <div style={{ position: "fixed", bottom: 10, left: 15 }}>
          {open && (
            <div>
              <div
                onClick={handleClose}
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                }}
              />
              <SketchPicker
                color={color}
                onChange={handleChange}
                disableAlpha
              />
            </div>
          )}
          <HStack>
            <Button
              borderRadius={12}
              gap={0}
              px={1}
              bgColor={color}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
              onClick={handleClick}
            >
              <MoonIcon style={{ color: getFontColor(color) }} />
            </Button>
            {window.location.pathname == "/" && (
              <Link to={"/channels"}>
                <Button
                  borderColor={color}
                  _hover={{
                    bgColor: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                  mx={3}
                  variant="outline"
                  borderRadius={12}
                  width={"80%"}
                  animation={`${pulseAnimation} 1.25s ease-in-out infinite`}
                  transition="all 0.2s"
                >
                  <Text fontSize="small" fontWeight={500}>
                    + Browse Channels
                  </Text>
                </Button>
              </Link>
            )}
            {/* <Button
              borderColor={color}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
              variant="outline"
              borderRadius={12}
              width={"100%"}
              ml={2}
              animation={`${pulseAnimation} 1.25s ease-in-out infinite`}
              transition="all 0.2s"
            >
              <Link to={"/users"}>
                <Text fontSize="small" fontWeight={500}>
                  + New Channel{" "}
                </Text>
              </Link>
            </Button> */}
          </HStack>
        </div>
      )}
    </>
  );
};
