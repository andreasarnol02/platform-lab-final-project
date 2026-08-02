import { useState } from "react";

export default function ProductImage({
  src,
  alt,
  className = "",
  placeholderClassName = "img-placeholder commerce-img-placeholder",
  loading,
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={placeholderClassName} role="img" aria-label={alt}>
        m
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
