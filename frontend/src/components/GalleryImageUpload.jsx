import { useState } from "react";

export default function GalleryImageUpload({
  maxImages,
  onChange,
  disabled,
}) {
  const [images, setImages] = useState([]);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (images.length >= maxImages) break;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pets");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dqgxjmmt9/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      setImages((prev) => {
        const next = [...prev, data.secure_url];
        onChange(next);
        return next;
      });
    }
  }

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFiles}
        disabled={disabled}
      />

      {images.length > 0 && (
        <div className="gallery-preview">
          {images.map((url, i) => (
            <img key={i} src={url} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}
