import React, { useState } from 'react';
import { FaTimes, FaClock, FaFlask, FaList, FaMoneyBill, FaUtensils } from 'react-icons/fa';
import { formatPrice, formatDateTime } from '../../utils/formatters';

const ViewTestModal = ({ isOpen, onClose, test }) => {
  const [selectedParameter, setSelectedParameter] = useState(null);

  if (!isOpen || !test) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Test Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{test.name}</h2>
            <div className="mt-1 text-sm text-gray-500">{test.code}</div>
            <div className="mt-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full inline-block">
              {test.category}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Test Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            {test.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{test.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Test Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaFlask className="mr-2" />
                  <span>Specimen: {test.specimen_requirements}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>Turn Around Time: {test.formatted_turn_around_time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUtensils className="mr-2" />
                  <span>{test.fasting_instructions}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMoneyBill className="mr-2" />
                  <span>Price: {formatPrice(test.price)}</span>
                </div>
              </div>
            </div>

            {test.preparation_instructions && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Preparation Instructions</h3>
                <p className="text-gray-600">{test.preparation_instructions}</p>
              </div>
            )}
          </div>

          {/* Parameters List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parameters</h3>
            <div className="bg-gray-50 rounded-lg">
              {test.parameters.map((param, index) => (
                <div
                  key={param.id || index}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => setSelectedParameter(param)}
                >
                  <div className="font-medium text-gray-800">{param.parameter_name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Normal Range: {param.normal_range}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parameter Details Modal */}
        {selectedParameter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedParameter.parameter_name}
                </h3>
                <button 
                  onClick={() => setSelectedParameter(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                {selectedParameter.description && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-600">{selectedParameter.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Measurement</h4>
                    <div className="text-gray-600">
                      <div>Unit: {selectedParameter.unit}</div>
                      <div>Method: {selectedParameter.method}</div>
                      {selectedParameter.instrument && (
                        <div>Instrument: {selectedParameter.instrument}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700">Reference Ranges</h4>
                    <div className="text-gray-600">
                      <div>Normal Range: {selectedParameter.normal_range}</div>
                      {selectedParameter.critical_low && (
                        <div>Critical Low: {selectedParameter.critical_low}</div>
                      )}
                      {selectedParameter.critical_high && (
                        <div>Critical High: {selectedParameter.critical_high}</div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedParameter.interpretation_guide && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Interpretation Guide</h4>
                    <p className="text-gray-600">{selectedParameter.interpretation_guide}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedParameter(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTestModal;