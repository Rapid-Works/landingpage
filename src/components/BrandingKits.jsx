import React, { useState, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";
import AssetPreview from "./AssetPreview";
import { brandingKits } from "../data/brandingKits";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import JSZip from 'jszip';

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg border shadow-sm flex flex-col h-full">
    <div className="aspect-video bg-gray-200 rounded-t-lg" />
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-6" />
      </div>
      <div className="flex gap-3 mt-auto">
        <div className="h-10 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const BrandingKits = ({ initialKitId }) => {
  const [selectedKit, setSelectedKit] = useState(initialKitId || null);
  const [tab, setTab] = useState("my"); // Default to My Kits
  const [myKits, setMyKits] = useState([]);
  const [loadingMyKits, setLoadingMyKits] = useState(false);
  const { currentUser } = useAuth();

  // Update selectedKit when initialKitId prop changes
  useEffect(() => {
    setSelectedKit(initialKitId || null);
  }, [initialKitId]);

  useEffect(() => {
    if (tab === "my" && currentUser) {
      setLoadingMyKits(true);
      const fetchMyKits = async () => {
        try {
          console.log('📦 Loading user branding kits...');
          const db = getFirestore();
          const querySnapshot = await getDocs(collection(db, "brandkits"));
          const userKits = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // email can be array or string
            if (Array.isArray(data.email) && data.email.includes(currentUser.email)) {
              userKits.push({ id: doc.id, ...data });
            } else if (typeof data.email === "string" && data.email === currentUser.email) {
              userKits.push({ id: doc.id, ...data });
            }
          });
          console.log(`📦 Found ${userKits.length} branding kits for user`);
          setMyKits(userKits);
        } catch (error) {
          console.log('⚠️ Could not load branding kits from Firestore, using fallback static kits:', error);
          // FALLBACK: Show some demo kits from static data for development
          const demoKits = brandingKits.slice(0, 2).map(kit => ({
            id: kit.id,
            email: currentUser.email,
            paid: true,
            createdAt: new Date()
          }));
          setMyKits(demoKits);
        } finally {
          setLoadingMyKits(false);
        }
      };
      fetchMyKits();
    }
  }, [tab, currentUser]);

  // Helper to render a kit (for both tabs)
  const renderKit = (kit, isMyKit = false) => {
    // Always match kit IDs case-insensitively
    const kitData = isMyKit
      ? brandingKits.find((k) => k.id.toLowerCase() === kit.id.toLowerCase())
      : kit;
    if (!kitData) return <div className="text-center text-red-500">Kit data not found. Please contact support.</div>;
    const paid = isMyKit ? kit.paid : false; // All Kits tab: paid is always false

    // Compare selectedKit case-insensitively
    if (selectedKit && selectedKit.toLowerCase() !== kitData.id.toLowerCase()) return null;

    return (
      <div key={kitData.id} className="space-y-8">
        {/* Back Button */}
        {selectedKit && (
          <Button 
            variant="outline" 
            onClick={() => setSelectedKit(null)}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Kits
          </Button>
        )}

        {/* Kit Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{kitData.name}</h2>
            <p className="text-gray-600 mt-1">{kitData.assets.length} assets available</p>
          </div>
          {/* No Download All Assets button in All Kits tab */}
          {isMyKit && paid && (
            <Button onClick={() => handleDownloadAll(kitData.id)}>
              <Download className="mr-2 h-4 w-4" /> Download All Assets
            </Button>
          )}
        </div>

        {/* Alert for unpaid kits */}
        {isMyKit && !paid && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4 text-center">
            Make payment or contact admin to enable download of high quality assets.
          </div>
        )}

        {/* Tabs for Asset Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="styleguide">Style Guide</TabsTrigger>
            <TabsTrigger value="logo">Logo (Full)</TabsTrigger>
            <TabsTrigger value="logo-icon">Logo (Icon)</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="banner">RollUp</TabsTrigger>
            <TabsTrigger value="business-card">Business Card</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="phone-bg">Phone Background</TabsTrigger>
            <TabsTrigger value="hoodie">Hoodie Design</TabsTrigger>
            <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {kitData.assets.map((asset) => (
              <AssetPreview key={asset.id} asset={asset} paid={paid} />
            ))}
          </TabsContent>

          {["styleguide", "logo", "logo-icon", "website", "banner", "business-card", "qrcode", "phone-bg", "hoodie", "pitch-deck"].map(type => {
            const asset = kitData.assets.find(a => a.type === type);
            if (!asset) return null;
            return (
              <TabsContent key={type} value={type}>
                <AssetPreview asset={asset} paid={paid} />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    );
  };

  const handleDownloadAll = async (kitId) => {
    const kit = brandingKits.find(k => k.id === kitId);
    if (!kit) return;
    const zip = new JSZip();
    const fetchAndAdd = async (asset, filename) => {
      if (!asset.downloadUrl || asset.downloadUrl === "#" || asset.type === "website") return;
      try {
        const response = await fetch(asset.downloadUrl);
        const blob = await response.blob();
        zip.file(filename, blob);
      } catch (e) {
        // Optionally handle error
      }
    };
    await Promise.all(kit.assets.map(async (asset) => {
      const baseName = `${kit.name}-${asset.name}`.toLowerCase().replace(/\s+/g, "-");
      await fetchAndAdd(asset, baseName + (asset.downloadUrl.split('.').pop() ? '.' + asset.downloadUrl.split('.').pop() : ''));
      if (asset.backDownloadUrl) {
        await fetchAndAdd({ ...asset, downloadUrl: asset.backDownloadUrl }, baseName + "-back" + (asset.backDownloadUrl.split('.').pop() ? '.' + asset.backDownloadUrl.split('.').pop() : ''));
      }
    }));
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${kit.name}-assets.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Main render
  return (
    <div className="space-y-8">
      {/* Tab Switcher aligned with avatar */}
      <div className="flex gap-4 mb-8 pt-6 px-6">
        <Button variant={tab === "my" ? "default" : "outline"} onClick={() => { setTab("my"); setSelectedKit(null); }}>
          My Kits
        </Button>
        <Button variant={tab === "all" ? "default" : "outline"} onClick={() => { setTab("all"); setSelectedKit(null); }}>
          Explore Kits
        </Button>
      </div>

      {/* My Kits Tab */}
      {tab === "my" && (
        <div className="px-6">
          {loadingMyKits ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : myKits.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              You don't have any kits yet.<br />
              <span className="text-blue-600 cursor-pointer underline" onClick={() => setTab("all")}>Explore kits</span> or contact admin to get started!
            </div>
          ) : selectedKit ? (
            // Show loading for specific kit while myKits loads, or render kit if found
            (() => {
              const foundKit = myKits.find(k => k.id === selectedKit);
              if (foundKit) {
                return renderKit(foundKit, true);
              } else if (loadingMyKits) {
                // Still loading kits, show loading state for selected kit
                return (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your branding kit...</p>
                    </div>
                  </div>
                );
              } else {
                // Kits loaded but selected kit not found, fall back to grid
                console.log(`⚠️ Selected kit "${selectedKit}" not found in user's kits. Available kits:`, myKits.map(k => k.id));
                setSelectedKit(null); // Reset selection
                return null; // Will re-render and show grid
              }
            })()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myKits.map((kit) => {
                const kitData = brandingKits.find(k => k.id.toLowerCase() === kit.id.toLowerCase());
                if (!kitData) return null;
                return (
                  <div
                    key={kit.id}
                    onClick={() => setSelectedKit(kit.id)}
                    className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={kitData.thumbnail || "/placeholder.svg"}
                        alt={kitData.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {kitData.name}
                      </h3>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>{kitData.assets.length} assets</span>
                        <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Explore Kits Tab */}
      {tab === "all" && !selectedKit && (
        <div className="px-6">
          {brandingKits.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No kits available to explore at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandingKits.map((kit) => (
                <div
                  key={kit.id}
                  onClick={() => setSelectedKit(kit.id)}
                  className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={kit.thumbnail || "/placeholder.svg"}
                      alt={kit.name}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {kit.name}
                    </h3>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>{kit.assets.length} assets</span>
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === "all" && selectedKit && (
        <div className="px-6">
          {renderKit(brandingKits.find(k => k.id === selectedKit))}
        </div>
      )}
    </div>
  );
};

export default BrandingKits; 