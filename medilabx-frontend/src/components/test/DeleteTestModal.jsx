import React from 'react';
import { FaTimes } from 'react-icons/fa';

const DeleteTestModal = ({ isOpen, onClose, onDelete, test }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(test.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Delete Test</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this test?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold">{test?.name}</p>
            <p className="text-sm text-gray-600">
              {test?.parameters?.length} parameters will be deleted
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTestModal;