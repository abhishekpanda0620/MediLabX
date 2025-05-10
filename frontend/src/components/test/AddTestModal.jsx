import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const AddTestModal = ({ isOpen, onClose, onAdd, validationErrors = {}, categories = [] }) => {
  const [testData, setTestData] = useState({
    name: '',
    description: '',
    category: '',
    code: '',
    turn_around_time: '',
    specimen_requirements: '',
    preparation_instructions: '',
    price: '',
    fasting_required: false,
    fasting_duration: '',
    parameters: []
  });

  const [newParameter, setNewParameter] = useState({
    parameter_name: '',
    unit: '',
    normal_range: '',
    description: '',
    reference_ranges: [],
    critical_low: '',
    critical_high: '',
    interpretation_guide: '',
    method: '',
    instrument: ''
  });

  const [showParameterForm, setShowParameterForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParameterInputChange = (e) => {
    const { name, value } = e.target;
    setNewParameter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddParameter = () => {
    if (newParameter.parameter_name && newParameter.unit && newParameter.normal_range) {
      setTestData(prev => ({
        ...prev,
        parameters: [...prev.parameters, { ...newParameter }]
      }));
      setNewParameter({
        parameter_name: '',
        unit: '',
        normal_range: '',
        description: '',
        reference_ranges: [],
        critical_low: '',
        critical_high: '',
        interpretation_guide: '',
        method: '',
        instrument: ''
      });
      setShowParameterForm(false);
    }
  };

  const handleRemoveParameter = (index) => {
    setTestData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (testData.name && testData.parameters.length > 0) {
      onAdd(testData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add New Test</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Name*
              </label>
              <input
                type="text"
                name="name"
                value={testData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                name="category"
                value={testData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.category[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Code
              </label>
              <input
                type="text"
                name="code"
                value={testData.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)*
              </label>
              <input
                type="number"
                name="price"
                value={testData.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.01"
                required
              />
              {validationErrors.price && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.price[0]}</p>
              )}
            </div>
          </div>

          {/* Test Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Test Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specimen Requirements
                </label>
                <input
                  type="text"
                  name="specimen_requirements"
                  value={testData.specimen_requirements}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turn Around Time (hours)
                </label>
                <input
                  type="number"
                  name="turn_around_time"
                  value={testData.turn_around_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="fasting_required"
                  checked={testData.fasting_required}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Fasting Required
                </label>
              </div>

              {testData.fasting_required && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fasting Duration (hours)
                  </label>
                  <input
                    type="number"
                    name="fasting_duration"
                    value={testData.fasting_duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    min="1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description and Instructions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={testData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preparation Instructions
              </label>
              <textarea
                name="preparation_instructions"
                value={testData.preparation_instructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg border-gray-300"
              />
            </div>
          </div>

          {/* Parameters Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Parameters</h3>
              <button
                type="button"
                onClick={() => setShowParameterForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Parameter
              </button>
            </div>

            {validationErrors.parameters && (
              <p className="text-sm text-red-500">{validationErrors.parameters[0]}</p>
            )}

            {showParameterForm && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parameter Name*
                    </label>
                    <input
                      type="text"
                      name="parameter_name"
                      value={newParameter.parameter_name}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit*
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={newParameter.unit}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Normal Range*
                    </label>
                    <input
                      type="text"
                      name="normal_range"
                      value={newParameter.normal_range}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <input
                      type="text"
                      name="method"
                      value={newParameter.method}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Critical Low
                    </label>
                    <input
                      type="text"
                      name="critical_low"
                      value={newParameter.critical_low}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Critical High
                    </label>
                    <input
                      type="text"
                      name="critical_high"
                      value={newParameter.critical_high}
                      onChange={handleParameterInputChange}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newParameter.description}
                      onChange={handleParameterInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interpretation Guide
                    </label>
                    <textarea
                      name="interpretation_guide"
                      value={newParameter.interpretation_guide}
                      onChange={handleParameterInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowParameterForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddParameter}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    disabled={!newParameter.parameter_name || !newParameter.unit || !newParameter.normal_range}
                  >
                    Add Parameter
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {testData.parameters.map((param, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">{param.parameter_name}</div>
                    <div className="text-sm text-gray-600">
                      Unit: {param.unit} | Normal Range: {param.normal_range}
                    </div>
                    {param.method && (
                      <div className="text-sm text-gray-600">Method: {param.method}</div>
                    )}
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

              {testData.parameters.length === 0 && (
                <p className="text-sm text-gray-500">Add at least one parameter</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={!testData.name || testData.parameters.length === 0}
            >
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestModal;