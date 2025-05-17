import React from 'react';

/**
 * Badge component for displaying status indicators
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the badge
 * @param {string} props.color - Color of the badge: 'gray', 'blue', 'green', 'red', 'yellow', 'purple'
 * @returns {React.ReactElement}
 */
function Badge({ children, color = 'gray' }) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const badgeClass = colorClasses[color] || colorClasses.gray;

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${badgeClass}`}>
      {children}
    </span>
  );
}

export default Badge;
