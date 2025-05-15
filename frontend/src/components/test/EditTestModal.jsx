import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal, ModalFooter, Alert } from '../common';
import FormTest from './FormTest';

const EditTestModal = ({ isOpen, onClose, onEdit, test, validationErrors = {}, categories = [] }) => {
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
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (test) {
      setTestData({
        id: test.id,
        name: test.name,
        description: test.description || '',
        category: test.category || '',
        code: test.code || '',
        turn_around_time: test.turn_around_time || '',
        specimen_requirements: test.specimen_requirements || '',
        preparation_instructions: test.preparation_instructions || '',
        price: test.price || '',
        fasting_required: test.fasting_required || false,
        fasting_duration: test.fasting_duration || '',
        parameters: test.parameters || []
      });
    }
  }, [test]);

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
    
    onEdit(testData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Test: ${test?.name}`}
      size="4xl"
      footer={
        <ModalFooter>
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
            <FaSave className="inline-block mr-2" />
            Save Changes
          </button>
        </ModalFooter>
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

export default EditTestModal;