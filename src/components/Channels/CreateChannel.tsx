import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { Ref, useContext } from "react";
import { useCreateChannel } from "../../hooks/ChannelHook";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";

const CreateChannel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    color,
    state: { user_id },
  } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const checkBoxRef = React.useRef<HTMLInputElement>(null);

  const { mutate: CreateChannel } = useCreateChannel();

  const onSubmit = () => {
    if (
      inputRef.current &&
      (inputRef.current?.value == null || inputRef.current?.value.length == 0)
    )
      return;
    const payload = {
      channel_name: inputRef.current?.value,
      is_private: !checkBoxRef.current?.checked,
      userId: user_id,
    };
    CreateChannel(payload, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["channels"] });
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Channel name</FormLabel>
            <Input ref={inputRef} required placeholder="Channel name" />
          </FormControl>

          <FormControl mt={4}>
            <HStack alignItems="baseline">
              <FormLabel>Public Channel</FormLabel>
              <Checkbox ref={checkBoxRef} defaultChecked></Checkbox>
            </HStack>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            borderRadius="12"
            cursor="pointer"
            _hover={{
              bgColor: getHoverColor(color),
              color: getFontColor(color),
            }}
            bg={color}
            color={getFontColor(color)}
            mr={3}
            onClick={onSubmit}
          >
            Save
          </Button>
          <Button borderRadius="12" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannel;
