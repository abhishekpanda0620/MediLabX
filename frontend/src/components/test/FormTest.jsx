import React from 'react';
import { FormField } from '../common';
import { FaPlus, FaTimes } from 'react-icons/fa';

/**
 * A reusable form component for test data
 */
const FormTest = ({ 
  testData, 
  onChange, 
  onParameterChange,
  onAddParameter,
  onRemoveParameter,
  showParameterForm,
  setShowParameterForm,
  newParameter,
  validationErrors = {},
  categories = [] 
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField
            label="Test Name"
            id="test-name"
            name="name"
            type="text"
            placeholder="e.g., Complete Blood Count"
            value={testData.name}
            onChange={onChange}
            error={validationErrors?.name}
            required
          />
        </div>
        <div>
          <FormField
            label="Test Code"
            id="test-code"
            name="code"
            type="text"
            placeholder="e.g., CBC-001"
            value={testData.code}
            onChange={onChange}
            error={validationErrors?.code}
          />
        </div>
        <div>
          <FormField
            label="Category"
            id="test-category"
            name="category"
            type="select"
            value={testData.category}
            onChange={onChange}
            error={validationErrors?.category}
            required
            options={categories.length > 0 ? categories : [
              { value: 'hematology', label: 'Hematology' },
              { value: 'chemistry', label: 'Clinical Chemistry' },
              { value: 'immunology', label: 'Immunology' },
              { value: 'microbiology', label: 'Microbiology' },
              { value: 'pathology', label: 'Pathology' },
              { value: 'imaging', label: 'Imaging' },
              { value: 'genetic', label: 'Genetic Testing' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
        <div>
          <FormField
            label="Price"
            id="test-price"
            name="price"
            type="number"
            placeholder="Price in dollars"
            value={testData.price}
            onChange={onChange}
            error={validationErrors?.price}
          />
        </div>
      </div>

      {/* Test Description */}
      <div>
        <FormField
          label="Test Description"
          id="test-description"
          name="description"
          type="textarea"
          placeholder="Enter a detailed description of the test"
          value={testData.description}
          onChange={onChange}
          error={validationErrors?.description}
        />
      </div>

      {/* Test Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField
            label="Specimen Requirements"
            id="test-specimen"
            name="specimen_requirements"
            type="text"
            placeholder="e.g., 5ml Venous blood in EDTA tube"
            value={testData.specimen_requirements}
            onChange={onChange}
            error={validationErrors?.specimen_requirements}
          />
        </div>
        <div>
          <FormField
            label="Turn Around Time (hours)"
            id="test-tat"
            name="turn_around_time"
            type="number"
            placeholder="e.g., 24"
            value={testData.turn_around_time}
            onChange={onChange}
            error={validationErrors?.turn_around_time}
          />
        </div>
        <div>
          <FormField
            label="Preparation Instructions"
            id="test-prep"
            name="preparation_instructions"
            type="textarea"
            placeholder="Special instructions for patients"
            value={testData.preparation_instructions}
            onChange={onChange}
            error={validationErrors?.preparation_instructions}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <FormField
              label="Fasting Required"
              id="test-fasting"
              name="fasting_required"
              type="checkbox"
              checked={testData.fasting_required}
              onChange={onChange}
              error={validationErrors?.fasting_required}
            />
          </div>

          {testData.fasting_required && (
            <div className="mt-2">
              <FormField
                label="Fasting Duration (hours)"
                id="test-fasting-duration"
                name="fasting_duration"
                type="number"
                placeholder="e.g., 8"
                value={testData.fasting_duration}
                onChange={onChange}
                error={validationErrors?.fasting_duration}
              />
            </div>
          )}
        </div>
      </div>

      {/* Parameters Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Test Parameters</h3>
          <button
            type="button"
            onClick={() => setShowParameterForm(true)}
            className="flex items-center text-sm px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          >
            <FaPlus className="mr-1" size={12} /> Add Parameter
          </button>
        </div>

        {testData.parameters.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No parameters added yet</p>
            <button
              type="button"
              onClick={() => setShowParameterForm(true)}
              className="mt-2 text-indigo-600 hover:underline"
            >
              Add your first parameter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Normal Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testData.parameters.map((param, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {param.parameter_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {param.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {param.normal_range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => onRemoveParameter(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Parameter Form */}
        {showParameterForm && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3 flex justify-between">
              <span>Add New Parameter</span>
              <button
                type="button"
                onClick={() => setShowParameterForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField
                label="Parameter Name"
                id="parameter-name"
                name="parameter_name"
                type="text"
                placeholder="e.g., Hemoglobin"
                value={newParameter.parameter_name}
                onChange={onParameterChange}
                required
              />
              <FormField
                label="Unit"
                id="parameter-unit"
                name="unit"
                type="text"
                placeholder="e.g., g/dL"
                value={newParameter.unit}
                onChange={onParameterChange}
                required
              />
              <FormField
                label="Normal Range"
                id="parameter-range"
                name="normal_range"
                type="text"
                placeholder="e.g., 13-17"
                value={newParameter.normal_range}
                onChange={onParameterChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Critical Low"
                id="parameter-critical-low"
                name="critical_low"
                type="text"
                placeholder="e.g., 7"
                value={newParameter.critical_low}
                onChange={onParameterChange}
              />
              <FormField
                label="Critical High"
                id="parameter-critical-high"
                name="critical_high"
                type="text"
                placeholder="e.g., 20"
                value={newParameter.critical_high}
                onChange={onParameterChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Method"
                id="parameter-method"
                name="method"
                type="text"
                placeholder="e.g., Colorimetric"
                value={newParameter.method}
                onChange={onParameterChange}
              />
              <FormField
                label="Instrument"
                id="parameter-instrument"
                name="instrument"
                type="text"
                placeholder="e.g., Sysmex XN-1000"
                value={newParameter.instrument}
                onChange={onParameterChange}
              />
            </div>
            <div className="mb-4">
              <FormField
                label="Parameter Description"
                id="parameter-description"
                name="description"
                type="textarea"
                placeholder="Description of the parameter"
                value={newParameter.description}
                onChange={onParameterChange}
              />
            </div>
            <div className="mb-4">
              <FormField
                label="Interpretation Guide"
                id="parameter-guide"
                name="interpretation_guide"
                type="textarea"
                placeholder="Guide for interpreting results"
                value={newParameter.interpretation_guide}
                onChange={onParameterChange}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onAddParameter}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaPlus className="mr-2" />
                Add Parameter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormTest;
