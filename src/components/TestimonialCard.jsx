import React from 'react';
import { Quote } from 'lucide-react'; // Using Quote icon for visual flair

const TestimonialCard = ({ quote, authorName, authorTitle, imageUrl, companyLogoUrl, borderColor = 'border-purple-200' }) => {
  return (
    // Use a subtle background and a thicker left border for emphasis
    <figure className={`relative rounded-xl bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm border-l-4 ${borderColor} overflow-hidden h-full flex flex-col`}>
      {/* Optional: Large quote icon as a background element */}
      <Quote className="absolute top-4 right-4 h-16 w-16 text-gray-100 opacity-80 -z-0" strokeWidth={1.5} />

      <blockquote className="text-gray-700 italic relative z-10 flex-grow">
        <p className="text-base leading-relaxed">"{quote}"</p>
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-x-4 pt-4 border-t border-gray-100 relative z-10">
        {imageUrl ? (
          <img className="h-11 w-11 rounded-full bg-gray-100 object-cover ring-2 ring-white" src={imageUrl} alt={`Photo of ${authorName}`} />
        ) : (
          <div className="h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold ring-2 ring-white">
            {authorName?.charAt(0) || '?'}
          </div>
        )}
        <div className="flex-grow">
          <div className="font-semibold text-gray-900 text-sm">{authorName}</div>
          <div className="text-gray-500 text-xs">{authorTitle}</div>
        </div>
        {companyLogoUrl && (
            <img className="h-7 ml-auto self-center" src={companyLogoUrl} alt={`${authorTitle} Logo`} />
        )}
      </figcaption>
    </figure>
  );
};

export default TestimonialCard; 