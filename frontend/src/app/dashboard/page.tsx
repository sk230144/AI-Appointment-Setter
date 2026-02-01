'use client';

import { Calendar, TrendingUp, Clock, Users } from 'lucide-react';
import DashboardStats from '@/components/DashboardStats';
import AppointmentTable from '@/components/AppointmentTable';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Appointments Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Last 7 days activity</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {[
              { value: 65, label: 'Mon', color: 'from-purple-500 to-pink-500' },
              { value: 45, label: 'Tue', color: 'from-purple-500 to-pink-500' },
              { value: 80, label: 'Wed', color: 'from-purple-500 to-pink-500' },
              { value: 60, label: 'Thu', color: 'from-purple-500 to-pink-500' },
              { value: 90, label: 'Fri', color: 'from-purple-500 to-pink-500' },
              { value: 75, label: 'Sat', color: 'from-blue-500 to-cyan-500' },
              { value: 85, label: 'Sun', color: 'from-blue-500 to-cyan-500' },
            ].map((bar, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-xl bg-gradient-to-t ${bar.color} transition-all duration-300 hover:opacity-80 cursor-pointer shadow-lg`}
                  style={{
                    height: `${bar.value}%`,
                    minHeight: '20px'
                  }}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Upcoming Today</h3>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-3">
              {[
                { time: '09:00 AM', name: 'John Doe', status: 'confirmed' },
                { time: '10:30 AM', name: 'Jane Smith', status: 'scheduled' },
                { time: '02:00 PM', name: 'Mike Johnson', status: 'confirmed' },
                { time: '03:30 PM', name: 'Sarah Williams', status: 'scheduled' },
              ].map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl glass-button hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {appointment.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{appointment.name}</p>
                      <p className="text-xs text-gray-600">{appointment.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${appointment.status === 'confirmed' ? 'badge-success' : 'badge-info'}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-3">
              {[
                { action: 'New appointment', time: '2 min ago', color: 'from-green-500 to-emerald-500' },
                { action: 'Appointment confirmed', time: '15 min ago', color: 'from-blue-500 to-cyan-500' },
                { action: 'Slot blocked', time: '1 hour ago', color: 'from-orange-500 to-red-500' },
                { action: 'Settings updated', time: '2 hours ago', color: 'from-purple-500 to-pink-500' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl glass-button hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${activity.color} animate-pulse`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <AppointmentTable />
    </div>
  );
}
