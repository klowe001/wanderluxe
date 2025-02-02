import React from 'react';

interface HeroSectionProps {
  title: string;
  date: string;
  imageUrl: string;
}

const HeroSection = ({ title, date, imageUrl }: HeroSectionProps) => {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <img 
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;