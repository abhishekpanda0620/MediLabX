import React from 'react';

const ReportInterpretationSection = ({ interpretation, setInterpretation, viewOnly }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Report Interpretation
      </label>
      {viewOnly ? (
        <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 min-h-[100px]">
          {interpretation}
        </div>
      ) : (
        <textarea
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={4}
          placeholder="Enter your interpretation of the test results..."
        />
      )}
    </div>
  );
};

export default ReportInterpretationSection;
