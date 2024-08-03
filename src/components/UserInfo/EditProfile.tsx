import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { getFontColor, getHoverColor } from "../Room/Room";
import { AuthContext } from "../../context/AuthContext";
import { useUpdateUserInfo } from "../../hooks/UserInfoHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = ({ data, setData, setIsEdit }: any) => {
  const { color } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { mutate: UpdateUserInfo } = useUpdateUserInfo();

  const isMobile = useMediaQuery("(max-width: 1025px)")[0];

  const { contact, display_name, email, profile_picture, gender, tag, bio } =
    data;

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const imagData = e.target.files[0];
      const fileReader = new FileReader();
      try {
        fileReader.onload = async (e: any) => {
          const arrayBuffer = e.target.result;
          await axios
            .post(
              `${process.env.REACT_APP_URL}/uploadImage/${data.user.user_id}`,
              arrayBuffer,
              {
                headers: {
                  "Content-Type": imagData.type,
                  "Content-Disposition": `attachment; filename="${imagData.name}"`,
                },
                transformRequest: [(data) => data],
              }
            )
            .then((res) => {
              setData((prev: any) => ({
                ...prev,
                profile_picture: res.data.image,
              }));
            });
        };
        fileReader.readAsArrayBuffer(e.target.files[0]);
      } catch (error) {
        throw error;
      }
      const url = URL.createObjectURL(e.target.files[0]);
    }
  };

  const removeProfilePic = () => {
    setData((prev: any) => ({ ...prev, profile_picture: "" }));
  };

  const removeCoverPic = () => {
    setData((prev: any) => ({ ...prev, cover_picture: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    const payload = { ...data, username: display_name, user_id: user.id };
    console.log(payload);
    UpdateUserInfo(payload, {
      onSuccess: () => {
        setIsEdit(false);
      },
    });
  };

  const handleGenderChange = (e: any) => {
    setData((prev: any) => ({ ...prev, gender: e.target.value }));
  };

  const handleBioChange = (e: any) => {
    setData((prev: any) => ({ ...prev, bio: e.target.value }));
  };

  const handleSkip = () => {
    setIsEdit(false);
  };

  return (
    <React.Fragment>
      <Flex align="center" justify="center" px={4} mt={!isMobile ? 8 : 2}>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={!isMobile ? 8 : 5}
        >
          <Stack justifyContent="center" alignItems="center">
            <Text fontSize="x-large" fontWeight="700" color={color}>
              Profile
            </Text>
          </Stack>
          <Stack spacing={4}>
            <HStack wrap="wrap">
              <FormControl id="displayName">
                <FormLabel>Display Name</FormLabel>
                <Input
                  type="text"
                  name="display_name"
                  value={display_name}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="contact">
                <FormLabel>Phone no.</FormLabel>
                <Input
                  type="tel"
                  value={contact}
                  name="contact"
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="gender">
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Select Gender"
                  value={gender}
                  onChange={handleGenderChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <FormControl id="tag">
                <FormLabel>Tag</FormLabel>
                <Input
                  type="text"
                  value={tag}
                  name="tag"
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="bio">
                <FormLabel>Bio</FormLabel>
                <Textarea value={bio} name="bio" onChange={handleBioChange} />
              </FormControl>
            </HStack>
            <HStack justifyContent="right" alignItems="center">
              <FormControl id="profilePic" >
                <FormLabel>Profile Picture</FormLabel>
                <Avatar ml={4} size="xl" src={profile_picture}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={removeProfilePic}
                  />
                </Avatar>
                <HStack mt={2}>
                  <Button
                    as="label"
                    htmlFor="file-upload"
                    cursor="pointer"
                    bg={color}
                    color={getFontColor(color)}
                    _hover={{
                      bg: getHoverColor(color),
                      color: getFontColor(color),
                    }}
                  >
                    Upload Image
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    hidden
                  />
                </HStack>
              </FormControl>
            </HStack>
              <Stack spacing={10} pt={2}>
                <HStack justifyContent="center">
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={color}
                    color={getFontColor(color)}
                    _hover={{
                      bg: getHoverColor(color),
                      color: getFontColor(color),
                    }}
                    onClick={handleSubmit}
                  >
                    Update Profile
                  </Button>
                  <Button size="lg" onClick={handleSkip} mx={2}>
                    Skip for now
                  </Button>
                </HStack>
              </Stack>
          </Stack>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default EditProfile;
