import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";

const ConfirmModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: any;
  onClose: any;
  onSubmit: any;
}) => {
  const { color } = useContext(AuthContext);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={12}>
        <ModalHeader>Confirm</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>Are you sure you want to Logout? </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            color={getFontColor(color)}
            bg={color}
            colorScheme="blue"
            mx={2}
            width={"80px"}
            onClick={onSubmit}
            borderRadius={12}
            _hover={{
              color: getFontColor(color),
              bgColor: getHoverColor(color),
            }}
          >
            Yes
          </Button>

          <Button borderRadius={12} mx={2} width={"80px"} onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
