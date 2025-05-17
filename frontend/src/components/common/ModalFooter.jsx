import React from 'react';
import Button from './Button';

const ModalFooter = {
  /**
   * A standardized cancel button for modal footers
   * 
   * @param {Object} props
   * @param {Function} props.onClick - Click handler
   * @param {string} props.label - Button label, defaults to "Cancel"
   * @param {boolean} props.disabled - Whether the button is disabled
   * @returns {React.ReactElement}
   */
  CancelButton: ({ onClick, label = "Cancel", disabled = false }) => (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  ),

  /**
   * A standardized submit button for modal footers
   * 
   * @param {Object} props
   * @param {Function} props.onClick - Click handler
   * @param {string} props.label - Button label, defaults to "Submit"
   * @param {boolean} props.isLoading - Whether the button is in loading state
   * @param {boolean} props.disabled - Whether the button is disabled
   * @returns {React.ReactElement}
   */
  SubmitButton: ({ onClick, label = "Submit", isLoading = false, disabled = false }) => (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Loading...' : label}
    </Button>
  ),

  /**
   * A standardized delete button for modal footers
   * 
   * @param {Object} props
   * @param {Function} props.onClick - Click handler
   * @param {string} props.label - Button label, defaults to "Delete"
   * @param {boolean} props.isLoading - Whether the button is in loading state
   * @param {boolean} props.disabled - Whether the button is disabled
   * @returns {React.ReactElement}
   */
  DeleteButton: ({ onClick, label = "Delete", isLoading = false, disabled = false }) => (
    <Button
      variant="danger"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Loading...' : label}
    </Button>
  )
};

export default ModalFooter;

