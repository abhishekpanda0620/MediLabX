import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ReportInterpretationSection = ({ 
  interpretation, 
  setInterpretation, 
  viewOnly, 
  isCritical, 
  setIsCritical,
  showDetailedBioReference = false
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium text-gray-700">Clinical Interpretation</h3>
        
        {/* Critical value flag - common in Indian lab reports */}
        {!viewOnly && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="critical-value"
              checked={isCritical}
              onChange={(e) => setIsCritical(e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded"
            />
            <label htmlFor="critical-value" className="ml-2 text-sm font-medium text-red-600">
              Critical Value Alert
            </label>
          </div>
        )}
        
        {viewOnly && isCritical && (
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
            CRITICAL VALUE ALERT
          </div>
        )}
      </div>
      
      <div className="mb-4">
        {viewOnly ? (
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[100px] whitespace-pre-wrap">
            {interpretation || 'No interpretation provided.'}
          </div>
        ) : (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
            value={interpretation || ''}
            onChange={(e) => setInterpretation(e.target.value)}
            placeholder="Enter clinical interpretation and recommendations..."
          />
        )}
      </div>
      
      {/* Clinical Correlation Note - common in Indian reports */}
      <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
        <p className="font-medium mb-1 flex items-center">
          <FaExclamationTriangle className="text-yellow-600 mr-2" /> Clinical Correlation Advisory:
        </p>
        <p>• The results should be interpreted in conjunction with clinical findings and other laboratory data.</p>
        <p>• Laboratory results may show biological or analytical variations.</p>
        <p>• Repeat testing is recommended for confirmation of abnormal results.</p>
        <p>• Report can be shared with clinical practitioners at patient's discretion.</p>
        
        {showDetailedBioReference && (
          <>
            <div className="mt-2 pt-2 border-t border-yellow-200">
              <p className="font-medium mb-1 flex items-center">
                <FaInfoCircle className="text-yellow-600 mr-2" /> Biological Reference Values Information:
              </p>
              <p>• Reference values are based on studies of healthy individuals and vary by laboratory methodology.</p>
              <p>• Values may differ based on age, gender, ethnicity, geographical location, and other factors.</p>
              <p>• Critical values indicate potential medical urgency and may require immediate attention.</p>
              <p>• Results outside reference ranges are not necessarily pathological and should be evaluated in clinical context.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportInterpretationSection;
