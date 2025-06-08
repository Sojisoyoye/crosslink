import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            CrossLink Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Total Users</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
            </div>

            {/* Total Transactions Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Total Transactions
              </h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">567</p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Total Revenue
              </h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">€12,345</p>
            </div>

            {/* Notifications Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Notifications
              </h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Transactions
            </h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-3">
                <div className="p-2 border-b border-gray-200">
                  Transaction 1: €100
                </div>
                <div className="p-2 border-b border-gray-200">
                  Transaction 2: €200
                </div>
                <div className="p-2 border-b border-gray-200">
                  Transaction 3: €300
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="mt-8 text-center">
            <button className="bg-primary-main text-white font-semibold px-8 py-3 rounded-md shadow-md hover:bg-primary-dark transition duration-300">
              View All Transactions
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
