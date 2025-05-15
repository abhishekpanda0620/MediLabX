import React, { useState } from 'react';
import { FaClock, FaFlask, FaList, FaMoneyBill, FaUtensils } from 'react-icons/fa';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import ReportViewer from './ReportViewer';
import { Modal } from '../../components/common';

const ViewTestModal = ({ isOpen, onClose, test }) => {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showReportViewer, setShowReportViewer] = useState(false);

  if (!test) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={test?.name}
        size="4xl"
      >
        {/* Test Header */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">{test?.code}</div>
          <div className="mt-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full inline-block">
            {test?.category}
          </div>
        </div>
        
        {/* Test Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            {test?.description && (
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
                  <span>Specimen: {test?.specimen_requirements}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>Turn Around Time: {test?.turn_around_time} hours</span>
                </div>
                {test?.preparation_instructions && (
                  <div className="flex items-start text-gray-600">
                    <FaList className="mr-2 mt-1" />
                    <div>
                      <span>Preparation:</span>
                      <p className="mt-1 text-sm">{test.preparation_instructions}</p>
                    </div>
                  </div>
                )}
                {test?.fasting_required && (
                  <div className="flex items-center text-gray-600">
                    <FaUtensils className="mr-2" />
                    <span>Fasting Required: {test.fasting_duration} hours</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <FaMoneyBill className="mr-2" />
                  <span>Price: {formatPrice(test?.price)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Parameters ({test?.parameters?.length || 0})</h3>
            {test?.parameters?.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 grid grid-cols-3 gap-2 font-medium text-gray-600 text-sm">
                  <div>Parameter</div>
                  <div>Unit</div>
                  <div>Reference Range</div>
                </div>
                <div className="divide-y">
                  {test.parameters.map((param, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 grid grid-cols-3 gap-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedParameter(param);
                      }}
                    >
                      <div className="font-medium">{param.parameter_name}</div>
                      <div>{param.unit}</div>
                      <div>{param.normal_range}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">No parameters defined</div>
            )}
          </div>
        </div>

        {selectedParameter && (
          <div className="border rounded-lg p-4 bg-gray-50 mb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedParameter.parameter_name}</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedParameter(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Description</div>
                <div className="text-gray-600 mt-1">{selectedParameter.description || 'None'}</div>
              </div>
              <div>
                <div className="font-semibold">Method</div>
                <div className="text-gray-600 mt-1">{selectedParameter.method || 'Not specified'}</div>
              </div>
              <div>
                <div className="font-semibold">Instrument</div>
                <div className="text-gray-600 mt-1">{selectedParameter.instrument || 'Not specified'}</div>
              </div>
              <div>
                <div className="font-semibold">Critical Values</div>
                <div className="text-gray-600 mt-1">
                  {selectedParameter.critical_low && selectedParameter.critical_high 
                    ? `< ${selectedParameter.critical_low} or > ${selectedParameter.critical_high} ${selectedParameter.unit}`
                    : 'Not specified'}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="font-semibold mb-2">Interpretation Guide</div>
              <div className="text-gray-600 bg-white p-3 rounded-md border">
                {selectedParameter.interpretation_guide || 'No interpretation guidelines available'}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <div>Created: {formatDateTime(test?.created_at)}</div>
          <div>Updated: {formatDateTime(test?.updated_at)}</div>
        </div>
      </Modal>

      {showReportViewer && (
        <ReportViewer
          isOpen={showReportViewer}
          onClose={() => setShowReportViewer(false)}
          test={test}
        />
      )}
    </>
  );
};

export default ViewTestModal;