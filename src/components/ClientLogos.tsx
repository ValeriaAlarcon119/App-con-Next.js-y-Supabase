import React from 'react';
import Image from 'next/image';

const ClientLogos = () => {
  const logos = [
    { name: 'Cliente 1', src: '/images/clients/client1.png' },
    { name: 'Cliente 2', src: '/images/clients/client2.png' },
    { name: 'Cliente 3', src: '/images/clients/client3.png' },
    { name: 'Cliente 4', src: '/images/clients/client4.png' },
    { name: 'Cliente 5', src: '/images/clients/client5.png' },
    { name: 'Cliente 6', src: '/images/clients/client6.png' },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-center items-center space-x-8 md:space-x-12 py-4 animate-marquee">
        {logos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all">
            <Image 
              src={logo.src} 
              alt={logo.name} 
              width={120} 
              height={50}
              className="h-10 w-auto object-contain" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogos; 