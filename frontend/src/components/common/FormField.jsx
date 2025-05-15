import React from 'react';

/**
 * A reusable form field component with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.id - HTML id attribute for the input
 * @param {string} props.name - Name of the form field
 * @param {string} props.label - Label text
 * @param {string} props.type - Input type (text, email, password, etc)
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.error - Error message if any
 * @param {React.ReactNode} props.icon - Optional icon to display in the input
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.options - Options for select inputs
 * @param {boolean} props.required - Whether the field is required
 * @returns {React.ReactElement}
 */
const FormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  placeholder,
  options = [],
  required = false,
  ...restProps
}) => {
  const inputClass = `${icon ? 'pl-10' : 'pl-4'} w-full px-4 py-3 rounded-lg border ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`;
  
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`${inputClass} bg-white`}
            required={required}
            {...restProps}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option 
                key={option.value || option} 
                value={option.value || option}
                className="capitalize"
              >
                {option.label || option.replace('_', ' ')}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
            {...restProps}
          />
        );
      
      default:
        return (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
            {...restProps}
          />
        );
    }
  };

  return (
    <div className="mb-5">
      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={id}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {renderInput()}
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormField;
