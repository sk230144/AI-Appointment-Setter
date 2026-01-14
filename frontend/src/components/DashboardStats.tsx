'use client';

import { Calendar, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  gradient: string;
}

function StatsCard({ title, value, change, icon, gradient }: StatsCardProps) {
  return (
    <div className="glass-card p-6 group cursor-pointer hover:scale-105 transition-all duration-300 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">{change}</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${gradient} bg-opacity-10 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const stats = [
    {
      title: 'Total Appointments',
      value: 248,
      change: '+12%',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      title: "Today's Bookings",
      value: 24,
      change: '+8%',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      title: 'Completed',
      value: 186,
      change: '+15%',
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      title: 'Total Customers',
      value: 142,
      change: '+23%',
      icon: <Users className="w-6 h-6 text-orange-600" />,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
}
