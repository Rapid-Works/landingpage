import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ 
  quote, 
  authorName, 
  authorTitle, 
  imageUrl, 
  companyLogoUrl, 
  accentColor = 'gray', // Default to gray
  projectShowcaseImage 
}) => {
  
  // Mapping accentColor to Tailwind classes for border and text
  const colorVariants = {
    purple: { text: 'text-purple-600', bgLight: 'bg-purple-50', border: 'border-purple-500' },
    orange: { text: 'text-orange-600', bgLight: 'bg-orange-50', border: 'border-orange-500' },
    blue: { text: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-500' },
    rose: { text: 'text-rose-600', bgLight: 'bg-rose-50', border: 'border-rose-500' },
    emerald: { text: 'text-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-500' },
    gray: { text: 'text-gray-600', bgLight: 'bg-gray-100', border: 'border-gray-300' }, // Changed gray border
  };
  const currentTheme = colorVariants[accentColor] || colorVariants.gray;

  return (
    <div className={`bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row h-full group ${currentTheme.border} border-l-4 md:border-l-0 md:border-t-4`}>
      
      {/* Text Content Area (Quote & Author) - Takes more space on left */}
      <div className="p-6 md:p-8 flex flex-col flex-grow relative space-y-5 md:w-3/5 lg:w-2/3 order-2 md:order-1">
        <Quote className={`absolute top-4 left-4 h-16 w-16 md:h-20 md:w-20 ${currentTheme.text} opacity-10 transform -translate-x-1/4 -translate-y-1/4`} strokeWidth={1} />
        
        <blockquote className="relative z-10 flex-grow mt-2">
          <p className="text-lg text-gray-700 font-serif italic leading-relaxed">
            "{quote}"
          </p>
        </blockquote>

        <figcaption className="mt-auto pt-5 border-t border-gray-100 relative z-10">
          <div className="flex items-center space-x-4">
            {imageUrl ? (
              <img className="h-12 w-12 rounded-full object-cover shadow-sm" src={imageUrl} alt={`Photo of ${authorName}`} />
            ) : (
              <div className={`h-12 w-12 rounded-full ${currentTheme.bgLight} flex items-center justify-center ${currentTheme.text} font-bold text-xl shadow-sm`}>
                {authorName?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1">
              <div className={`font-semibold ${currentTheme.text} text-base`}>{authorName}</div>
              <div className="text-gray-500 text-sm">{authorTitle}</div>
            </div>
            {companyLogoUrl && (
              <img className="h-8 self-center ml-auto" src={companyLogoUrl} alt={`${authorTitle} Logo`} />
            )}
          </div>
        </figcaption>
      </div>

      {/* Project Showcase Image Area (Right side on md+) */}
      {projectShowcaseImage && (
        <div className="md:w-2/5 lg:w-1/3 bg-gray-50 p-4 flex items-center justify-center order-1 md:order-2 md:border-l border-gray-100">
          <img
            src={projectShowcaseImage}
            alt={`${authorName || 'Project'} showcase`}
            className="max-w-full max-h-64 md:max-h-full object-contain rounded-md" 
            // max-h-64 for mobile, md:max-h-full to use available height on larger screens
            // object-contain to ensure full image is visible
          />
        </div>
      )}
    </div>
  );
};

export default TestimonialCard; 