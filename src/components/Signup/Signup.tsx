import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSignup } from "../../hooks/AuthenticationHooks";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";

type SignupProps = {
  username: string;
  password: string;
  email: string;
};

type ErrorProps = {
  isError: boolean;
  message: string;
};

const initialState: SignupProps = {
  username: "",
  password: "",
  email: ""
};

const initialError: ErrorProps = {
  isError: false,
  message: "string",
};

const SignUpPage = () => {
  const { mutate: postSignup } = useSignup();
  const { color } = useContext(AuthContext);
  const navigate = useNavigate();
  const [state, setState] = useState<SignupProps>(initialState);
  const [errorState, setErrorState] = useState(initialError);
  const { password, username, email } = state;
  const { isError, message } = errorState;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = () => {
    postSignup(state, {
      onSuccess: (res) => {
        console.log("res", res)
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("user_id", res.user._id);
        navigate("/");
      },
      onError: (err: any) => {
        console.log("errir",err);
        const { message } = err.response.data;
        setErrorState((prev) => ({
          ...prev,
          isError: true,
          message: message,
        }));
      },
    });
  };

  return (
    <Box>
      <Flex
        align="center"
        justify="center"
        minHeight="100vh"
        minWidth="100vw"
        // bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          {/* <Stack align="center">
          <Heading fontSize="4xl">Welcome to PanChat</Heading>
        </Stack> */}
          <Stack align="center">
            <Heading fontSize="4xl">Sign Up</Heading>
          </Stack>
          <Box rounded="lg" bg="transparent" boxShadow="lg" p={8}>
            <Stack spacing={4}>
              <FormControl isRequired id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </FormControl>
              <Text>
                Already have an account try&nbsp;
                <Button color={color} variant="link">
                  <Link to="/login"> Log in </Link>
                </Button>{" "}
                here
              </Text>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={color}
                  color={getFontColor(color)}
                  _hover={{
                    bgColor: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
              </Stack>
              {isError && (
                <Text fontSize="md" color="red">
                  {message}
                </Text>
              )}
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SignUpPage;
