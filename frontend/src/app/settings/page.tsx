'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Clock,
  Phone,
  Bell,
  Shield,
  Palette,
  Save,
  RotateCcw,
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Business Hours
    morningStart: '09:00',
    morningEnd: '12:00',
    afternoonStart: '14:00',
    afternoonEnd: '17:00',
    slotDuration: 30,

    // Contact
    businessName: 'Your Business',
    phoneNumber: '+1234567890',
    email: 'contact@business.com',

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    reminderTime: 24,

    // Voice Settings
    voiceLanguage: 'en-US',
    voiceGender: 'female',
  });

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    // Reset to defaults logic
    console.log('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-gray-600 mt-2">Configure your appointment system</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2 group"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Hours */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Business Hours</h2>
                <p className="text-sm text-gray-600">Set your operating hours</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morning Start
                  </label>
                  <input
                    type="time"
                    value={settings.morningStart}
                    onChange={(e) => setSettings({ ...settings, morningStart: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morning End
                  </label>
                  <input
                    type="time"
                    value={settings.morningEnd}
                    onChange={(e) => setSettings({ ...settings, morningEnd: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afternoon Start
                  </label>
                  <input
                    type="time"
                    value={settings.afternoonStart}
                    onChange={(e) => setSettings({ ...settings, afternoonStart: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afternoon End
                  </label>
                  <input
                    type="time"
                    value={settings.afternoonEnd}
                    onChange={(e) => setSettings({ ...settings, afternoonEnd: e.target.value })}
                    className="glass-input w-full px-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot Duration (minutes)
                </label>
                <select
                  value={settings.slotDuration}
                  onChange={(e) => setSettings({ ...settings, slotDuration: Number(e.target.value) })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
                <p className="text-sm text-gray-600">Your business contact details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  placeholder="contact@business.com"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-10">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                <p className="text-sm text-gray-600">Configure notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 glass-button rounded-xl cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="text-gray-700">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive appointment updates via email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-5 h-5 rounded accent-purple-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 glass-button rounded-xl cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="text-gray-700">
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive appointment updates via SMS</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                  className="w-5 h-5 rounded accent-purple-600"
                />
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time (hours before)
                </label>
                <select
                  value={settings.reminderTime}
                  onChange={(e) => setSettings({ ...settings, reminderTime: Number(e.target.value) })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Voice Settings */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-10">
                <Palette className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Voice Settings</h2>
                <p className="text-sm text-gray-600">AI voice preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Language
                </label>
                <select
                  value={settings.voiceLanguage}
                  onChange={(e) => setSettings({ ...settings, voiceLanguage: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Gender
                </label>
                <select
                  value={settings.voiceGender}
                  onChange={(e) => setSettings({ ...settings, voiceGender: e.target.value })}
                  className="glass-input w-full px-4 py-3 rounded-xl"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="glass-card p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">System Info</h2>
                <p className="text-sm text-gray-600">Current system status</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 glass-button rounded-lg">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-semibold text-gray-800">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 glass-button rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <span className="badge-success text-xs">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 glass-button rounded-lg">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-semibold text-gray-800">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
