'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: number;
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar days
  const generateCalendar = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    const days: CalendarDay[] = [];

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevLastDate - i,
        isCurrentMonth: false,
        isToday: false,
        appointments: 0,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isCurrentMonth && i === today.getDate(),
        appointments: Math.floor(Math.random() * 5), // Mock data
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        appointments: 0,
      });
    }

    return days;
  };

  const days = generateCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="glass-card p-6 animate-fadeIn">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="glass-button p-2 rounded-lg hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextMonth}
            className="glass-button p-2 rounded-lg hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              relative aspect-square p-2 rounded-xl cursor-pointer
              transition-all duration-200 group
              ${day.isCurrentMonth ? 'glass-button hover:scale-105' : 'opacity-30'}
              ${day.isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : ''}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Date */}
              <span
                className={`text-sm font-semibold ${
                  day.isToday ? 'text-white' : day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {day.date}
              </span>

              {/* Appointments indicator */}
              {day.appointments > 0 && day.isCurrentMonth && (
                <div className="mt-auto flex justify-center gap-1">
                  {Array.from({ length: Math.min(day.appointments, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        day.isToday ? 'bg-white' : 'bg-purple-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tooltip on hover */}
            {day.appointments > 0 && day.isCurrentMonth && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="glass-card px-3 py-2 text-xs font-medium text-gray-800 whitespace-nowrap">
                  {day.appointments} appointment{day.appointments !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <span className="text-sm text-gray-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-600">Has Appointments</span>
        </div>
      </div>
    </div>
  );
}
