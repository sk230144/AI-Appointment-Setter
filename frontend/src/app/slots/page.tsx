'use client';

import { useState } from 'react';
import { Clock, Lock, Unlock, Plus, Calendar } from 'lucide-react';
import CalendarView from '@/components/CalendarView';

interface TimeSlot {
  time: string;
  status: 'available' | 'booked' | 'blocked';
  customerName?: string;
}

export default function SlotsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Mock time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const statuses: TimeSlot['status'][] = ['available', 'booked', 'blocked', 'available', 'available'];

    // Morning slots (9:00 AM - 12:00 PM)
    for (let hour = 9; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        slots.push({
          time,
          status,
          customerName: status === 'booked' ? 'John Doe' : undefined,
        });
      }
    }

    // Afternoon slots (2:00 PM - 5:00 PM)
    for (let hour = 14; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        slots.push({
          time,
          status,
          customerName: status === 'booked' ? 'Jane Smith' : undefined,
        });
      }
    }

    return slots;
  };

  const slots = generateTimeSlots();

  const getStatusColor = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available':
        return 'from-green-500 to-emerald-500';
      case 'booked':
        return 'from-blue-500 to-cyan-500';
      case 'blocked':
        return 'from-orange-500 to-red-500';
    }
  };

  const getStatusIcon = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available':
        return <Unlock className="w-4 h-4" />;
      case 'booked':
        return <Clock className="w-4 h-4" />;
      case 'blocked':
        return <Lock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: slots.length,
    available: slots.filter((s) => s.status === 'available').length,
    booked: slots.filter((s) => s.status === 'booked').length,
    blocked: slots.filter((s) => s.status === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Time Slots</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage available time slots and bookings</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
            <Lock className="w-5 h-5 text-orange-600" />
            Block Slot
          </button>
          <button className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Slot
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 animate-fadeIn hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Total Slots</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div className="glass-card p-6 animate-fadeIn hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-10">
              <Unlock className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Available</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.available}</p>
        </div>

        <div className="glass-card p-6 animate-fadeIn hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Booked</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.booked}</p>
        </div>

        <div className="glass-card p-6 animate-fadeIn hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-10">
              <Lock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Blocked</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.blocked}</p>
        </div>
      </div>

      {/* Date Selector & View Toggle */}
      <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-input px-4 py-2 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'glass-button text-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-2 rounded-xl transition-all ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'glass-button text-gray-700'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-6">
          {/* Morning Slots */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '250ms' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
              Morning Slots (9:00 AM - 12:00 PM)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.slice(0, 6).map((slot, index) => (
                <div
                  key={index}
                  className={`
                    glass-button p-4 rounded-xl cursor-pointer
                    transition-all duration-200 hover:scale-105
                    ${slot.status === 'available' ? 'hover:glow-success' : ''}
                  `}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${getStatusColor(slot.status)} bg-opacity-10 mb-2`}>
                    {getStatusIcon(slot.status)}
                  </div>
                  <p className="text-lg font-bold text-gray-800">{slot.time}</p>
                  <p className="text-xs text-gray-600 mt-1 capitalize">{slot.status}</p>
                  {slot.customerName && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{slot.customerName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
              Afternoon Slots (2:00 PM - 5:00 PM)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.slice(6, 12).map((slot, index) => (
                <div
                  key={index}
                  className={`
                    glass-button p-4 rounded-xl cursor-pointer
                    transition-all duration-200 hover:scale-105
                    ${slot.status === 'available' ? 'hover:glow-success' : ''}
                  `}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${getStatusColor(slot.status)} bg-opacity-10 mb-2`}>
                    {getStatusIcon(slot.status)}
                  </div>
                  <p className="text-lg font-bold text-gray-800">{slot.time}</p>
                  <p className="text-xs text-gray-600 mt-1 capitalize">{slot.status}</p>
                  {slot.customerName && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{slot.customerName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="animate-fadeIn" style={{ animationDelay: '250ms' }}>
          <CalendarView />
        </div>
      )}
    </div>
  );
}
