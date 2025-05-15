import { ReactNode, ChangeEvent, MouseEventHandler } from 'react';

// Modal Component Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  headerBgClass?: string;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  loading?: boolean;
  children?: ReactNode;
}

export namespace ModalFooter {
  export interface ButtonProps {
    onClick: MouseEventHandler;
    label?: string;
    disabled?: boolean;
  }

  export interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
  }

  export function CancelButton(props: ButtonProps): JSX.Element;
  export function SubmitButton(props: LoadingButtonProps): JSX.Element;
  export function DeleteButton(props: LoadingButtonProps): JSX.Element;
}

// DataTable Component Types
export interface Column {
  header: string;
  accessor?: string;
  className?: string;
  width?: string;
  render?: (item: any, rowIndex: number) => ReactNode;
}

export interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: any, rowIndex: number) => void;
}

export namespace DataTableHelpers {
  export interface BadgeProps {
    text: string;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  }

  export interface ActionItem {
    icon: ReactNode;
    type?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'gray';
    label?: string;
    onClick: (item: any) => void;
    disabled?: boolean;
    shouldShow?: (item: any) => boolean;
  }

  export interface ActionsProps {
    actions: ActionItem[];
    item: any;
  }

  export function Badge(props: BadgeProps): JSX.Element;
  export function Actions(props: ActionsProps): JSX.Element;
}

// FormField Component Types
export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon?: ReactNode;
  placeholder?: string;
  options?: Array<string | { value: string; label: string }>;
  required?: boolean;
  [key: string]: any;
}

// ConfirmationDialog Component Types
export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  description?: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

// Alert Component Types
export interface AlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message?: string;
  onDismiss?: () => void;
}

// Component Exports
export function Modal(props: ModalProps): JSX.Element;
export function DataTable(props: DataTableProps): JSX.Element;
export function FormField(props: FormFieldProps): JSX.Element;
export function ConfirmationDialog(props: ConfirmationDialogProps): JSX.Element;
export function Alert(props: AlertProps): JSX.Element;
export { default as TableWrapper } from './TableWrapper';
