import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, Share2, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AssetPreview from "./AssetPreview";
import { brandingKits } from "../data/brandingKits";
import RapidWorksHeader from "./new_landing_page_header";
import { Link, useSearchParams } from "react-router-dom";

const PublicBrandingKits = () => {
  const [selectedKit, setSelectedKit] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Check URL parameter on component mount and update page title
  useEffect(() => {
    const kitId = searchParams.get('kit');
    if (kitId) {
      const kit = brandingKits.find(k => k.id === kitId);
      if (kit) {
        setSelectedKit(kit);
        document.title = `${kit.name} - Branding Kit | RapidWorks`;
        // Small delay to ensure page is loaded before scrolling
        setTimeout(() => {
          document.getElementById('assets-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // If kit ID doesn't exist, clear the parameter
        setSearchParams({});
        document.title = 'Branding Kits | RapidWorks';
      }
    } else {
      document.title = 'Branding Kits | RapidWorks';
    }
  }, [searchParams, setSearchParams]);

  const handleViewKit = (kit) => {
    setSelectedKit(kit);
    setSearchParams({ kit: kit.id });
    setCopied(false); // Reset copied state
    // Scroll to assets section
    document.getElementById('assets-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToKits = () => {
    setSelectedKit(null);
    setSearchParams({});
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareKit = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RapidWorksHeader />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/rapidworks/thumbnail.png" 
              alt="RapidWorks Branding" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 to-purple-800/60"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rapid Branding Explore Section
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Explore our complete branding kits showcasing professional brand identities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                <Link to="/branding">Get Your Branding Kit</Link>
              </Button>
              <Button asChild size="lg" className="bg-purple-500 text-white hover:bg-purple-400 border-0 font-semibold">
                <Link to="/signup">Sign Up to Access</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {!selectedKit ? (
            // Kits Overview
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Available Branding Kits
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Browse through our portfolio of complete brand identity packages. Each kit includes everything needed for a professional brand presence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brandingKits.map((kit) => (
                  <Card key={kit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={kit.thumbnail}
                        alt={`${kit.name} branding kit`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{kit.name}</CardTitle>
                      <p className="text-gray-600">{kit.assets.length} assets</p>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleViewKit(kit)} 
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                      >
                        <Eye className="h-4 w-4" />
                        View Kit
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            // Selected Kit Details
            <section id="assets-section">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToKits}
                    className="mb-4 sm:mb-0"
                  >
                    ← Back to All Kits
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShareKit}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Share Kit
                      </>
                    )}
                  </Button>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedKit.name}
                </h2>
                <p className="text-lg text-gray-600">
                  Complete branding package with {selectedKit.assets.length} professional assets
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedKit.assets.map((asset) => (
                  <AssetPreview key={asset.id} asset={asset} paid={false} />
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-16 text-center bg-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Want Your Own Branding Kit?
                </h3>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get a complete professional brand identity package delivered in just one week. 
                  Everything you need to establish your market presence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                    <Link to="/branding">Order Your Branding Kit</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-400 text-white font-semibold">
                    <Link to="/signup">Sign Up for Access</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBrandingKits; 