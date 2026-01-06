import React, { useState, useEffect } from "react";
import { ModalProps } from "../interface/modalProps"; // TypeScript interface for props
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  Stack,
  Button,
} from "@chakra-ui/react"; // Chakra UI components for modal and form

// Modal component to add or edit a book
const BookModal: React.FC<ModalProps> = ({
  isOpen, // controls whether modal is open
  onClose, // function to close the modal
  editingBook, // optional book object for editing
  onSave, // function called with form data on save
}) => {
  // Local state for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Update form fields when editingBook changes
  useEffect(() => {
    if (editingBook) {
      setName(editingBook.name); // populate name if editing
      setDescription(editingBook.description); // populate description if editing
    } else {
      setName(""); // reset fields if adding a new book
      setDescription("");
    }
  }, [editingBook]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* Modal header changes based on add/edit */}
        <ModalHeader>{editingBook ? "Edit Book" : "Add Book"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            {/* Book name input */}
            <Input
              placeholder="Name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            {/* Book description textarea */}
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          {/* Save button calls onSave with current form values */}
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => onSave({ name, description })}
          >
            Save
          </Button>
          {/* Cancel button closes the modal */}
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookModal;
