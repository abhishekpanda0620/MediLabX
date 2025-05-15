import React from 'react';
import { FaTimes, FaInfoCircle, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

/**
 * A reusable alert component for displaying notifications
 * 
 * @param {Object} props
 * @param {string} props.type - The alert type: 'error', 'warning', 'info', 'success'
 * @param {string} props.title - The main alert message
 * @param {string} props.message - Additional descriptive text (optional)
 * @param {function} props.onDismiss - Function to call when the alert is dismissed (optional)
 * @returns {React.ReactElement}
 */
const Alert = ({ type = 'info', title, message, onDismiss }) => {
  const types = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      titleColor: 'text-red-800',
      icon: <FaTimes className="text-red-500" />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      titleColor: 'text-yellow-800',
      icon: <FaExclamationTriangle className="text-yellow-500" />
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      titleColor: 'text-blue-800',
      icon: <FaInfoCircle className="text-blue-500" />
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      titleColor: 'text-green-800',
      icon: <FaCheck className="text-green-500" />
    }
  };

  const alertType = types[type] || types.info;

  return (
    <div className={`mb-4 ${alertType.bgColor} border-l-4 ${alertType.borderColor} p-4 rounded-lg shadow-sm flex items-start`}>
      <div className="mr-3 mt-0.5">{alertType.icon}</div>
      <div className="flex-grow">
        <p className={`font-medium ${alertType.titleColor}`}>{title}</p>
        {message && <p className={`text-sm ${alertType.textColor} mt-0.5`}>{message}</p>}
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className={`ml-3 ${alertType.textColor} hover:opacity-75 focus:outline-none`}
          aria-label="Dismiss"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
