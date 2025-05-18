import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaEquals, FaInfoCircle, FaFlask, FaMicroscope, FaQuestionCircle } from 'react-icons/fa';

const ReportParametersSection = ({ 
  parameters, 
  updateParameterValue, 
  validationErrors, 
  viewOnly,
  showDetailedBioReference = false,
  testDetails = {}
}) => {
  const [showDetails, setShowDetails] = useState({});
  
  // Calculate status based on reference range
  const getStatusIndicator = (value, minRange, maxRange, criticalLow, criticalHigh) => {
    // Handle non-numeric, qualitative values (like Positive/Negative)
    if (!value || value === '') return null;
    
    // Handle qualitative results
    if (typeof value === 'string' && !isNaN(parseFloat(value)) === false) {
      const valueLower = value.toLowerCase();
      if (valueLower.includes('positive')) {
        return { 
          icon: <FaArrowUp className="text-orange-600" />, 
          text: 'Positive', 
          color: 'orange',
          hindiText: 'सकारात्मक'
        };
      } else if (valueLower.includes('negative')) {
        return { 
          icon: <FaEquals className="text-green-600" />, 
          text: 'Negative', 
          color: 'green',
          hindiText: 'नकारात्मक'
        };
      } else if (valueLower.includes('abnormal')) {
        return { 
          icon: <FaArrowUp className="text-red-600" />, 
          text: 'Abnormal', 
          color: 'red',
          hindiText: 'असामान्य'
        };
      } else if (valueLower.includes('normal')) {
        return { 
          icon: <FaEquals className="text-green-600" />, 
          text: 'Normal', 
          color: 'green',
          hindiText: 'सामान्य'
        };
      }
      
      // For other text values, return as-is without status indication
      return null;
    }
    
    // For numeric values, continue with standard reference range check
    if (!minRange || !maxRange) return null;

    const numValue = parseFloat(value);
    const min = parseFloat(minRange);
    const max = parseFloat(maxRange);
    const criticalLowVal = criticalLow ? parseFloat(criticalLow) : null;
    const criticalHighVal = criticalHigh ? parseFloat(criticalHigh) : null;
    
    // Check for critical values first
    if (criticalLowVal !== null && numValue < criticalLowVal) {
      return { 
        icon: <FaArrowDown className="text-red-600" />, 
        text: 'Critical Low', 
        color: 'red',
        hindiText: 'अति कम'
      };
    } else if (criticalHighVal !== null && numValue > criticalHighVal) {
      return { 
        icon: <FaArrowUp className="text-red-600" />, 
        text: 'Critical High', 
        color: 'red',
        hindiText: 'अति अधिक'
      };
    } else if (numValue < min) {
      return { 
        icon: <FaArrowDown className="text-blue-600" />, 
        text: 'Low', 
        color: 'blue',
        hindiText: 'कम'
      };
    } else if (numValue > max) {
      return { 
        icon: <FaArrowUp className="text-orange-600" />, 
        text: 'High', 
        color: 'orange',
        hindiText: 'अधिक'
      };
    } else {
      return { 
        icon: <FaEquals className="text-green-600" />, 
        text: 'Normal', 
        color: 'green',
        hindiText: 'सामान्य'
      };
    }
  };

  return (
    <div className="mb-6">
      {showDetailedBioReference && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Test Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-xs font-medium text-gray-700">Test Method</p>
              <p className="text-sm text-gray-600">{testDetails.method || parameters[0]?.method || 'Standard laboratory protocol'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Sample Type</p>
              <p className="text-sm text-gray-600">{testDetails.specimen_requirements || 'Not specified'}</p>
            </div>
          </div>
          {(parameters.some(p => p.critical_low || p.critical_high)) && (
            <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md">
              <p className="text-xs font-medium text-red-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Critical Value Alert
              </p>
              <p className="text-xs text-red-600">
                This test includes parameters with critical reference values that may require urgent medical attention if results fall outside these ranges.
              </p>
            </div>
          )}
        </div>
      )}
    
      <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-2">Test Parameters</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left font-medium text-gray-700">Test</th>
              <th className="px-4 py-2 border text-left font-medium text-gray-700">Result</th>
              <th className="px-4 py-2 border text-left font-medium text-gray-700">Units</th>
              <th className="px-4 py-2 border text-left font-medium text-gray-700">
                Biological Reference Interval
                {showDetailedBioReference && (
                  <div className="inline-flex items-center ml-1 group relative">
                    <FaQuestionCircle className="text-gray-400 text-xs cursor-help" />
                    <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded shadow-lg border border-gray-200 w-64 text-xs text-gray-600 left-0 -mt-2">
                      Biological reference values represent the range of values found in healthy individuals. 
                      Values may vary based on age, gender, and other factors. 
                      Critical values may require immediate clinical attention.
                    </div>
                  </div>
                )}
              </th>
              <th className="px-4 py-2 border text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => {
              const statusIndicator = getStatusIndicator(
                param.value, 
                param.min_range, 
                param.max_range, 
                param.critical_low, 
                param.critical_high
              );
              
              // Check if the parameter is qualitative (non-numeric)
              const isQualitative = param.is_qualitative || 
                (!param.min_range && !param.max_range && 
                 (param.normal_range?.toLowerCase().includes('negative') || 
                  param.normal_range?.toLowerCase().includes('positive')));
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border font-medium relative group">
                    <div className="flex items-center">
                      {param.name}
                      {showDetailedBioReference && (
                        <FaInfoCircle className="ml-1 text-gray-400 text-xs cursor-help" />
                      )}
                    </div>
                    {showDetailedBioReference && (
                      <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded shadow-lg border border-gray-200 w-64 text-xs left-0 mt-1">
                        <p className="font-medium text-gray-700 mb-1">{param.name}</p>
                        <p className="text-gray-600 mb-1">{param.description || 'A standard parameter tested in this investigation.'}</p>
                        {param.method && <p className="text-gray-600">Method: {param.method}</p>}
                      </div>
                    )}
                    {param.sub_name && <div className="text-xs text-gray-500">{param.sub_name}</div>}
                  </td>
                  <td className="px-4 py-2 border">
                    {viewOnly ? (
                      <span className="font-medium">
                        {param.value}
                      </span>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="text"
                          className={`w-full p-1 border rounded ${validationErrors[`parameters.${index}.value`] ? 'border-red-500' : 'border-gray-300'}`}
                          value={param.value || ''}
                          onChange={(e) => updateParameterValue(index, e.target.value)}
                          placeholder="Enter value"
                        />
                      </div>
                    )}
                    {validationErrors[`parameters.${index}.value`] && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[`parameters.${index}.value`]}</p>
                    )}
                    {param.previousValue && (
                      <div className="text-xs text-gray-500 mt-1">
                        Previous: {param.previousValue}
                        {param.previousValue !== param.value && param.value && (
                          <span className={`ml-1 ${parseFloat(param.value) > parseFloat(param.previousValue) ? 'text-red-500' : 'text-blue-500'}`}>
                            ({parseFloat(param.value) > parseFloat(param.previousValue) ? '↑' : '↓'} 
                            {Math.abs(((parseFloat(param.value) - parseFloat(param.previousValue)) / parseFloat(param.previousValue)) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-600">{param.unit}</td>
                  <td className="px-4 py-2 border text-sm">
                    {isQualitative ? (
                      <div className="font-medium">{param.normal_range}</div>
                    ) : (
                      <>
                        <div className="font-medium">{param.min_range} - {param.max_range}</div>
                        {param.normal_range && param.normal_range !== `${param.min_range} - ${param.max_range}` && (
                          <div className="text-xs text-gray-600 mt-1">Standard: {param.normal_range}</div>
                        )}
                      </>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {param.age_specific && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Age-specific
                        </span>
                      )}
                      {param.gender_specific && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Gender-specific
                        </span>
                      )}
                      {isQualitative && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Qualitative
                        </span>
                      )}
                      {showDetailedBioReference && param.method && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FaFlask className="mr-1 text-xs" /> {param.method}
                        </span>
                      )}
                    </div>
                    
                    {!isQualitative && param.critical_low && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center">
                        <FaArrowDown className="mr-1 text-xs" /> Critical low: &lt; {param.critical_low}
                      </div>
                    )}
                    {!isQualitative && param.critical_high && (
                      <div className="text-xs text-red-600 mt-1 flex items-center">
                        <FaArrowUp className="mr-1 text-xs" /> Critical high: &gt; {param.critical_high}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {/* Show only L/H indicators */}
                    {param.value && !isQualitative && param.min_range && param.max_range && (
                      <>
                        {console.log(`Parameter: ${param.name}, Value: ${param.value}, Min: ${param.min_range}, Max: ${param.max_range}, 
                          isHigh: ${Number(param.value) > Number(param.max_range)}, 
                          isLow: ${Number(param.value) < Number(param.min_range)}`)}
                        <span className={`font-bold text-lg ${
                          Number(param.value) < Number(param.min_range) ? 'text-blue-600' : 
                          Number(param.value) > Number(param.max_range) ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {Number(param.value) < Number(param.min_range) ? 'L' : 
                          Number(param.value) > Number(param.max_range) ? 'H' : ''}
                        </span>
                      </>
                    )}
                    
                    {/* Critical indicators */}
                    {param.value && param.critical_low && Number(param.value) < Number(param.critical_low) && (
                      <span className="ml-1 font-bold text-lg text-red-600">L!</span>
                    )}
                    {param.value && param.critical_high && Number(param.value) > Number(param.critical_high) && (
                      <span className="ml-1 font-bold text-lg text-red-600">H!</span>
                    )}
                    
                    {/* Show qualitative result if applicable */}
                    {statusIndicator && isQualitative && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusIndicator.color}-100 text-${statusIndicator.color}-800`}>
                        {statusIndicator.icon}
                        <span className="ml-1">{statusIndicator.text}</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Parameter Details Expansion */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Test Method & Investigation Details</h4>
        {parameters.map((param, index) => (
          <div key={`details-${index}`} className="mb-2 border rounded-md overflow-hidden">
            <div 
              className="bg-gray-50 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => setShowDetails(prev => ({...prev, [index]: !prev[index]}))}
            >
              <div className="flex items-center">
                <span className="font-medium">{param.parameter_name || param.name}</span>
                {param.critical_low || param.critical_high ? (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Critical Values</span>
                ) : null}
                {(param.age_specific || param.gender_specific) && showDetailedBioReference && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {param.age_specific && param.gender_specific ? 'Age & Gender Specific' : 
                     param.age_specific ? 'Age Specific' : 'Gender Specific'}
                  </span>
                )}
              </div>
              <button className="text-indigo-600 hover:text-indigo-800">
                <FaInfoCircle />
              </button>
            </div>
            
            {showDetails[index] && (
              <div className="p-3 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {param.method && (
                    <div className="flex items-start">
                      <FaFlask className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Method</p>
                        <p className="text-sm text-gray-600">{param.method}</p>
                        {showDetailedBioReference && (
                          <p className="text-xs text-gray-500 mt-1">
                            Test methodology used to analyze the sample
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {param.instrument && (
                    <div className="flex items-start">
                      <FaMicroscope className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Instrument</p>
                        <p className="text-sm text-gray-600">{param.instrument}</p>
                        {showDetailedBioReference && (
                          <p className="text-xs text-gray-500 mt-1">
                            Calibrated equipment used for measurement
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {param.description && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700">Description</p>
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                  )}
                  
                  {showDetailedBioReference && testDetails?.description && (
                    <div className="col-span-2 bg-indigo-50 p-2 rounded-md">
                      <p className="text-xs font-medium text-indigo-700">Clinical Context</p>
                      <p className="text-xs text-indigo-600">{testDetails.description}</p>
                    </div>
                  )}
                  
                  {/* Biological Reference Information Section */}
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Biological Reference Information
                      {showDetailedBioReference && (
                        <span className="ml-2 text-xs text-indigo-600">(Values derived from clinical population studies)</span>
                      )}
                    </p>
                    
                    {/* Handle qualitative parameters (non-numeric) differently */}
                    {param.is_qualitative || (!param.min_range && !param.max_range && param.normal_range?.toLowerCase().includes('negative') || param.normal_range?.toLowerCase().includes('positive')) ? (
                      <div className="bg-indigo-50 p-2 rounded-md">
                        <p className="text-xs font-medium text-indigo-700">Qualitative Result Interpretation</p>
                        <p className="text-sm text-indigo-600">
                          Expected: {param.normal_range || 'Not specified'}
                        </p>
                        {showDetailedBioReference && (
                          <div className="mt-1 text-xs text-indigo-500">
                            This is a qualitative parameter that reports presence/absence or descriptive values rather than numeric measurements.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded-md">
                          <p className="text-xs font-medium text-gray-700">Standard Range</p>
                          <p className="text-sm text-gray-600">{param.normal_range || 'Not specified'}</p>
                          {showDetailedBioReference && (
                            <p className="text-xs text-gray-500 mt-1">Derived from general adult population</p>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded-md">
                          <p className="text-xs font-medium text-gray-700">Unit</p>
                          <p className="text-sm text-gray-600">{param.unit || 'Not specified'}</p>
                          {showDetailedBioReference && param.method && (
                            <p className="text-xs text-gray-500 mt-1">Measured using {param.method}</p>
                          )}
                        </div>
                        
                        {param.critical_low && (
                          <div className="bg-blue-50 p-2 rounded-md">
                            <p className="text-xs font-medium text-blue-700 flex items-center">
                              <FaArrowDown className="mr-1" /> Critical Low
                              {showDetailedBioReference && (
                                <span className="ml-2 text-xxs text-blue-500">(May require clinical attention)</span>
                              )}
                            </p>
                            <p className="text-sm text-blue-600">&lt; {param.critical_low} {param.unit}</p>
                          </div>
                        )}
                        
                        {param.critical_high && (
                          <div className="bg-red-50 p-2 rounded-md">
                            <p className="text-xs font-medium text-red-700 flex items-center">
                              <FaArrowUp className="mr-1" /> Critical High
                              {showDetailedBioReference && (
                                <span className="ml-2 text-xxs text-red-500">(May require clinical attention)</span>
                              )}
                            </p>
                            <p className="text-sm text-red-600">&gt; {param.critical_high} {param.unit}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {param.interpretation_guide && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700">Interpretation Guide</p>
                      <p className="text-sm text-gray-600">{param.interpretation_guide}</p>
                    </div>
                  )}
                  
                  {param.reference_ranges && typeof param.reference_ranges === 'object' && (
                    <div className="col-span-2 mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Age/Gender Specific Reference Ranges
                        {showDetailedBioReference && (
                          <span className="ml-2 text-xs text-indigo-600">(Customized for demographic factors)</span>
                        )}
                      </p>
                      <table className="min-w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 border text-left">Age Group</th>
                            <th className="px-2 py-1 border text-left">Gender</th>
                            <th className="px-2 py-1 border text-left">Reference Range</th>
                            {showDetailedBioReference && (
                              <th className="px-2 py-1 border text-left">Clinical Notes</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(param.reference_ranges) && param.reference_ranges.map((range, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-2 py-1 border">
                                {range.min_age && range.max_age ? `${range.min_age}-${range.max_age} years` : 
                                 range.min_age ? `>${range.min_age} years` : 
                                 range.max_age ? `<${range.max_age} years` : 'All ages'}
                              </td>
                              <td className="px-2 py-1 border">
                                {range.gender ? 
                                  <span className={range.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}>
                                    {range.gender.charAt(0).toUpperCase() + range.gender.slice(1)}
                                  </span> 
                                  : 'All'}
                              </td>
                              <td className="px-2 py-1 border font-medium">{range.range}</td>
                              {showDetailedBioReference && (
                                <td className="px-2 py-1 border text-gray-600">
                                  {range.notes || "Standard reference range for this demographic group"}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {showDetailedBioReference && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Reference ranges may vary based on ethnicity, geographic location, and testing methodology
                        </p>
                      )}
                    </div>
                  )}
                  {showDetailedBioReference && (
                    <div className="col-span-2 mt-2 bg-gray-50 p-2 rounded-md">
                      <p className="text-xs font-medium text-gray-700 flex items-center">
                        <FaInfoCircle className="mr-1 text-indigo-600" /> Parameter Context & Significance
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {param.description || 
                          `${param.name} is an important marker that can help evaluate ${
                            param.name.toLowerCase().includes('blood') || param.unit?.toLowerCase().includes('g/dl') ? 'blood health' : 
                            param.name.toLowerCase().includes('liver') || param.name.toLowerCase().includes('alt') || param.name.toLowerCase().includes('ast') ? 'liver function' :
                            param.name.toLowerCase().includes('kidney') || param.name.toLowerCase().includes('creatinine') ? 'kidney function' :
                            param.name.toLowerCase().includes('sugar') || param.name.toLowerCase().includes('glucose') ? 'metabolic health' :
                            param.name.toLowerCase().includes('thyroid') || param.name.toLowerCase().includes('tsh') ? 'thyroid function' :
                            'overall health status'
                          }.`
                        }
                      </p>
                      {param.interpretation_guide && (
                        <p className="text-xs text-gray-600 mt-1">{param.interpretation_guide}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend explaining the status indicators - common in Indian lab reports */}
      <div className="mt-4 bg-gray-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Result Status Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100">
              <FaArrowUp className="text-red-600 text-sm" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium">Critical High <span className="text-red-600">(अति अधिक)</span></p>
              <p className="text-xs text-gray-600">Far above reference range - may require immediate action</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-100">
              <FaArrowUp className="text-orange-600 text-sm" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium">High <span className="text-orange-600">(अधिक)</span></p>
              <p className="text-xs text-gray-600">Above reference range - may indicate abnormality</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100">
              <FaEquals className="text-green-600 text-sm" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium">Normal <span className="text-green-600">(सामान्य)</span></p>
              <p className="text-xs text-gray-600">Within reference range - typically considered healthy</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100">
              <FaArrowDown className="text-blue-600 text-sm" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium">Low <span className="text-blue-600">(कम)</span></p>
              <p className="text-xs text-gray-600">Below reference range - may indicate abnormality</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100">
              <FaArrowDown className="text-red-600 text-sm" />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium">Critical Low <span className="text-red-600">(अति कम)</span></p>
              <p className="text-xs text-gray-600">Far below reference range - may require immediate action</p>
            </div>
          </div>
          
          {showDetailedBioReference && (
            <div className="md:col-span-2 lg:col-span-3 mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-medium mb-2">Qualitative Result Interpretation</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100">
                    <FaEquals className="text-green-600 text-sm" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium">Negative/Normal <span className="text-green-600">(नकारात्मक/सामान्य)</span></p>
                    <p className="text-xs text-gray-600">Expected normal result - typically indicates absence of abnormality</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-100">
                    <FaArrowUp className="text-orange-600 text-sm" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium">Positive <span className="text-orange-600">(सकारात्मक)</span></p>
                    <p className="text-xs text-gray-600">Result indicates presence of measured factor - may need clinical correlation</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {showDetailedBioReference && (
            <div className="md:col-span-2 lg:col-span-3 mt-1 border-t pt-2 text-xs text-gray-600">
              <p className="italic">
                <span className="font-medium">Important:</span> All results should be interpreted in clinical context. Values 
                outside reference ranges are not necessarily abnormal, and normal values do not always exclude pathology.
                Consult with your healthcare provider for interpretation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportParametersSection;
