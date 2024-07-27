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
import React, { Ref } from "react";
import { useCreateChannel } from "../../hooks/ChannelHook";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CreateChannel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const checkBoxRef = React.useRef<HTMLInputElement>(null);

  const { mutate } = useCreateChannel();

  const onSubmit = () => {
    const payload = {
      channel_name: inputRef.current?.value,
      is_private: !checkBoxRef.current?.checked,
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allChannels"] });
        navigate("/channels");
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
            <Input ref={inputRef} placeholder="Channel name" />
          </FormControl>

          <FormControl mt={4}>
            <HStack alignItems="baseline">
              <FormLabel>Public Channel</FormLabel>
              <Checkbox ref={checkBoxRef} defaultChecked></Checkbox>
            </HStack>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannel;
