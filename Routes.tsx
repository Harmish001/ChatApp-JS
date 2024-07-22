import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import AuthContextProvider, { AuthContext } from "../context/AuthContext";
import { SelectedUserProvider } from "../context/SelectedUser";
import { io } from "socket.io-client";
import { Button, useToast } from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import { MoonIcon } from "@chakra-ui/icons";
import { useUpdateTheme } from "../hooks/AuthenticationHooks";
import { getFontColor, getHoverColor } from "../components/Room/Room";

const App = lazy(() => import("../App"));
const Users = lazy(() => import("../components/Users/UserList"));
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
    mutate({ id: user.id, color: colorValue });
    setColor(colorValue);
  };

  return (
    <>
      {user && user.id && <Navbar />}
      {children}
      {user && user.id && (
        <div style={{ position: "fixed", bottom: 35, left: 35 }}>
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
          <Button
            borderRadius={12}
            bgColor={color}
            _hover={{
              bgColor: getHoverColor(color),
              color: getFontColor(color),
            }}
            onClick={handleClick}
          >
            <MoonIcon style={{ color: getFontColor(color) }} />
          </Button>
        </div>
      )}
    </>
  );
};
