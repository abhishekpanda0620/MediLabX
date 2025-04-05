import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const AddTestModal = ({ isOpen, onClose, onAdd, validationErrors = {} }) => {
  const [testName, setTestName] = useState('');
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState({
    parameter_name: '',
    unit: '',
    normal_range: ''
  });

  const handleAddParameter = () => {
    if (newParameter.parameter_name && newParameter.unit && newParameter.normal_range) {
      setParameters([...parameters, { ...newParameter }]);
      setNewParameter({ parameter_name: '', unit: '', normal_range: '' });
    }
  };

  const handleRemoveParameter = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (testName && parameters.length > 0) {
      onAdd({ name: testName, parameters });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white mx-2 md:mx-0 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Test</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Test Name
            </label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 ${
                validationErrors.name ? 'border-red-500' : ''
              }`}
              required
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.name[0]}</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Parameters</h3>
            {validationErrors.parameters && (
              <p className="mb-2 text-sm text-red-500">{validationErrors.parameters[0]}</p>
            )}
            <div className="grid  md:grid-cols-3 xl:grid-cols-4    gap-2 mb-2">
            <input
                type="text"
                placeholder="Parameter Name"
                value={newParameter.parameter_name}
                onChange={(e) => setNewParameter({ ...newParameter, parameter_name: e.target.value })}
                className="col-span-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Unit"
                value={newParameter.unit}
                onChange={(e) => setNewParameter({ ...newParameter, unit: e.target.value })}
                className="col-span-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Normal Range"
                value={newParameter.normal_range}
                onChange={(e) => setNewParameter({ ...newParameter, normal_range: e.target.value })}
                className="col-span-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddParameter}
                className="col-span-1 w-fit cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-2">
              {parameters.map((param, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 flex-grow">
                    <span>{param.parameter_name}</span>
                    <span>{param.unit}</span>
                    <span>{param.normal_range}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveParameter(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            {parameters.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Add at least one parameter</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={!testName || parameters.length === 0}
            >
              Save Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestModal;