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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-4">
        <h3 className="font-semibold text-yellow-800">
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
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition"
          onClick={handleBookTest}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book & Continue"}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
