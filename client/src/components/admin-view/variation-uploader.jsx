/* eslint-disable react/prop-types */
// client/src/components/admin-view/variation-uploader.jsx
import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { UploadCloud, X, ImageIcon, Trash2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";
import axios from "axios";

function VariationUploader({ formData, setFormData }) {
  const [imageFile, setImageFile] = useState(null);
  const [label, setLabel] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG, PNG, and WEBP images are allowed');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError("");
    }
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
    setError("");
  };

  const validateVariation = () => {
    if (!imageFile) {
      setError("Please select an image file");
      return false;
    }

    if (!label.trim()) {
      setError("Please enter a variation label");
      return false;
    }

    // Check for duplicate labels
    const existingLabels = (formData?.variations || []).map(v => v.label.toLowerCase());
    if (existingLabels.includes(label.toLowerCase().trim())) {
      setError("A variation with this label already exists");
      return false;
    }

    return true;
  };

  const uploadImageToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("my_file", file);

    const response = await axios.post(
      "https://rekkerbrands.onrender.com/api/admin/products/upload-image",
      formDataUpload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to upload image");
    }

    return response.data.result.url;
  };

  const handleAddVariation = async () => {
    if (!validateVariation()) return;

    setIsUploading(true);
    setError("");

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const newVariation = {
        image: imageUrl,
        label: label.trim(),
      };

      // Add to formData
      setFormData(prev => ({
        ...prev,
        variations: [...(prev.variations || []), newVariation]
      }));

      // Reset form
      setImageFile(null);
      setLabel("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Variation added successfully",
        description: `Added variation: ${newVariation.label}`,
      });

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || err.message || "Failed to upload image");
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveVariation = (index) => {
    const variationToRemove = formData.variations[index];
    
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));

    toast({
      title: "Variation removed",
      description: `Removed variation: ${variationToRemove.label}`,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG, PNG, and WEBP images are allowed');
        return;
      }
      setImageFile(file);
      setError("");
    }
  };

  const variationCount = formData?.variations?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-3 block">
          Product Variations
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          Add different variations of your product (colors, sizes, styles, etc.)
        </p>
      </div>

      {/* Add Variation Form */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-base">Add New Variation</h3>
        
        {/* Image Upload */}
        <div>
          <Label htmlFor="variation-file" className="text-sm font-medium mb-2 block">
            Variation Image *
          </Label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors"
          >
            {!imageFile ? (
              <div>
                <Input
                  id="variation-file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="variation-file" className="cursor-pointer">
                  <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP (max 5MB)
                  </p>
                </Label>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {imageFile.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Label Input */}
        <div>
          <Label htmlFor="variation-label" className="text-sm font-medium mb-2 block">
            Variation Label *
          </Label>
          <Input
            id="variation-label"
            type="text"
            placeholder="e.g., Red, Large, Cotton Blend..."
            value={label}
            onChange={handleLabelChange}
            className="w-full"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {label.length}/100 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {/* Add Button */}
        <Button
          type="button"
          onClick={handleAddVariation}
          disabled={isUploading || !imageFile || !label.trim()}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Skeleton className="w-4 h-4 mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              Add Variation
            </>
          )}
        </Button>
      </div>

      {/* Current Variations */}
      {variationCount > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium text-base flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Current Variations ({variationCount})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.variations.map((variation, index) => (
              <div
                key={`${variation.label}-${index}`}
                className="relative bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={variation.image}
                    alt={variation.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/150/150";
                      e.target.alt = "Image failed to load";
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm truncate" title={variation.label}>
                    {variation.label}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  onClick={() => handleRemoveVariation(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">No variations added yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add variations to give customers more options
          </p>
        </div>
      )}
    </div>
  );
}

export default VariationUploader;