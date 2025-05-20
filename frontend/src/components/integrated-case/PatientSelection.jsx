import React from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import PatientForm from "../patients/PatientForm";

const PatientSelection = ({
  patients,
  patientSearch,
  setPatientSearch,
  filteredPatients,
  isCreatingPatient,
  setIsCreatingPatient,
  newPatientData,
  handlePatientInputChange,
  patientErrors,
  handleCreatePatient,
  selectPatient,
  loading,
  selectedPatient,
  setSelectedPatient
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Step 1: Select or Register Patient
      </h2>

      {!selectedPatient ? (
        <>
          <div className="flex items-center mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Search patients by name, email, or phone..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              onClick={() => setIsCreatingPatient(true)}
            >
              <FaUserPlus className="mr-2" />
              New Patient
            </button>
          </div>

          {isCreatingPatient ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Register New Patient
              </h3>
              <PatientForm
                patientData={newPatientData}
                onChange={handlePatientInputChange}
                errors={patientErrors}
              />
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
                  onClick={() => setIsCreatingPatient(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={handleCreatePatient}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Patient"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50"
                    onClick={() => selectPatient(patient)}
                  >
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3">
                  No patients found. Try a different search or register a
                  new patient.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{selectedPatient.name}</h3>
            <p className="text-sm text-gray-600">{selectedPatient.email}</p>
            <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
          </div>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            onClick={() => setSelectedPatient(null)}
          >
            Change Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientSelection;
