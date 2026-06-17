import { ButtonHTMLAttributes, ElementType } from "react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "warning" | "info";
export type ButtonShape = "asymmetric" | "standard" | "rounded";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  isLoading?: boolean;
  icon?: LucideIcon | ElementType;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export type FieldType = "text" | "number" | "email" | "select" | "checkbox" | "textarea" | "multiselect";

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface ListContainerProps {
  children: React.ReactNode;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export interface ListItemProps {
  id: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText?: string;
  icon?: LucideIcon | ElementType;
  onEdit?: (id: string) => void;
  rightElement?: React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  pattern?: string;
  supportingText?: string;
  infoTooltip?: string;
}

export interface DynamicFormProps {
  title: string;
  subtitle1?: string;
  subtitle2?: string;
  fields: FormField[];
  submitLabel: string;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export interface ListContainerProps {
  children: React.ReactNode;
}

export interface IGestionPageProps {
    user: User;
}
export interface IControlPageProps {
    user: User;
}
export interface IAjustesPageProps {
    user: User;
}
export interface IChacerosPageProps {
    user: User;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
