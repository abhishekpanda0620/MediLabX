import React from 'react';
import TableWrapper from './TableWrapper';

/**
 * A reusable data table component with consistent styling
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.loading - Whether the table is in a loading state
 * @param {string} props.emptyMessage - Message to display when there's no data
 * @param {function} props.onRowClick - Optional callback when a row is clicked
 * @returns {React.ReactElement}
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick
}) => {
  return (
    <TableWrapper>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={onRowClick ? () => onRowClick(item, rowIndex) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                  >
                    {column.render 
                      ? column.render(item, rowIndex) 
                      : item[column.accessor] || ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </TableWrapper>
  );
};

/**
 * Helper functions for DataTable component
 */
export const DataTableHelpers = {
  /**
   * Creates a badge/pill styled element
   * 
   * @param {string} text - Text to display in the badge
   * @param {string} type - Type of badge: 'primary', 'success', 'warning', 'danger', 'info', 'gray'
   * @returns {React.ReactElement}
   */
  Badge: ({ text, type = 'primary' }) => {
    const badgeClasses = {
      primary: 'bg-indigo-100 text-indigo-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const badgeClass = badgeClasses[type] || badgeClasses.primary;

    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${badgeClass}`}>
        {text}
      </span>
    );
  },

  /**
   * Creates an actions container with buttons
   * 
   * @param {Array} actions - Array of action objects
   * @param {Object} item - The data item for the row
   * @returns {React.ReactElement}
   */
  Actions: ({ actions, item }) => (
    <div className="flex items-center space-x-3">
      {actions.map((action, index) => {
        // Skip rendering if shouldShow is provided and returns false
        if (action.shouldShow && !action.shouldShow(item)) {
          return null;
        }

        const bgColorClass = {
          primary: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800',
          danger: 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800',
          warning: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800',
          success: 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800',
          info: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800',
          gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }[action.type || 'primary'];

        return (
          <button
            key={index}
            className={`p-1.5 rounded-full ${bgColorClass} transition-colors duration-150`}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(item);
            }}
            title={action.label || ''}
            disabled={action.disabled}
          >
            {action.icon}
          </button>
        );
      })}
    </div>
  )
};

export default DataTable;
