'use client';

import React, { useState } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { AIAssistantPanel } from '@/components/layout/AIAssistantPanel';
import { VoiceAssistantProtocol } from '@/components/dashboard/VoiceAssistantProtocol';
import { FamilyCallModal } from '@/components/dashboard/FamilyCallModal';
import { useSidebar, useAIPanel } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();
  const { isOpen: isAIPanelOpen, toggle: toggleAIPanel, close: closeAIPanel } = useAIPanel();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-x-hidden">
      {/* Top Fixed Navbar */}
      <DashboardNavbar
        onMenuClick={toggleSidebar}
        onAIPanelToggle={toggleAIPanel}
        isAIPanelOpen={isAIPanelOpen}
      />

      {/* Main Container below Navbar */}
      <div className="flex flex-1 pt-16">
        {/* Left Fixed/Collapsible Sidebar */}
        <DashboardSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 bg-[#020617] bg-grid min-h-[calc(100vh-4rem)] ${
            isSidebarOpen ? 'lg:pl-72' : 'lg:pl-28'
          } ${isAIPanelOpen ? 'xl:pr-96' : ''}`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* Right Sliding JARVIS AI Panel */}
        <AIAssistantPanel isOpen={isAIPanelOpen} onClose={closeAIPanel} />

        {/* Global Voice Assistant Emergency Protocol */}
        <VoiceAssistantProtocol />

        {/* Global Direct Family SOS Calling Overlay */}
        <FamilyCallModal />
      </div>
    </div>
  );
}

