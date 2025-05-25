import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Modal, ModalFooter, Alert } from '../common';
import FormTest from './FormTest';

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
    reference_ranges: '[]',  // Changed from [] to '[]' (JSON string)
    critical_low: '',
    critical_high: '',
    interpretation_guide: '',
    method: '',
    instrument: ''
  });

  const [showParameterForm, setShowParameterForm] = useState(false);
  const [formError, setFormError] = useState(null);

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
        parameters: [...prev.parameters, { 
          ...newParameter,
          // Ensure reference_ranges is a JSON string
          reference_ranges: typeof newParameter.reference_ranges === 'string' 
            ? newParameter.reference_ranges 
            : JSON.stringify(newParameter.reference_ranges)
        }]
      }));
      setNewParameter({
        parameter_name: '',
        unit: '',
        normal_range: '',
        description: '',
        reference_ranges: '[]',
        critical_low: '',
        critical_high: '',
        interpretation_guide: '',
        method: '',
        instrument: ''
      });
      setShowParameterForm(false);
    } else {
      setFormError('Please fill in all required parameter fields');
      setTimeout(() => setFormError(null), 3000);
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
    
    if (!testData.name || !testData.category || testData.parameters.length === 0) {
      setFormError('Please fill in all required fields and add at least one parameter');
      return;
    }
    
    // Ensure all parameters have reference_ranges as JSON strings
    const formattedData = {
      ...testData,
      parameters: testData.parameters.map(param => ({
        ...param,
        reference_ranges: typeof param.reference_ranges === 'string'
          ? param.reference_ranges
          : JSON.stringify(param.reference_ranges)
      }))
    };
    
    onAdd(formattedData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Test"
      size="4xl"
      footer={
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ml-3"
          >
            <FaPlus className="inline-block mr-2" />
            Create Test
          </button>
        </div>
      }
    >
      {formError && (
        <Alert 
          type="error" 
          title={formError}
          onDismiss={() => setFormError(null)} 
        />
      )}
      
      {Object.keys(validationErrors).length > 0 && (
        <Alert
          type="error"
          title="Please correct the following errors:"
          message={
            <ul className="list-disc pl-5 mt-2">
              {Object.entries(validationErrors).map(([field, errors]) => (
                <li key={field}>
                  {field}: {Array.isArray(errors) ? errors[0] : errors}
                </li>
              ))}
            </ul>
          }
          onDismiss={() => {}}
        />
      )}

      <form onSubmit={handleSubmit}>
        <FormTest 
          testData={testData}
          onChange={handleInputChange}
          onParameterChange={handleParameterInputChange}
          onAddParameter={handleAddParameter}
          onRemoveParameter={handleRemoveParameter}
          showParameterForm={showParameterForm}
          setShowParameterForm={setShowParameterForm}
          newParameter={newParameter}
          validationErrors={validationErrors}
          categories={categories}
        />
      </form>
    </Modal>
  );
};

export default AddTestModal;