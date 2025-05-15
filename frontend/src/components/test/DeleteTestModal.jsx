import React from 'react';
import { ConfirmationDialog } from '../../components/common';

const DeleteTestModal = ({ isOpen, onClose, onDelete, test }) => {
  const handleDelete = () => {
    if (test?.id) {
      onDelete(test.id);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Test"
      message="Are you sure you want to delete this test?"
      description={`${test?.name || 'This test'} with ${test?.parameters?.length || 0} parameters will be permanently deleted.`}
      type="danger"
      confirmText="Delete Test"
      cancelText="Cancel"
    />
  );
};

export default DeleteTestModal;