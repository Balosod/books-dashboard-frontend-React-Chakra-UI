import { Book } from "./bookInterface";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBook: Book | null;
  onSave: (data: { name: string; description: string }) => void;
}
