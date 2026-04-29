const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

const isAbsoluteUrl = (value) =>
  typeof value === "string" && ABSOLUTE_URL_PATTERN.test(value);

const normalizeImage = (img) => {
  if (!img) return null;

  if (typeof img === "object") {
    img = img.url || img.src || img.image;
  }

  if (!img) return null;

  const value = String(img).trim();

  if (!value) return null;

  return isAbsoluteUrl(value) ? value : value.replace(/^\/+/, "");
};

const uniqueMedia = (items) => {
  const seen = new Set();

  return items
    .map(normalizeImage)
    .filter(Boolean)
    .filter((item) => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
};

const collectImages = (...sources) =>
  sources.flatMap((source) => {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    return [source];
  });

export const buildProductImageGallery = (product, selectedVariant = null) => {
  return uniqueMedia(
    collectImages(
      selectedVariant?.image,
      selectedVariant?.images,
      product?.image,
      product?.thumbnail,
      product?.mainImage,
      product?.gallery,
      product?.galleryImages,
      product?.imageUrls,
      product?.media,
      product?.images,
      product?.variants?.map((variant) => variant?.image)
    )
  );
};

export const buildProductMediaGallery = (product, selectedVariant = null) => {
  const images = buildProductImageGallery(product, selectedVariant);
  const video = typeof product?.video === "string" ? product.video.trim() : "";

  return video ? [...images, video] : images;
};
