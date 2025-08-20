import React, { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getTrackingLinkByCode, recordClick } from '../utils/analyticsService';

const TrackingRedirect = () => {
  const { trackingCode } = useParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleClick = async () => {
      // Prevent double execution (React StrictMode protection)
      if (hasProcessed.current || !trackingCode) {
        return;
      }

      hasProcessed.current = true;
      console.log('🔗 Processing tracking click for code:', trackingCode);

      try {
        // Get the tracking link first
        const trackingLink = await getTrackingLinkByCode(trackingCode);
        
        if (trackingLink && trackingLink.destinationUrl) {
          console.log('✅ Found tracking link, recording click...');
          
          // Record click first (ensure it completes)
          await recordClick(trackingCode, {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
          });
          
          console.log('✅ Click recorded, redirecting to:', trackingLink.destinationUrl);
          
          // Then redirect (this should still be very fast)
          window.location.replace(trackingLink.destinationUrl);
          
        } else {
          console.error('❌ No tracking link found for code:', trackingCode);
          // Invalid tracking code - redirect to home
          window.location.replace('/');
        }
      } catch (error) {
        console.error('❌ Error processing tracking click:', error);
        // Still try to redirect if we have the link
        const trackingLink = await getTrackingLinkByCode(trackingCode).catch(() => null);
        if (trackingLink?.destinationUrl) {
          window.location.replace(trackingLink.destinationUrl);
        } else {
          window.location.replace('/');
        }
      }
    };

    // Use setTimeout to ensure immediate execution without blocking
    setTimeout(handleClick, 0);
  }, [trackingCode]);

  // Show minimal loading (should be very brief)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7C3BEC]"></div>
    </div>
  );
};

export default TrackingRedirect;
