import React, { useEffect, useState } from "react";
import { useFetchUserInfo } from "../../hooks/UserInfoHook";
import UserProfile from "./UserProfile";

type userInfoPorps = {
  contact: string;
  display_name: string;
  email: string;
  profile_picture: string;
  gender: string;
  tag: string;
  bio: string;
};

const initialState: userInfoPorps = {
  contact: "",
  display_name: "",
  email: "",
  profile_picture: "",
  gender: "",
  tag: "",
  bio: "",
};

const UserInfoPage = () => {
  const [state, setState] = useState<userInfoPorps>(initialState);

  const name = localStorage.getItem("username") || "";

  const { data } = useFetchUserInfo(name, ["userInfo"]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data.user).length > 0) {
        const {
          user: {
            userInfo: {
              contact,
              display_name,
              profile_picture,
              email,
              gender,
              tag,
              bio,
              cover_picture,
            },
          },
        } = data;
        setState((prev) => ({
          contact,
          display_name,
          profile_picture,
          email,
          gender,
          tag,
          bio,
          cover_picture,
        }));
      }
    }
  }, [data]);

  return <UserProfile data={state} setData={setState} />;
};

export default UserInfoPage;
