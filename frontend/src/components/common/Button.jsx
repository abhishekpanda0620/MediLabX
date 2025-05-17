import React from 'react';

/**
 * Button component for actions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the button
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'outline', 'danger'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.icon - Optional icon to display before text
 * @returns {React.ReactElement}
 */
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon,
  ...props 
}) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  };
  
  const buttonClass = `
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    inline-flex items-center justify-center
    transition-colors duration-200 ease-in-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
