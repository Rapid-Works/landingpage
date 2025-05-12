import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { track } from '@vercel/analytics';

const QRCodeRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the target path from the current URL
    const currentPath = location.pathname;
    
    // Map of QR code paths to their target destinations
    const redirectMap = {
      '/qrcodebranding': '/branding',
      '/qrcodevisibility': '/visibility',
      '/qrcodemvp': '/mvp',
      '/qrcodecoaching': '/coaching',
      '/qrcodefinancing': '/financing',
      '/qrcodeworkshop': '/workshop',
      '/qrcodeblueprint': '/blueprint',
      '/qrcodebundle': '/bundle',
      '/qrcodepartners': '/partners',
    };

    // Get the target path
    const targetPath = redirectMap[currentPath];

    if (targetPath) {
      // Track the QR code scan with Vercel Analytics
      track('qr_code_scan', {
        source: currentPath,
        destination: targetPath,
        timestamp: new Date().toISOString()
      });

      // Redirect to the target path
      navigate(targetPath, { replace: true });
    } else {
      // If no mapping found, redirect to home
      navigate('/', { replace: true });
    }
  }, [navigate, location]);

  return null; // This component doesn't render anything
};

export default QRCodeRedirect; 