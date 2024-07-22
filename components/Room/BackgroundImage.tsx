import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  SimpleGrid,
  Image,
  Box,
  HStack,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "./Room";

const BackgroundImageModal = ({ isOpen, onClose, onSelect, onRemove }: any) => {
  const { color } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const backgroundImages = [
    "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    // Add more image paths as needed
  ];

  const handleImageSelect = (image: any) => {
    setSelectedImage(image);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose a Background Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} spacing={4}>
            {backgroundImages.map((image, index) => (
              <Box
                key={index}
                borderWidth={selectedImage === image ? "2px" : "0"}
                borderColor={selectedImage === image ? color : "gray.200"}
                borderStyle="solid"
                borderRadius="12"
                overflow="hidden"
                cursor="pointer"
                onClick={() => handleImageSelect(image)}
              >
                <Image src={image} alt={`Background ${index + 1}`} />
              </Box>
            ))}
          </SimpleGrid>
          <HStack justifyContent="space-between">
            <Button
              mt={4}
              mb={4}
              color={color}
              variant="outline"
              onClick={onRemove}
              borderRadius={12}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
            >
              Remove Background
            </Button>
            <Button
              mt={4}
              mb={4}
              onClick={handleConfirm}
              bgColor={color}
              isDisabled={!selectedImage}
              borderRadius={12}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
            >
              Confirm Selection
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BackgroundImageModal;
