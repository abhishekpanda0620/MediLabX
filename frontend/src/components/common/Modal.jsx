import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * A reusable modal component with modern styling
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.icon - Icon to display next to the title
 * @param {string} props.headerBgClass - Optional CSS class for header background (defaults to indigo gradient)
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl' (defaults to 'md')
 * @param {boolean} props.loading - Whether the modal is in a loading state
 * @returns {React.ReactElement|null}
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  icon,
  headerBgClass = "bg-gradient-to-r from-indigo-700 to-indigo-500",
  footer,
  size = "md",
  loading = false
}) => {
  if (!isOpen) return null;

  // Modal size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full"
  };

  const modalTransitionClasses = "transition-all duration-300 ease-in-out";
  const modalSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        className={`relative bg-white rounded-xl shadow-2xl ${modalSizeClass} w-full mx-4 transform ${modalTransitionClasses} opacity-100 scale-100 max-h-[90vh]`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-4 rounded-t-xl ${headerBgClass} sticky top-0 z-10`}>
          <div className="flex items-center">
            {icon && <span className="mr-3 text-white">{icon}</span>}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:text-slate-600 hover:bg-opacity-20 rounded-full p-1.5 transition-colors duration-150"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
