import React from "react";
import { FaFlask } from "react-icons/fa";
import { FormField } from "../common";

const BookingForm = ({
  loading,
  doctors,
  bookingDetails,
  handleBookingDetailsChange,
  handleBookTest
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Step 3: Integrated Workflow
      </h2>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-blue-800">
          Streamlined Process
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          This integrated workflow will automatically:
        </p>
        <ul className="list-disc text-sm text-gray-700 ml-6 mt-1">
          <li>Book the test</li>
          <li>Mark sample as collected</li>
          <li>Mark test as processing</li>
          <li>Allow immediate report generation</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Referred by"
          id="doctor-select"
          name="doctor_id"
          type="select"
          required={true}
          options={
            loading
              ? [{ value: "", label: "Loading doctors..." }]
              : [
                  ...doctors.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                  })),
                ]
          }
          value={bookingDetails.doctor_id}
          onChange={handleBookingDetailsChange}
          disabled={loading}
        />

        <FormField
          label="Delivery Method"
          id="delivery-method"
          name="delivery_method"
          type="select"
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
            { value: "in_person", label: "In Person" },
            { value: "print", label: "Print" },
          ]}
          value={bookingDetails.delivery_method}
          onChange={handleBookingDetailsChange}
        />

        <div className="md:col-span-2">
          <FormField
            label="Notes (optional)"
            id="booking-notes"
            name="notes"
            type="textarea"
            placeholder="Any special instructions or notes..."
            value={bookingDetails.notes}
            onChange={handleBookingDetailsChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          onClick={handleBookTest}
          disabled={loading}
        >
          <FaFlask className="mr-2" />
          {loading ? "Processing..." : "Book & Process Test"}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
