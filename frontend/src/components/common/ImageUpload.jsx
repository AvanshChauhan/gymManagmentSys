import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, UploadCloud, Trash2 } from "lucide-react";
import { authApi } from "../../api/endpoints.js";

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_MEMBER_FOLDER = "/gymMember";

const ImageUpload = ({ currentImage, onUploaded }) => {
  const [preview, setPreview] = useState(currentImage || "");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreview(currentImage || "");
  }, [currentImage]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setProgress(0);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const authResponse = await authApi.imageKitAuth();
      const auth = authResponse.data.data || authResponse.data;
      const formData = new FormData();

      formData.append("file", file);
      formData.append("fileName", `member-${Date.now()}-${file.name}`);
      formData.append("folder", IMAGEKIT_MEMBER_FOLDER);
      formData.append("publicKey", auth.publicKey);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);

      const { data } = await axios.post(IMAGEKIT_UPLOAD_URL, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const clearPreview = () => {
    setPreview("");
    onUploaded("");
  };

  return (
    <div className="image-upload">
      <div className="image-upload__preview">
        {preview ? (
          <img src={preview} alt="Profile preview" />
        ) : (
          <Camera size={32} />
        )}
      </div>      <div className="image-upload__controls">
        <label className="ghost-button">
          <UploadCloud size={18} />
          Upload Image
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {preview && (
          <button className="ghost-button danger" type="button" onClick={clearPreview}>
            <Trash2 size={18} />
            Delete Profile
          </button>
        )}
      </div>
      {uploading && (
        <div className="image-upload__progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default ImageUpload;
