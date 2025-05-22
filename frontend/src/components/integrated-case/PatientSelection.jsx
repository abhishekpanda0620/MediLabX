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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      

      {!selectedPatient ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                placeholder="Search patients by name, email, or phone..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow hover:bg-blue-700 transition"
              onClick={() => setIsCreatingPatient(true)}
            >
              <FaUserPlus className="mr-2" />
              New Patient
            </button>
          </div>

          {isCreatingPatient ? (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                Register New Patient
              </h3>
              <PatientForm
                patientData={newPatientData}
                onChange={handlePatientInputChange}
                errors={patientErrors}
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsCreatingPatient(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
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
                    className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition shadow-sm flex flex-col gap-2"
                    onClick={() => selectPatient(patient)}
                  >
                    <span className="font-semibold text-blue-800">{patient.name}</span>
                    <span className="text-sm text-gray-600">{patient.email}</span>
                    <span className="text-sm text-gray-500">{patient.phone}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3">No patients found. Try a different search.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="font-semibold text-blue-800 text-lg">{selectedPatient.name}</span>
            <span className="block text-sm text-gray-600">{selectedPatient.email}</span>
            <span className="block text-sm text-gray-500">{selectedPatient.phone}</span>
          </div>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
