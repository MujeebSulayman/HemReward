import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";

const AdminDashboard: React.FC = () => {
  const { address } = useAccount();

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Manage the NECTR token contract settings and permissions
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Contract Management</h2>
          <p className="text-gray-300">
            Admin functions are available for contract owners. Connect your wallet to access these features.
          </p>
        </div>

        {!address && (
          <div className="mt-8 bg-red-900/30 border border-red-700/50 rounded-lg p-4">
            <p className="text-red-400 text-center">
              Please connect your wallet to access admin functions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;