'use client';

import { Users, Search, Filter, Download } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Customers</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage your customer database</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="glass-card p-12 text-center animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
            <Users className="w-16 h-16 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Coming Soon</h2>
          <p className="text-gray-600 text-lg">
            Customer management features are currently under development.
            This page will include customer profiles, contact history, and analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
