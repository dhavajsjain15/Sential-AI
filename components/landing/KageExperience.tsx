'use client';

import React from 'react';
import { KageLandingPage } from '@/shaders/landing-pages/LandingPages';
import '@/shaders/threeui.css';

export function KageExperience() {
  return (
    <div className="w-full h-screen relative bg-[#080808] overflow-hidden">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}
