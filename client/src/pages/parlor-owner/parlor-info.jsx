import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, X, Upload } from "lucide-react";
import { fetchMyParlor, updateParlorImages } from "@/store/admin/parlor-slice";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ParlorOwnerInfo() {
  const dispatch = useDispatch();
  const { myParlor, isLoading } = useSelector((state) => state.adminParlors);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyParlor());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (myParlor?.images) {
      setImages(myParlor.images);
    }
  }, [myParlor]);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    if (images.length + files.length > 6) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 6 images",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is 5MB.`
          );
        }

        const formData = new FormData();
        formData.append("my_file", file);

        const response = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          formData
        );

        return response.data.result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];

      setImages(newImages);

      // Save to database
      if (myParlor?._id) {
        await dispatch(
          updateParlorImages({
            parlorId: myParlor._id,
            images: newImages,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (myParlor?._id) {
      try {
        await dispatch(
          updateParlorImages({
            parlorId: myParlor._id,
            images: newImages,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Image removed successfully",
        });
      } catch (error) {
        console.error("Error removing image:", error);
        toast({
          title: "Error",
          description: "Failed to remove image",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Photo Gallery</h1>
        <p className="text-gray-600">
          Upload high-quality images to showcase your parlor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Parlor Images ({images.length}/6)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg relative group hover:border-gray-400 transition-colors"
              >
                {images[index] ? (
                  <>
                    <img
                      src={images[index]}
                      alt={`Parlor image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      {uploading ? "Uploading..." : "Upload Image"}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              📸 Tips for Great Photos
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use high-resolution images (minimum 800x600px)</li>
              <li>• Show your parlor's interior, services, and ambiance</li>
              <li>• Ensure good lighting and clear focus</li>
              <li>• Maximum file size: 5MB per image</li>
              <li>• Supported formats: JPG, PNG, WEBP</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ParlorOwnerInfo;
