import React from 'react';
import Image from 'next/image';

const ClientLogos = () => {
  const logos = [
    { name: 'Tabuga' },
    { name: 'HubSpot' },
    { name: 'CESA' },
    { name: 'Selia' },
    { name: 'Rockstart' },
    { name: 'LatamFintech' },
  ];

  return (
    <div className="w-full overflow-hidden relative group">
      <div className="flex animate-marquee-slower whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-shrink-0 mx-8 md:mx-12">
            <span className="text-xl md:text-3xl font-black text-foreground/40 dark:text-foreground/30 hover:text-primary transition-all cursor-default tracking-tighter uppercase italic">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
      {/* Opacity mask for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
    </div>
  );
};

export default ClientLogos; 