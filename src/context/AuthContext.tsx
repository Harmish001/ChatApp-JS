import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUserLoggedIn } from "../hooks/AuthenticationHooks";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import LoggedInUser from "../hooks/LoggedInUser";

export const AuthContext = createContext<any>(null);

const initalAuthState = {
  username: "",
  user_id: null,
  isUserLoggedIn: false,
};

export function getUser() {
  const user = localStorage.getItem("user_id") || "";
  return user;
}

const AuthContextProvider = ({ children }: any) => {
  const [state, setState] = useState(initalAuthState);
  const [activeUsers, setActiveUsers] = useState([]);
  const [color, setColor] = useState("rgb(181,115,236)");

  const navigate = useNavigate();
  const { data, isLoading, isSuccess } = useUserLoggedIn(
    getUser(),
    (err: any) => {
      console.log(err);
    }
  );
  const user = useMemo(() => {
    return (
      data &&
      data.user &&
      new LoggedInUser(
        data?.user?.userInfo
          ? data.user?.userInfo.display_name
          : data.user?.username,
        data?.user?._id,
        data?.user?.userInfo && data?.user?.userInfo.profile_picture
      )
    );
  }, [data]);

  useEffect(() => {
    if (getUser() == "") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (data && isSuccess) {
      const { _id, username, theme_color } = data.user;
      setState({
        username: username,
        user_id: _id,
        isUserLoggedIn: true,
      });
      if (theme_color) {
        setColor(theme_color);
      }
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        setState,
        user,
        setActiveUsers,
        activeUsers,
        color,
        setColor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
