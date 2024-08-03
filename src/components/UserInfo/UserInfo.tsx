import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  useFetchUserInfo,
  usePostUserInfo,
  useUpdateUserInfo,
} from "../../hooks/UserInfoHook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { axiosInstance } from "../../lib/Requests";
import axios from "axios";
import UserProfile from "./UserProfile";

type userInfoPorps = {
  contact: string;
  display_name: string;
  email: string;
  profile_picture: string;
  gender: string;
};

const initialState: userInfoPorps = {
  contact: "",
  display_name: "",
  email: "",
  profile_picture: "",
  gender: "",
};

const UserInfoPage = () => {
  const [state, setState] = useState<userInfoPorps>(initialState);

  const name = localStorage.getItem("username") || "";

  const { data } = useFetchUserInfo(name, ["userInfo"]);

  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      if (Object.keys(data.user).length > 0) {
        const {
          user: {
            userInfo: { contact, display_name, profile_picture, email, gender },
          },
        } = data;
        setState((prev) => ({ contact, display_name, profile_picture, email, gender }));
        setIsUpdateInfo(true);
      }
    }
  }, [data]);

  return <UserProfile data={state} setData={setState} />;
};

export default UserInfoPage;
