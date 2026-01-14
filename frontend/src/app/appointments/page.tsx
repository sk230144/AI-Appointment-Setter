'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Calendar as CalendarIcon, Download } from 'lucide-react';
import AppointmentTable from '@/components/AppointmentTable';

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Appointments</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all appointments</p>
        </div>
        <button className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          New Appointment
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-12 pr-4 py-3 rounded-xl"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="glass-button flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button className="glass-button flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '248', color: 'from-blue-500 to-cyan-500', delay: '200ms' },
          { label: 'Scheduled', value: '42', color: 'from-purple-500 to-pink-500', delay: '250ms' },
          { label: 'Completed', value: '186', color: 'from-green-500 to-emerald-500', delay: '300ms' },
          { label: 'Cancelled', value: '20', color: 'from-orange-500 to-red-500', delay: '350ms' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 text-center animate-fadeIn hover:scale-105 transition-transform cursor-pointer"
            style={{ animationDelay: stat.delay }}
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <AppointmentTable />
      </div>
    </div>
  );
}
