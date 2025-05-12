import React from 'react';

const ReportParametersSection = ({ parameters, updateParameterValue, validationErrors, viewOnly }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Test Parameters</h3>
      <div className="space-y-3">
        {parameters.map((param, index) => (
          <div key={param.id || index} className="grid grid-cols-3 gap-2 items-center">
            <div className="text-gray-700">
              {param.parameter_name}
            </div>
            <div>
              {viewOnly ? (
                <div className="px-3 py-2 border rounded-lg bg-gray-50">
                  {param.value || ''}
                </div>
              ) : (
                <input
                  type="text"
                  value={param.value || ''}
                  onChange={(e) => updateParameterValue(index, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    validationErrors[`parameter_${index}`] ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter value"
                />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {param.unit} {param.normal_range ? `(${param.normal_range})` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportParametersSection;
