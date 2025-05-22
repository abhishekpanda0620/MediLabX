import React from "react";
import { FaSearch } from "react-icons/fa";

const TestSelection = ({
  testSearch,
  setTestSearch,
  filteredTests,
  selectTest,
  formatPrice,
  selectedTest,
  setSelectedTest
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      

      {!selectedTest ? (
        <>
          <div className="flex items-center mb-4 gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                placeholder="Search tests by name, code, or category..."
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-green-50 transition shadow-sm flex flex-col gap-2"
                  onClick={() => selectTest(test)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-green-800">{test.name}</h3>
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                      {test.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{test.category}</p>
                  <p className="text-sm font-semibold mt-2 text-green-700">
                    ₹{formatPrice(test.price)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3">No tests found. Try a different search.</p>
            )}
          </div>
        </>
      ) : (
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-green-800 text-lg">{selectedTest.name}</h3>
            <p className="text-sm text-gray-600">
              {selectedTest.code} | {selectedTest.category}
            </p>
            <p className="text-sm font-semibold text-green-700">
              ₹{formatPrice(selectedTest.price)}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={() => setSelectedTest(null)}
          >
            Change Test
          </button>
        </div>
      )}
    </div>
  );
};

export default TestSelection;
