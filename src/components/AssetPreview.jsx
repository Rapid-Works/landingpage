import React, { useState } from "react";
import { Download, Eye, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/Modal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

const AssetPreview = ({ asset, paid = true }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleBusinessCardDownload = () => {
    if (!paid) return;
    const front = document.createElement("a");
    front.href = asset.downloadUrl;
    front.download = asset.name.toLowerCase().replace(/\s+/g, "-") + "-front.png";
    document.body.appendChild(front);
    front.click();
    document.body.removeChild(front);

    if (asset.backDownloadUrl) {
      const back = document.createElement("a");
      back.href = asset.backDownloadUrl;
      back.download = asset.name.toLowerCase().replace(/\s+/g, "-") + "-back.png";
      document.body.appendChild(back);
      back.click();
      document.body.removeChild(back);
    }
  };

  const renderDownloadButton = (isModal = false) => {
    if (!paid) return null;
    if (asset.type === "website") {
      return (
        <Button asChild className="flex-1 min-w-[110px]">
          <a
            href={asset.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center whitespace-nowrap"
          >
            <ExternalLink className="h-5 w-5" /> Website
          </a>
        </Button>
      );
    }

    if (asset.type === "business-card" || asset.type === "business-card-alt") {
      return (
        <Button onClick={handleBusinessCardDownload} className="flex-1 min-w-[110px] flex items-center justify-center gap-2 whitespace-nowrap">
          <Download className="h-5 w-5" /> Download
        </Button>
      );
    }

    return (
      <Button asChild className="flex-1 min-w-[110px] flex items-center justify-center gap-2 whitespace-nowrap">
        <a href={asset.downloadUrl} download className="flex items-center gap-2 justify-center whitespace-nowrap">
          <Download className="h-5 w-5" /> Download
        </a>
      </Button>
    );
  };

  // Both buttons for card/modal
  const previewButton = (
    <Button 
      variant="outline"
      onClick={() => setIsPreviewOpen(true)}
      className="flex-1 min-w-[110px] flex flex-row items-center justify-center gap-2 whitespace-nowrap"
    >
      <Eye className="h-4 w-4" /> Preview
    </Button>
  );
  const downloadButton = renderDownloadButton();
  const bothButtons = [previewButton, downloadButton].filter(Boolean);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{asset.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        {(asset.type === "business-card" || asset.type === "business-card-alt") && asset.backDownloadUrl ? (
          <div className="relative aspect-video bg-gray-100 overflow-hidden flex">
            <div className="w-1/2 border-r border-gray-200">
              <img
                src={asset.preview || "/placeholder.svg"}
                alt={`${asset.name} - Front`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="w-1/2">
              <img
                src={asset.backDownloadUrl || "/placeholder.svg"}
                alt={`${asset.name} - Back`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <img
              src={asset.preview || "/placeholder.svg"}
              alt={asset.name}
              className={`h-full w-full ${asset.type === "hoodie" ? "object-cover" : "object-contain"}`}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className={`flex gap-3 p-4 pt-4 mt-auto ${bothButtons.length === 1 ? 'justify-center' : 'justify-between'}`}>
        {bothButtons}
      </CardFooter>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={asset.name}
      >
        <div className="mt-6">
          {(asset.type === "business-card" || asset.type === "business-card-alt") && asset.backDownloadUrl ? (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">Front</h3>
                  <img
                    src={asset.preview || "/placeholder.svg"}
                    alt={`${asset.name} - Front`}
                    className="w-full h-auto max-h-[60vh] object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">Back</h3>
                  <img
                    src={asset.backDownloadUrl || "/placeholder.svg"}
                    alt={`${asset.name} - Back`}
                    className="w-full h-auto max-h-[60vh] object-contain rounded"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={asset.preview || "/placeholder.svg"}
                alt={asset.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}
          <div className={`mt-4 flex gap-3 justify-center`}>
            {renderDownloadButton(true)}
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default AssetPreview; 