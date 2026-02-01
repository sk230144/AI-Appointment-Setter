'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Settings,
  Users,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Time Slots', href: '/slots', icon: Clock },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Call Logs', href: '/calls', icon: PhoneCall },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass-button p-3 rounded-xl"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Desktop collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed top-4 left-4 z-50 glass-button p-3 rounded-xl items-center justify-center hover:scale-110 transition-all"
        style={{ left: isCollapsed ? '88px' : '276px' }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-800" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-40
          glass-card-strong border-r-2 border-white/20
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-white/10 ${isCollapsed ? 'lg:p-4' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-3'}`}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="lg:block">
                <h1 className="text-xl font-bold gradient-text">AI Assistant</h1>
                <p className="text-xs text-gray-600">Booking System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center rounded-xl
                  transition-all duration-200 group
                  ${isCollapsed ? 'lg:justify-center lg:px-3 lg:py-3' : 'gap-3 px-4 py-3'}
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'glass-button text-gray-700 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 shrink-0 ${
                    isActive ? 'text-white' : 'text-purple-600'
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="font-medium lg:block">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse lg:block" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`absolute bottom-6 ${isCollapsed ? 'lg:left-2 lg:right-2' : 'left-4 right-4'}`}>
          <div className={`glass-card group cursor-pointer hover:scale-105 transition-transform ${isCollapsed ? 'lg:p-2' : 'p-4'}`}>
            <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                A
              </div>
              {!isCollapsed && (
                <div className="flex-1 lg:block">
                  <p className="font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-600">admin@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
