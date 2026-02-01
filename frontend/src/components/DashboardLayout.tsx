'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(288); // 72 * 4 = 288px (w-72)
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check if desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Listen for sidebar width changes
    const handleResize = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };

    // Initial check
    setTimeout(handleResize, 100);

    // Listen for window resize and transitions
    window.addEventListener('resize', handleResize);

    // Use MutationObserver to detect class changes on sidebar
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      const observer = new MutationObserver(handleResize);
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', checkDesktop);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Main content */}
      <main
        className="p-8 transition-all duration-300"
        style={{
          marginLeft: isDesktop ? `${sidebarWidth}px` : '0px'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
