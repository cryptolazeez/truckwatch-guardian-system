
import React from 'react';
import ListItem from './ListItem';

interface HowItWorksStepProps {
  num: string;
  title: string;
  description: string;
  details: string[];
  imgSrc: string;
  imgAlt: string;
  reverse?: boolean;
}

const HowItWorksStep = ({ num, title, description, details, imgSrc, imgAlt, reverse = false }: HowItWorksStepProps) => (
  <div className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 py-8 animate-fade-in-up ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2">
      <img src={imgSrc} alt={imgAlt} className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[400px]" />
    </div>
    <div className="md:w-1/2">
      <div className="flex items-center mb-4">
        <span className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold mr-4">{num}</span>
        <h3 className="text-3xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4 text-lg">{description}</p>
      <ul className="space-y-2 text-muted-foreground">
        {details.map((detail, index) => (
          <ListItem key={index}>{detail}</ListItem>
        ))}
      </ul>
    </div>
  </div>
);

export default HowItWorksStep;
