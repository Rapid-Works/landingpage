import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, authorName, authorTitle, imageUrl, companyLogoUrl, borderColor }) => {
  const initial = authorName ? authorName[0].toUpperCase() : '';
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 h-full relative border-t-4 ${borderColor || 'border-gray-200'} flex flex-col`}>
      <div className="absolute top-6 left-6 text-gray-100 z-0">
        <Quote className="w-20 h-20" strokeWidth={1.5} />
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        <p className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow">
            "{quote}"
          </p>
        <hr className="my-6 border-gray-200" />
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-14 h-14 rounded-full border-2 ${borderColor ? borderColor.replace('border-t-4', 'border') : 'border-blue-300'} flex items-center justify-center font-bold text-2xl bg-blue-50`} style={{ color: borderColor ? '#2563EB' : '#2563EB' }}>
            {initial}
          </div>
          <div className="ml-4">
            <p className="font-bold text-gray-900">{authorName}</p>
            <p className="text-gray-600 text-sm">{authorTitle}</p>
      </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 