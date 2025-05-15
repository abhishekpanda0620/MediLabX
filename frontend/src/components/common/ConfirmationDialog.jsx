import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Modal, { ModalFooter } from './Modal';

/**
 * A reusable confirmation dialog component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls if the dialog is visible
 * @param {function} props.onClose - Function to call when the dialog is closed
 * @param {function} props.onConfirm - Function to call when the action is confirmed
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Primary message
 * @param {string} props.description - Additional description text
 * @param {string} props.type - Type of confirmation: 'danger', 'warning', 'info' (defaults to 'danger')
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {boolean} props.loading - Whether the dialog is in a loading state
 * @returns {React.ReactElement}
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  description,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  // Type-based styling
  const typeStyles = {
    danger: {
      headerClass: 'bg-red-500',
      messageClass: 'bg-red-50 border-l-4 border-red-500 text-red-800',
      descriptionClass: 'text-red-700',
      icon: <FaExclamationTriangle />,
      buttonType: 'danger'
    },
    warning: {
      headerClass: 'bg-yellow-500',
      messageClass: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
      descriptionClass: 'text-yellow-700',
      icon: <FaExclamationTriangle />,
      buttonType: 'warning'
    },
    info: {
      headerClass: 'bg-blue-500',
      messageClass: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
      descriptionClass: 'text-blue-700',
      icon: <FaExclamationTriangle />,
      buttonType: 'primary'
    }
  };

  const styles = typeStyles[type] || typeStyles.danger;

  // Custom footer with action buttons
  const footer = (
    <>
      <ModalFooter.CancelButton 
        onClick={onClose} 
        label={cancelText} 
        disabled={loading}
      />
      {type === 'danger' ? (
        <ModalFooter.DeleteButton
          onClick={onConfirm}
          label={confirmText}
          isLoading={loading}
          disabled={loading}
        />
      ) : (
        <ModalFooter.SubmitButton
          onClick={onConfirm}
          label={confirmText}
          isLoading={loading}
          disabled={loading}
        />
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={styles.icon}
      headerBgClass={styles.headerClass}
      footer={footer}
      size="md"
      loading={false}
    >
      <div className={`${styles.messageClass} rounded-lg p-4 mb-5`}>
        <p className="font-semibold">{message}</p>
        {description && (
          <p className={`text-sm ${styles.descriptionClass} mt-1`}>{description}</p>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
