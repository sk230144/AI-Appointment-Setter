'use client';

import { useState } from 'react';
import { Calendar, Clock, Phone, User, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Appointment } from '@/types';

interface AppointmentTableProps {
  appointments?: Appointment[];
}

export default function AppointmentTable({ appointments = [] }: AppointmentTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Mock data for demonstration
  const mockAppointments: Appointment[] = [
    {
      _id: '1',
      customerName: 'John Doe',
      phoneNumber: '+1234567890',
      appointmentDate: '2024-01-15',
      appointmentTime: '09:00',
      status: 'scheduled',
      callSid: 'CA123',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
    },
    {
      _id: '2',
      customerName: 'Jane Smith',
      phoneNumber: '+0987654321',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30',
      status: 'confirmed',
      callSid: 'CA124',
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: '2024-01-10T11:00:00Z',
    },
    {
      _id: '3',
      customerName: 'Mike Johnson',
      phoneNumber: '+1122334455',
      appointmentDate: '2024-01-15',
      appointmentTime: '14:00',
      status: 'completed',
      callSid: 'CA125',
      createdAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
    {
      _id: '4',
      customerName: 'Sarah Williams',
      phoneNumber: '+5544332211',
      appointmentDate: '2024-01-15',
      appointmentTime: '15:30',
      status: 'cancelled',
      callSid: 'CA126',
      createdAt: '2024-01-10T13:00:00Z',
      updatedAt: '2024-01-14T09:00:00Z',
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'badge-info',
      confirmed: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      rescheduled: 'badge-warning',
    };
    return badges[status as keyof typeof badges] || 'glass-badge';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-card overflow-hidden animate-fadeIn">
      {/* Table Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
        <p className="text-sm text-gray-600 mt-1">Manage and track all appointments</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Customer</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Contact</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Time</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayAppointments.map((appointment, index) => (
              <tr
                key={appointment._id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slideInRight"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Customer */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {appointment.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appointment.customerName}</p>
                      <p className="text-xs text-gray-500">ID: {appointment._id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{appointment.phoneNumber}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>
                </td>

                {/* Time */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{appointment.appointmentTime}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`${getStatusBadge(appointment.status)} text-xs`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="glass-button p-2 rounded-lg hover:scale-110 transition-transform">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="glass-button p-2 rounded-lg hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                    <button className="glass-button p-2 rounded-lg hover:scale-110 transition-transform">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {displayAppointments.length} of {displayAppointments.length} appointments
        </p>
        <div className="flex gap-2">
          <button className="glass-button px-4 py-2 text-sm rounded-lg">Previous</button>
          <button className="glass-button px-4 py-2 text-sm rounded-lg bg-purple-500 text-white">
            1
          </button>
          <button className="glass-button px-4 py-2 text-sm rounded-lg">2</button>
          <button className="glass-button px-4 py-2 text-sm rounded-lg">3</button>
          <button className="glass-button px-4 py-2 text-sm rounded-lg">Next</button>
        </div>
      </div>
    </div>
  );
}
