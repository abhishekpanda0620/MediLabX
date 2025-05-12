import React from 'react';
import { 
  FaCheck, FaFlask, FaFileAlt, FaClipboardCheck, 
  FaTimesCircle, FaEye, FaDownload 
} from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';

const SampleActionButtons = ({ 
  sample, 
  status, 
  loading,
  onCollect, 
  onProcess, 
  onGenerateReport, 
  onReview, 
  onComplete,
  onViewReport, 
  onDownloadReport, 
  onCancel 
}) => {
  
  // Get the appropriate action buttons based on the current status
  const renderActionButtons = () => {
    switch (status) {
      case 'booked':
        return (
          <button
            onClick={() => onCollect(sample.id)}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <FaCheck className="mr-1" /> Mark Collected
          </button>
        );
        
      case 'sample_collected':
        return (
          <button
            onClick={() => onProcess(sample.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            <FaFlask className="mr-1" /> Start Processing
          </button>
        );
        
      case 'processing':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onGenerateReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaFileAlt className="mr-1" /> 
              {sample.hasReport ? 'Edit Report' : 'Generate Report'}
            </button>
            <button
              onClick={() => onReview(sample.id)}
              className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center"
              disabled={loading}
            >
              <FaClipboardCheck className="mr-1" /> Mark Reviewed
            </button>
          </div>
        );
        
      case 'reviewed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onViewReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaEye className="mr-1" /> View Report
            </button>
            <button
              onClick={() => onComplete(sample.id)}
              className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center"
              disabled={loading}
            >
              <MdOutlineDone className="mr-1" /> Mark Completed
            </button>
          </div>
        );
        
      case 'completed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onViewReport(sample)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaEye className="mr-1" /> View Report
            </button>
            <button
              onClick={() => onDownloadReport(sample)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center"
              disabled={loading}
            >
              <FaDownload className="mr-1" /> Download PDF
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex gap-2">
      {renderActionButtons()}
      
      {status !== 'completed' && (
        <button
          onClick={() => onCancel(sample)}
          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center"
          disabled={loading}
        >
          <FaTimesCircle className="mr-1" /> Cancel
        </button>
      )}
    </div>
  );
};

export default SampleActionButtons;
