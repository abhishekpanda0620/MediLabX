import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaClock, FaUserMd, FaClipboardCheck } from 'react-icons/fa';
import Lab from '../assets/images/lab.jpg';
import Appointment from '../assets/images/appointment.jpg';
import Dashboard from '../assets/images/dashboard.jpg';

const Home = () => {
  return (
    <Layout>
      <div className="font-['Poppins']">
        {/* Hero Section */}
        <div className="text-center py-8 sm:py-16 bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-indigo-700 leading-tight">
            Your Health Journey <br className="hidden sm:block"/> Starts Here
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-10 text-gray-700 max-w-2xl mx-auto font-['Inter'] px-4">
            Experience modern healthcare solutions with MediLabX. We provide comprehensive pathology services with cutting-edge technology and expert care.
          </p>
          <Link to="/signup">
            <button className="bg-indigo-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold">
              Get Started Today
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="py-8 sm:py-16 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-indigo-700">Why Choose MediLabX?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { icon: <FaHeartbeat className="text-3xl sm:text-4xl text-indigo-500" />, title: "Quality Care", desc: "State-of-the-art laboratory equipment" },
              { icon: <FaClock className="text-3xl sm:text-4xl text-indigo-500" />, title: "Quick Results", desc: "Fast turnaround times for all tests" },
              { icon: <FaUserMd className="text-3xl sm:text-4xl text-indigo-500" />, title: "Expert Staff", desc: "Qualified healthcare professionals" },
              { icon: <FaClipboardCheck className="text-3xl sm:text-4xl text-indigo-500" />, title: "Easy Access", desc: "Digital reports and appointments" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-200">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="py-8 sm:py-16 bg-gray-50 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-indigo-700">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { img: Lab, title: "Advanced Testing", desc: "High-quality pathology reports with quick turnaround times" },
              { img: Appointment, title: "Easy Booking", desc: "Seamless appointment scheduling and management" },
              { img: Dashboard, title: "Digital Reports", desc: "Access your health records anytime, anywhere" }
            ].map((service, index) => (
              <div key={index} className="max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
                <img src={service.img} alt={service.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8 sm:py-16 bg-gradient-to-r from-indigo-600 to-blue-600 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-10 text-white">Join MediLabX today and take control of your health journey.</p>
          <Link to="/signup">
            <button className="bg-white text-indigo-600 py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;