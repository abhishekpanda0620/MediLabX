import React from 'react';

/**
 * Table component for displaying data
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions with header and accessor or cell render function
 * @param {Array} props.data - Data array to display in the table
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement}
 */
const Table = ({ columns, data, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.cell ? (
                    column.cell(item)
                  ) : column.accessor ? (
                    item[column.accessor]
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
