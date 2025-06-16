import React from 'react';
import TopSection from './components/TopSection';
import HorizontalScroll from './components/HorizontalScroll';
import BottomSection from './components/BottomSection';

export function LandingPage() {
  return (
    <div className="font-sans">
      <TopSection />
      <HorizontalScroll />
      <BottomSection />
    </div>
  );
}

