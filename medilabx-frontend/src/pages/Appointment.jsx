import React, { useState } from 'react';
import Layout from '../components/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Generate days for the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          {/* Calendar Section */}
          <div className="pr-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={previousMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-12 rounded-lg flex items-center justify-center
                    ${!isSameMonth(day, currentMonth) && 'text-gray-400'}
                    ${isToday(day) && 'bg-indigo-300 text-indigo-600'}
                    ${selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') 
                      && 'bg-indigo-600 text-white'}
                    hover:bg-indigo-300 active:bg-indigo-300
                  `}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="mt-8 md:mt-0 md:pl-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Time Slots for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Booking Form */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Test Type</label>
                  <select className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>Blood Test</option>
                    <option>X-Ray</option>
                    <option>MRI Scan</option>
                    <option>CT Scan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea 
                    className="mt-1 block w-full rounded-md outline-none p-2 border-gray-500 shadow-md focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;