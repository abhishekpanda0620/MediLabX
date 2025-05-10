import React from 'react';

const TableWrapper = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  );
};

export default TableWrapper;